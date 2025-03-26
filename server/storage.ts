import { 
  users, contactForm, chatMessages, careers, websiteContent, jobApplications,
  type User, type InsertUser, 
  type ContactFormData, type ContactForm, 
  type ChatMessageData, type ChatMessage,
  type CareerData, type Career,
  type WebsiteContentData, type WebsiteContent,
  type JobApplicationData, type JobApplication
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, like } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User related methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Contact form related methods
  saveContactForm(formData: ContactFormData): Promise<ContactForm>;
  getContactForms(limit?: number): Promise<ContactForm[]>;
  
  // Chat related methods
  saveChatMessage(chatData: ChatMessageData): Promise<ChatMessage>;
  getChatSessionHistory(sessionId: string): Promise<ChatMessage[]>;
  
  // Career related methods
  createCareer(careerData: CareerData): Promise<Career>;
  updateCareer(id: number, careerData: Partial<CareerData>): Promise<Career>;
  deleteCareer(id: number): Promise<boolean>;
  getCareer(id: number): Promise<Career | undefined>;
  getCareers(limit?: number): Promise<Career[]>;
  
  // Job Application related methods
  saveJobApplication(applicationData: JobApplicationData): Promise<JobApplication>;
  getJobApplicationById(id: number): Promise<JobApplication | undefined>;
  getJobApplicationsByCareerId(careerId: number): Promise<JobApplication[]>;
  getAllJobApplications(limit?: number): Promise<JobApplication[]>;
  updateJobApplicationStatus(id: number, status: string, notes?: string): Promise<JobApplication>;
  
  // CMS related methods
  saveContent(contentData: WebsiteContentData): Promise<WebsiteContent>;
  updateContent(id: number, contentData: Partial<WebsiteContentData>): Promise<WebsiteContent>;
  getContent(id: number): Promise<WebsiteContent | undefined>;
  getContentBySection(section: string): Promise<WebsiteContent[]>;
  getContentByKey(section: string, key: string): Promise<WebsiteContent | undefined>;
  getAllContent(active?: boolean): Promise<WebsiteContent[]>;
}

// PostgreSQL database storage implementation
export class DatabaseStorage implements IStorage {
  // User related methods
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
  
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.username);
  }

  // Contact form related methods
  async saveContactForm(formData: ContactFormData): Promise<ContactForm> {
    const result = await db.insert(contactForm).values(formData).returning();
    console.log("Contact form saved to database:", result[0]);
    return result[0];
  }
  
  async getContactForms(limit?: number): Promise<ContactForm[]> {
    const query = db.select().from(contactForm).orderBy(desc(contactForm.submittedAt));
    if (limit) {
      query.limit(limit);
    }
    return await query;
  }
  
  // Chat related methods
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
  
  // Career related methods
  async createCareer(careerData: CareerData): Promise<Career> {
    const result = await db.insert(careers).values(careerData).returning();
    return result[0];
  }
  
  async updateCareer(id: number, careerData: Partial<CareerData>): Promise<Career> {
    const result = await db
      .update(careers)
      .set(careerData)
      .where(eq(careers.id, id))
      .returning();
    return result[0];
  }
  
  async deleteCareer(id: number): Promise<boolean> {
    const result = await db
      .delete(careers)
      .where(eq(careers.id, id))
      .returning({ id: careers.id });
    return result.length > 0;
  }
  
  async getCareer(id: number): Promise<Career | undefined> {
    const result = await db
      .select()
      .from(careers)
      .where(eq(careers.id, id));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getCareers(limit?: number): Promise<Career[]> {
    const query = db.select().from(careers).orderBy(desc(careers.createdAt));
    if (limit) {
      query.limit(limit);
    }
    return await query;
  }
  
  // Job Application related methods
  async saveJobApplication(applicationData: JobApplicationData): Promise<JobApplication> {
    const result = await db.insert(jobApplications).values(applicationData).returning();
    return result[0];
  }
  
  async getJobApplicationById(id: number): Promise<JobApplication | undefined> {
    const result = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.id, id));
      
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getJobApplicationsByCareerId(careerId: number): Promise<JobApplication[]> {
    return await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.careerId, careerId))
      .orderBy(desc(jobApplications.submittedAt));
  }
  
  async getAllJobApplications(limit?: number): Promise<JobApplication[]> {
    const query = db
      .select({
        application: jobApplications,
        careerTitle: careers.title
      })
      .from(jobApplications)
      .leftJoin(careers, eq(jobApplications.careerId, careers.id))
      .orderBy(desc(jobApplications.submittedAt));
      
    if (limit) {
      query.limit(limit);
    }
    
    const results = await query;
    
    // Transform the results to return JobApplication objects
    return results.map(result => ({
      ...result.application,
      careerTitle: result.careerTitle
    })) as JobApplication[];
  }
  
  async updateJobApplicationStatus(id: number, status: string, notes?: string): Promise<JobApplication> {
    const now = new Date();
    
    const updateData: any = {
      status,
      updatedAt: now
    };
    
    if (notes !== undefined) {
      updateData.notes = notes;
    }
    
    const result = await db
      .update(jobApplications)
      .set(updateData)
      .where(eq(jobApplications.id, id))
      .returning();
      
    return result[0];
  }
  
  // CMS related methods
  async saveContent(contentData: WebsiteContentData): Promise<WebsiteContent> {
    const result = await db.insert(websiteContent).values(contentData).returning();
    return result[0];
  }
  
  async updateContent(id: number, contentData: Partial<WebsiteContentData>): Promise<WebsiteContent> {
    const now = new Date();
    const result = await db
      .update(websiteContent)
      .set({ ...contentData, updatedAt: now })
      .where(eq(websiteContent.id, id))
      .returning();
    return result[0];
  }
  
  async getContent(id: number): Promise<WebsiteContent | undefined> {
    const result = await db
      .select()
      .from(websiteContent)
      .where(eq(websiteContent.id, id));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getContentBySection(section: string): Promise<WebsiteContent[]> {
    return await db
      .select()
      .from(websiteContent)
      .where(eq(websiteContent.section, section))
      .orderBy(websiteContent.key);
  }
  
  async getContentByKey(section: string, key: string): Promise<WebsiteContent | undefined> {
    const result = await db
      .select()
      .from(websiteContent)
      .where(and(
        eq(websiteContent.section, section),
        eq(websiteContent.key, key)
      ));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getAllContent(active?: boolean): Promise<WebsiteContent[]> {
    let query = db.select().from(websiteContent);
    
    if (active !== undefined) {
      query = query.where(eq(websiteContent.active, active));
    }
    
    return await query.orderBy(websiteContent.section, websiteContent.key);
  }
}

// Fallback to in-memory storage when database is not available
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactForms: Map<number, ContactForm>;
  private chatMessages: Map<number, ChatMessage>;
  private careers: Map<number, Career>;
  private websiteContents: Map<number, WebsiteContent>;
  private jobApplications: Map<number, JobApplication>;
  userCurrentId: number;
  contactFormCurrentId: number;
  chatMessageCurrentId: number;
  careerCurrentId: number;
  contentCurrentId: number;
  jobApplicationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.contactForms = new Map();
    this.chatMessages = new Map();
    this.careers = new Map();
    this.websiteContents = new Map();
    this.jobApplications = new Map();
    this.userCurrentId = 1;
    this.contactFormCurrentId = 1;
    this.chatMessageCurrentId = 1;
    this.careerCurrentId = 1;
    this.contentCurrentId = 1;
    this.jobApplicationCurrentId = 1;
  }

  // User related methods
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
    const createdAt = new Date();
    const role = insertUser.role || 'user';
    const user: User = { 
      ...insertUser, 
      id, 
      role,
      email: insertUser.email || null,
      fullName: insertUser.fullName || null,
      createdAt
    };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => a.username.localeCompare(b.username));
  }

  // Contact form related methods
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
  
  async getContactForms(limit?: number): Promise<ContactForm[]> {
    let forms = Array.from(this.contactForms.values())
      .sort((a, b) => {
        const timeA = a.submittedAt ? a.submittedAt.getTime() : 0;
        const timeB = b.submittedAt ? b.submittedAt.getTime() : 0;
        return timeB - timeA; // Descending
      });
      
    if (limit) {
      forms = forms.slice(0, limit);
    }
    
    return forms;
  }
  
  // Chat related methods
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
  
  // Career related methods
  async createCareer(careerData: CareerData): Promise<Career> {
    const id = this.careerCurrentId++;
    const createdAt = new Date();
    
    const career: Career = {
      ...careerData,
      id,
      createdAt
    };
    
    this.careers.set(id, career);
    return career;
  }
  
  async updateCareer(id: number, careerData: Partial<CareerData>): Promise<Career> {
    const career = this.careers.get(id);
    if (!career) {
      throw new Error(`Career with id ${id} not found`);
    }
    
    const updatedCareer: Career = {
      ...career,
      ...careerData,
    };
    
    this.careers.set(id, updatedCareer);
    return updatedCareer;
  }
  
  async deleteCareer(id: number): Promise<boolean> {
    return this.careers.delete(id);
  }
  
  async getCareer(id: number): Promise<Career | undefined> {
    return this.careers.get(id);
  }
  
  async getCareers(limit?: number): Promise<Career[]> {
    let careers = Array.from(this.careers.values())
      .sort((a, b) => {
        const timeA = a.createdAt ? a.createdAt.getTime() : 0;
        const timeB = b.createdAt ? b.createdAt.getTime() : 0;
        return timeB - timeA; // Descending
      });
      
    if (limit) {
      careers = careers.slice(0, limit);
    }
    
    return careers;
  }
  
  // Job Application related methods
  async saveJobApplication(applicationData: JobApplicationData): Promise<JobApplication> {
    const id = this.jobApplicationCurrentId++;
    const submittedAt = new Date();
    const updatedAt = new Date();
    
    const application: JobApplication = {
      ...applicationData,
      id,
      submittedAt,
      updatedAt
    };
    
    this.jobApplications.set(id, application);
    return application;
  }
  
  async getJobApplicationById(id: number): Promise<JobApplication | undefined> {
    return this.jobApplications.get(id);
  }
  
  async getJobApplicationsByCareerId(careerId: number): Promise<JobApplication[]> {
    return Array.from(this.jobApplications.values())
      .filter(app => app.careerId === careerId)
      .sort((a, b) => {
        const timeA = a.submittedAt ? a.submittedAt.getTime() : 0;
        const timeB = b.submittedAt ? b.submittedAt.getTime() : 0;
        return timeB - timeA; // Descending
      });
  }
  
  async getAllJobApplications(limit?: number): Promise<JobApplication[]> {
    // Get all applications
    let applications = Array.from(this.jobApplications.values())
      .sort((a, b) => {
        const timeA = a.submittedAt ? a.submittedAt.getTime() : 0;
        const timeB = b.submittedAt ? b.submittedAt.getTime() : 0;
        return timeB - timeA; // Descending
      });
    
    // Add career title to each application
    const applicationsWithTitle = applications.map(app => {
      const career = this.careers.get(app.careerId);
      return {
        ...app,
        careerTitle: career ? career.title : 'Unknown Position'
      };
    });
    
    if (limit) {
      applications = applicationsWithTitle.slice(0, limit);
    } else {
      applications = applicationsWithTitle;
    }
    
    return applications;
  }
  
  async updateJobApplicationStatus(id: number, status: string, notes?: string): Promise<JobApplication> {
    const application = this.jobApplications.get(id);
    if (!application) {
      throw new Error(`Application with id ${id} not found`);
    }
    
    const updatedAt = new Date();
    const updatedApplication: JobApplication = {
      ...application,
      status,
      updatedAt,
      notes: notes !== undefined ? notes : application.notes
    };
    
    this.jobApplications.set(id, updatedApplication);
    return updatedApplication;
  }
  
  // CMS related methods
  async saveContent(contentData: WebsiteContentData): Promise<WebsiteContent> {
    const id = this.contentCurrentId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    
    const content: WebsiteContent = {
      ...contentData,
      id,
      createdAt,
      updatedAt
    };
    
    this.websiteContents.set(id, content);
    return content;
  }
  
  async updateContent(id: number, contentData: Partial<WebsiteContentData>): Promise<WebsiteContent> {
    const content = this.websiteContents.get(id);
    if (!content) {
      throw new Error(`Content with id ${id} not found`);
    }
    
    const updatedAt = new Date();
    const updatedContent: WebsiteContent = {
      ...content,
      ...contentData,
      updatedAt
    };
    
    this.websiteContents.set(id, updatedContent);
    return updatedContent;
  }
  
  async getContent(id: number): Promise<WebsiteContent | undefined> {
    return this.websiteContents.get(id);
  }
  
  async getContentBySection(section: string): Promise<WebsiteContent[]> {
    return Array.from(this.websiteContents.values())
      .filter(content => content.section === section)
      .sort((a, b) => a.key.localeCompare(b.key));
  }
  
  async getContentByKey(section: string, key: string): Promise<WebsiteContent | undefined> {
    return Array.from(this.websiteContents.values())
      .find(content => content.section === section && content.key === key);
  }
  
  async getAllContent(active?: boolean): Promise<WebsiteContent[]> {
    let contents = Array.from(this.websiteContents.values());
    
    if (active !== undefined) {
      contents = contents.filter(content => content.active === active);
    }
    
    return contents.sort((a, b) => {
      const sectionCompare = a.section.localeCompare(b.section);
      if (sectionCompare !== 0) return sectionCompare;
      return a.key.localeCompare(b.key);
    });
  }
}

// Use the database storage since we have a PostgreSQL database set up
export const storage = new DatabaseStorage();
