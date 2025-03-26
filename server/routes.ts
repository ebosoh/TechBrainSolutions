import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  contactFormSchema, chatRequestSchema, careerSchema, websiteContentSchema,
  type ContactFormData, type ChatMessageData, type CareerData, type WebsiteContentData, 
  insertUserSchema
} from "@shared/schema";
import { generateChatResponse } from "./openai";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission route
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = contactFormSchema.parse(req.body);
      
      // Store the contact form submission
      const contact = await storage.saveContactForm(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Contact form submitted successfully",
        data: contact
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      } else {
        console.error("Error submitting contact form:", error);
        res.status(500).json({
          success: false,
          message: "An error occurred while submitting the form"
        });
      }
    }
  });

  // Chat API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      // Validate the request body
      const { message, userName, history = [] } = chatRequestSchema.parse(req.body);
      
      // Generate a session ID if not present in the request
      // In a real-world app, this would be tied to a user session
      const sessionId = req.body.sessionId || uuidv4();
      
      // Save the user message to the database
      await storage.saveChatMessage({
        sessionId,
        role: "user",
        content: message,
        history: history
      });
      
      // Generate a response using Deepseek, passing the userName if available
      const response = await generateChatResponse(message, history, userName);
      
      // Save the assistant response to the database
      await storage.saveChatMessage({
        sessionId,
        role: "assistant",
        content: response,
        history: [...history, { role: "user", content: message }]
      });
      
      // Return the response
      res.status(200).json({
        success: true,
        response,
        sessionId
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      } else {
        console.error("Error processing chat message:", error);
        res.status(500).json({
          success: false,
          message: "An error occurred while processing your message"
        });
      }
    }
  });

  // Get chat history
  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const history = await storage.getChatSessionHistory(sessionId);
      
      res.status(200).json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error("Error retrieving chat history:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while retrieving chat history"
      });
    }
  });

  const httpServer = createServer(app);

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "Username already exists" 
        });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user with hashed password
      const newUser = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = newUser;
      
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: userWithoutPassword
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      } else {
        console.error("Error registering user:", error);
        res.status(500).json({
          success: false,
          message: "An error occurred during registration"
        });
      }
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid credentials" 
        });
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid credentials" 
        });
      }
      
      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user;
      
      // In a real app, this would also set a session or return a JWT token
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: userWithoutPassword
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred during login"
      });
    }
  });

  // Career routes
  app.post("/api/careers", async (req, res) => {
    try {
      const validatedData = careerSchema.parse(req.body);
      const career = await storage.createCareer(validatedData);
      res.status(201).json({ success: true, data: career });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      } else {
        console.error("Error creating career:", error);
        res.status(500).json({ success: false, message: "Error creating career" });
      }
    }
  });

  app.get("/api/careers", async (req, res) => {
    try {
      const careers = await storage.getCareers();
      res.status(200).json({ success: true, data: careers });
    } catch (error) {
      console.error("Error fetching careers:", error);
      res.status(500).json({ success: false, message: "Error fetching careers" });
    }
  });
  
  app.get("/api/careers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const career = await storage.getCareer(id);
      
      if (!career) {
        return res.status(404).json({ 
          success: false, 
          message: "Career not found" 
        });
      }
      
      res.status(200).json({ success: true, data: career });
    } catch (error) {
      console.error("Error fetching career:", error);
      res.status(500).json({ success: false, message: "Error fetching career" });
    }
  });
  
  app.put("/api/careers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // Partial validation for update
      const validatedData = careerSchema.partial().parse(req.body);
      
      const career = await storage.updateCareer(id, validatedData);
      res.status(200).json({ success: true, data: career });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      } else {
        console.error("Error updating career:", error);
        res.status(500).json({ success: false, message: "Error updating career" });
      }
    }
  });
  
  app.delete("/api/careers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCareer(id);
      
      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          message: "Career not found or already deleted" 
        });
      }
      
      res.status(200).json({ 
        success: true, 
        message: "Career deleted successfully" 
      });
    } catch (error) {
      console.error("Error deleting career:", error);
      res.status(500).json({ success: false, message: "Error deleting career" });
    }
  });

  // CMS Content Management routes
  app.post("/api/content", async (req, res) => {
    try {
      const validatedData = websiteContentSchema.parse(req.body);
      const content = await storage.saveContent(validatedData);
      res.status(201).json({ success: true, data: content });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      } else {
        console.error("Error creating content:", error);
        res.status(500).json({ success: false, message: "Error creating content" });
      }
    }
  });
  
  app.get("/api/content", async (req, res) => {
    try {
      const { active } = req.query;
      let isActive: boolean | undefined = undefined;
      
      if (active === 'true') isActive = true;
      if (active === 'false') isActive = false;
      
      const content = await storage.getAllContent(isActive);
      res.status(200).json({ success: true, data: content });
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ success: false, message: "Error fetching content" });
    }
  });
  
  app.get("/api/content/section/:section", async (req, res) => {
    try {
      const { section } = req.params;
      const content = await storage.getContentBySection(section);
      res.status(200).json({ success: true, data: content });
    } catch (error) {
      console.error("Error fetching content by section:", error);
      res.status(500).json({ success: false, message: "Error fetching content" });
    }
  });
  
  app.get("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.getContent(id);
      
      if (!content) {
        return res.status(404).json({ 
          success: false, 
          message: "Content not found" 
        });
      }
      
      res.status(200).json({ success: true, data: content });
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ success: false, message: "Error fetching content" });
    }
  });
  
  app.put("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // Partial validation for update
      const validatedData = websiteContentSchema.partial().parse(req.body);
      
      const content = await storage.updateContent(id, validatedData);
      res.status(200).json({ success: true, data: content });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      } else {
        console.error("Error updating content:", error);
        res.status(500).json({ success: false, message: "Error updating content" });
      }
    }
  });
  
  // Dashboard routes
  app.get("/api/dashboard/enquiries", async (req, res) => {
    try {
      const enquiries = await storage.getContactForms();
      res.status(200).json({ success: true, data: enquiries });
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      res.status(500).json({ success: false, message: "Error fetching enquiries" });
    }
  });
  
  app.get("/api/dashboard/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Remove passwords from response
      const safeUsers = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.status(200).json({ success: true, data: safeUsers });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ success: false, message: "Error fetching users" });
    }
  });

  return httpServer;
}
