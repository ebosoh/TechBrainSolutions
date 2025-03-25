import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactFormSchema, type ContactFormData } from "@shared/schema";
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

  const httpServer = createServer(app);

  return httpServer;
}
