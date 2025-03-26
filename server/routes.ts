import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactFormSchema, chatRequestSchema, type ContactFormData, type ChatMessageData } from "@shared/schema";
import { generateChatResponse } from "./openai";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

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
      const { message, history = [] } = chatRequestSchema.parse(req.body);
      
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
      
      // Generate a response using OpenAI
      const response = await generateChatResponse(message, history);
      
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

  return httpServer;
}
