import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema from the original file
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contact form schema for the TechBrain website
export const contactForm = pgTable("contact_form", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const contactFormSchema = createInsertSchema(contactForm).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ContactForm = typeof contactForm.$inferSelect;

// Chat related schemas
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  history: jsonb("history").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessageSchema = createInsertSchema(chatMessages).pick({
  sessionId: true,
  role: true,
  content: true,
  history: true,
});

export type ChatMessageData = z.infer<typeof chatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Career related schemas
export const careers = pgTable("careers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(), // full-time, part-time, contract
  createdAt: timestamp("created_at").defaultNow(),
});

export const careerSchema = createInsertSchema(careers).pick({
  title: true,
  description: true,
  requirements: true,
  location: true,
  type: true,
});

export type CareerData = z.infer<typeof careerSchema>;
export type Career = typeof careers.$inferSelect;

// Website content schema
export const websiteContent = pgTable("website_content", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(),
  content: jsonb("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat request schema for validation
export const chatRequestSchema = z.object({
  message: z.string().min(1),
  userName: z.string().optional(),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string()
    })
  ).optional(),
});
