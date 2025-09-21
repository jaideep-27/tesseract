import { BaseRepository } from './base';
import { User, CreateUser, UpdateUser, UserSchema, CreateUserSchema, UpdateUserSchema } from '../validations/schemas';

export class UserRepository extends BaseRepository {
  async create(data: CreateUser): Promise<User> {
    const db = await this.getDb();
    
    // Validate input
    const validatedData = CreateUserSchema.parse(data);
    
    const user: User = {
      ...validatedData,
      id: this.generateId(),
      createdAt: new Date()
    };

    // Validate complete user
    const validatedUser = UserSchema.parse(user);

    await db.run(`
      INSERT INTO users (
        id, wallet_address, username, email, is_creator, is_admin,
        created_at, last_login_at, purchased_agents, created_agents
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      validatedUser.id,
      validatedUser.walletAddress,
      validatedUser.username || null,
      validatedUser.email || null,
      validatedUser.isCreator,
      validatedUser.isAdmin,
      this.formatDate(validatedUser.createdAt),
      validatedUser.lastLoginAt ? this.formatDate(validatedUser.lastLoginAt) : null,
      this.serializeJson(validatedUser.purchasedAgents),
      this.serializeJson(validatedUser.createdAgents)
    ]);

    return validatedUser;
  }

  async findById(id: string): Promise<User | null> {
    const db = await this.getDb();
    
    const row = await db.get(`
      SELECT * FROM users WHERE id = ?
    `, [id]);

    if (!row) return null;

    return this.mapRowToUser(row);
  }

  async findByWalletAddress(walletAddress: string): Promise<User | null> {
    const db = await this.getDb();
    
    const row = await db.get(`
      SELECT * FROM users WHERE wallet_address = ?
    `, [walletAddress]);

    if (!row) return null;

    return this.mapRowToUser(row);
  }

  async findAll(options: {
    isCreator?: boolean;
    isAdmin?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<User[]> {
    const db = await this.getDb();
    
    let query = 'SELECT * FROM users WHERE 1=1';
    const params: any[] = [];

    if (options.isCreator !== undefined) {
      query += ' AND is_creator = ?';
      params.push(options.isCreator);
    }

    if (options.isAdmin !== undefined) {
      query += ' AND is_admin = ?';
      params.push(options.isAdmin);
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit) {
      query += ' LIMIT ?';
      params.push(options.limit.toString());
    }

    if (options.offset) {
      query += ' OFFSET ?';
      params.push(options.offset.toString());
    }

    const rows = await db.all(query, params);
    return rows.map(row => this.mapRowToUser(row));
  }

  async update(id: string, data: UpdateUser): Promise<User | null> {
    const db = await this.getDb();
    
    // Validate input
    const validatedData = UpdateUserSchema.parse(data);
    
    const updateFields: string[] = [];
    const params: any[] = [];

    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbKey = this.camelToSnake(key);
        updateFields.push(`${dbKey} = ?`);
        
        if (key === 'purchasedAgents' || key === 'createdAgents') {
          params.push(this.serializeJson(value));
        } else if (key === 'lastLoginAt') {
          params.push(value ? this.formatDate(value as Date) : null);
        } else {
          params.push(value);
        }
      }
    });

    if (updateFields.length === 0) {
      return this.findById(id);
    }

    params.push(id);

    await db.run(`
      UPDATE users SET ${updateFields.join(', ')} WHERE id = ?
    `, params);

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const db = await this.getDb();
    
    const result = await db.run('DELETE FROM users WHERE id = ?', [id]);
    return (result.changes || 0) > 0;
  }

  async updateLastLogin(walletAddress: string): Promise<void> {
    const db = await this.getDb();
    
    await db.run(`
      UPDATE users SET last_login_at = ? WHERE wallet_address = ?
    `, [this.formatDate(new Date()), walletAddress]);
  }

  async addPurchasedAgent(userId: string, agentId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) throw new Error('User not found');

    const updatedAgents = [...user.purchasedAgents];
    if (!updatedAgents.includes(agentId)) {
      updatedAgents.push(agentId);
      await this.update(userId, { purchasedAgents: updatedAgents });
    }
  }

  async addCreatedAgent(userId: string, agentId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) throw new Error('User not found');

    const updatedAgents = [...user.createdAgents];
    if (!updatedAgents.includes(agentId)) {
      updatedAgents.push(agentId);
      await this.update(userId, { createdAgents: updatedAgents });
    }
  }

  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      walletAddress: row.wallet_address,
      username: row.username,
      email: row.email,
      isCreator: Boolean(row.is_creator),
      isAdmin: Boolean(row.is_admin),
      createdAt: new Date(row.created_at),
      lastLoginAt: row.last_login_at ? new Date(row.last_login_at) : undefined,
      purchasedAgents: this.parseJson<string[]>(row.purchased_agents) || [],
      createdAgents: this.parseJson<string[]>(row.created_agents) || []
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}