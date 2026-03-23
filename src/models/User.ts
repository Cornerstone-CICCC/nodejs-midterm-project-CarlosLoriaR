import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

class UserStorage {
  private users: Map<string, User> = new Map();
  private emailIndex: Map<string, string> = new Map();
  private usernameIndex: Map<string, string> = new Map();

  async create(email: string, username: string, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);

    const user: User = {
      id: uuidv4(),
      email: email.toLowerCase(),
      username,
      passwordHash,
      createdAt: new Date(),
    };

    this.users.set(user.id, user);
    this.emailIndex.set(user.email, user.id);
    this.usernameIndex.set(username, user.id);

    return user;
  }

  getById(id: string): User | null {
    return this.users.get(id) || null;
  }

  getByEmail(email: string): User | null {
    const id = this.emailIndex.get(email.toLowerCase());
    return id ? this.users.get(id) || null : null;
  }

  getByUsername(username: string): User | null {
    const id = this.usernameIndex.get(username);
    return id ? this.users.get(id) || null : null;
  }

  emailExists(email: string): boolean {
    return this.emailIndex.has(email.toLowerCase());
  }

  usernameExists(username: string): boolean {
    return this.usernameIndex.has(username);
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = this.getByEmail(email);
    if (!user) return false;
    return bcrypt.compare(password, user.passwordHash);
  }
}

export const userStorage = new UserStorage();
