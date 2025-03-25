import { users, type User, type InsertUser, type ContactFormData, type ContactForm } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveContactForm(formData: ContactFormData): Promise<ContactForm>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactForms: Map<number, ContactForm>;
  userCurrentId: number;
  contactFormCurrentId: number;

  constructor() {
    this.users = new Map();
    this.contactForms = new Map();
    this.userCurrentId = 1;
    this.contactFormCurrentId = 1;
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
}

export const storage = new MemStorage();
