import { BaseRepository } from './base';
import { Agent, CreateAgent, UpdateAgent, AgentSchema, CreateAgentSchema, UpdateAgentSchema } from '../validations/schemas';

export class AgentRepository extends BaseRepository {
    async create(data: CreateAgent): Promise<Agent> {
        const db = await this.getDb();

        // Validate input
        const validatedData = CreateAgentSchema.parse(data);

        const agent: Agent = {
            ...validatedData,
            id: this.generateId(),
            isActive: true,
            isApproved: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Validate complete agent
        const validatedAgent = AgentSchema.parse(agent);

        await db.run(`
      INSERT INTO agents (
        id, name, description, short_description, creator, creator_wallet,
        price, category, tags, avatar, is_active, is_approved, demo_limit,
        created_at, updated_at, nft_token_id, input_schema, crewai_config
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            validatedAgent.id,
            validatedAgent.name,
            validatedAgent.description || null,
            validatedAgent.shortDescription || null,
            validatedAgent.creator,
            validatedAgent.creatorWallet,
            validatedAgent.price,
            validatedAgent.category || null,
            this.serializeJson(validatedAgent.tags),
            validatedAgent.avatar || null,
            validatedAgent.isActive,
            validatedAgent.isApproved,
            validatedAgent.demoLimit,
            this.formatDate(validatedAgent.createdAt),
            this.formatDate(validatedAgent.updatedAt),
            validatedAgent.nftTokenId || null,
            this.serializeJson(validatedAgent.inputSchema),
            this.serializeJson(validatedAgent.crewaiConfig)
        ]);

        return validatedAgent;
    }

    async findById(id: string): Promise<Agent | null> {
        const db = await this.getDb();

        const row = await db.get(`
      SELECT * FROM agents WHERE id = ?
    `, [id]);

        if (!row) return null;

        return this.mapRowToAgent(row);
    }

    async findAll(options: {
        isActive?: boolean;
        isApproved?: boolean;
        category?: string;
        creatorWallet?: string;
        limit?: number;
        offset?: number;
    } = {}): Promise<Agent[]> {
        const db = await this.getDb();

        let query = 'SELECT * FROM agents WHERE 1=1';
        const params: any[] = [];

        if (options.isActive !== undefined) {
            query += ' AND is_active = ?';
            params.push(options.isActive);
        }

        if (options.isApproved !== undefined) {
            query += ' AND is_approved = ?';
            params.push(options.isApproved);
        }

        if (options.category) {
            query += ' AND category = ?';
            params.push(options.category);
        }

        if (options.creatorWallet) {
            query += ' AND creator_wallet = ?';
            params.push(options.creatorWallet);
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
        return rows.map(row => this.mapRowToAgent(row));
    }

    async update(id: string, data: UpdateAgent): Promise<Agent | null> {
        const db = await this.getDb();

        // Validate input
        const validatedData = UpdateAgentSchema.parse(data);

        const updateFields: string[] = [];
        const params: any[] = [];

        Object.entries(validatedData).forEach(([key, value]) => {
            if (value !== undefined) {
                const dbKey = this.camelToSnake(key);
                updateFields.push(`${dbKey} = ?`);

                if (key === 'tags' || key === 'inputSchema' || key === 'crewaiConfig') {
                    params.push(this.serializeJson(value));
                } else if (key === 'updatedAt') {
                    params.push(this.formatDate(value as Date));
                } else {
                    params.push(value);
                }
            }
        });

        if (updateFields.length === 0) {
            return this.findById(id);
        }

        // Always update the updated_at field
        if (!updateFields.some(field => field.includes('updated_at'))) {
            updateFields.push('updated_at = ?');
            params.push(this.formatDate(new Date()));
        }

        params.push(id);

        await db.run(`
      UPDATE agents SET ${updateFields.join(', ')} WHERE id = ?
    `, params);

        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const db = await this.getDb();

        const result = await db.run('DELETE FROM agents WHERE id = ?', [id]);
        return (result.changes || 0) > 0;
    }

    async search(query: string, options: {
        limit?: number;
        offset?: number;
    } = {}): Promise<Agent[]> {
        const db = await this.getDb();

        const searchQuery = `
      SELECT * FROM agents 
      WHERE (name LIKE ? OR description LIKE ? OR short_description LIKE ?)
      AND is_active = 1 AND is_approved = 1
      ORDER BY created_at DESC
      ${options.limit ? 'LIMIT ?' : ''}
      ${options.offset ? 'OFFSET ?' : ''}
    `;

        const searchTerm = `%${query}%`;
        const params = [searchTerm, searchTerm, searchTerm];

        if (options.limit) params.push(options.limit.toString());
        if (options.offset) params.push(options.offset.toString());

        const rows = await db.all(searchQuery, params);
        return rows.map(row => this.mapRowToAgent(row));
    }

    private mapRowToAgent(row: any): Agent {
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            shortDescription: row.short_description,
            creator: row.creator,
            creatorWallet: row.creator_wallet,
            price: row.price,
            category: row.category,
            tags: this.parseJson<string[]>(row.tags) || [],
            avatar: row.avatar,
            isActive: Boolean(row.is_active),
            isApproved: Boolean(row.is_approved),
            demoLimit: row.demo_limit,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
            nftTokenId: row.nft_token_id,
            inputSchema: this.parseJson<Record<string, any>>(row.input_schema) || {},
            crewaiConfig: this.parseJson<Record<string, any>>(row.crewai_config) || {}
        };
    }

    private camelToSnake(str: string): string {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }
}