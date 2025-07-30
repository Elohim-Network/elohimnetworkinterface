import { users, type User, type InsertUser } from "@shared/schema";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
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
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

// DatabaseStorage implementation
export class DatabaseStorage implements IStorage {
  private db: any;

  constructor(db: any) {
    this.db = db;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
}

// Initialize storage based on environment
let storage: IStorage;

try {
  // Try to use database if DATABASE_URL is available
  if (process.env.DATABASE_URL) {
    const { db } = require('./db');
    storage = new DatabaseStorage(db);
    console.log('✅ Using DatabaseStorage with PostgreSQL');
  } else {
    storage = new MemStorage();
    console.log('⚠️ Using MemStorage (in-memory) - no DATABASE_URL found');
  }
} catch (error) {
  console.warn('⚠️ Database connection failed, falling back to MemStorage:', error);
  storage = new MemStorage();
}

export { storage };
