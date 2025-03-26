import { users, contactForm, chatMessages, type User, type InsertUser, type ContactFormData, type ContactForm, type ChatMessageData, type ChatMessage } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveContactForm(formData: ContactFormData): Promise<ContactForm>;
  
  // Chat related methods
  saveChatMessage(chatData: ChatMessageData): Promise<ChatMessage>;
  getChatSessionHistory(sessionId: string): Promise<ChatMessage[]>;
}

// PostgreSQL database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results.length > 0 ? results[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async saveContactForm(formData: ContactFormData): Promise<ContactForm> {
    const result = await db.insert(contactForm).values(formData).returning();
    console.log("Contact form saved to database:", result[0]);
    return result[0];
  }
  
  async saveChatMessage(chatData: ChatMessageData): Promise<ChatMessage> {
    const result = await db.insert(chatMessages).values(chatData).returning();
    return result[0];
  }
  
  async getChatSessionHistory(sessionId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(chatMessages.createdAt);
  }
}

// Fallback to in-memory storage when database is not available
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactForms: Map<number, ContactForm>;
  private chatMessages: Map<number, ChatMessage>;
  userCurrentId: number;
  contactFormCurrentId: number;
  chatMessageCurrentId: number;

  constructor() {
    this.users = new Map();
    this.contactForms = new Map();
    this.chatMessages = new Map();
    this.userCurrentId = 1;
    this.contactFormCurrentId = 1;
    this.chatMessageCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveContactForm(formData: ContactFormData): Promise<ContactForm> {
    const id = this.contactFormCurrentId++;
    const submittedAt = new Date();
    
    const contactForm: ContactForm = {
      ...formData,
      id,
      submittedAt
    };
    
    this.contactForms.set(id, contactForm);
    console.log("Contact form saved:", contactForm);
    return contactForm;
  }
  
  async saveChatMessage(chatData: ChatMessageData): Promise<ChatMessage> {
    const id = this.chatMessageCurrentId++;
    const createdAt = new Date();
    
    // Ensure history field is properly set
    const history = chatData.history || [];
    
    const chatMessage: ChatMessage = {
      ...chatData,
      id,
      createdAt,
      history
    };
    
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }
  
  async getChatSessionHistory(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.sessionId === sessionId)
      .sort((a, b) => {
        // Null check for createdAt
        const timeA = a.createdAt ? a.createdAt.getTime() : 0;
        const timeB = b.createdAt ? b.createdAt.getTime() : 0;
        return timeA - timeB;
      });
  }
}

// Use the database storage since we have a PostgreSQL database set up
export const storage = new DatabaseStorage();
