import { BaseRepository } from './base';
import { AgentJob, CreateJob, UpdateJob, AgentJobSchema, CreateJobSchema, UpdateJobSchema } from '../validations/schemas';

export class JobRepository extends BaseRepository {
  async create(data: CreateJob): Promise<AgentJob> {
    const db = await this.getDb();

    // Validate input
    const validatedData = CreateJobSchema.parse(data);

    const job: AgentJob = {
      ...validatedData,
      id: this.generateId(),
      createdAt: new Date()
    };

    // Validate complete job
    const validatedJob = AgentJobSchema.parse(job);

    await db.run(`
      INSERT INTO agent_jobs (
        id, agent_id, user_wallet, status, input, output, error,
        created_at, completed_at, is_demo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      validatedJob.id,
      validatedJob.agentId,
      validatedJob.userWallet,
      validatedJob.status,
      this.serializeJson(validatedJob.input),
      validatedJob.output ? this.serializeJson(validatedJob.output) : null,
      validatedJob.error || null,
      this.formatDate(validatedJob.createdAt),
      validatedJob.completedAt ? this.formatDate(validatedJob.completedAt) : null,
      validatedJob.isDemo
    ]);

    return validatedJob;
  }

  async findById(id: string): Promise<AgentJob | null> {
    const db = await this.getDb();

    const row = await db.get(`
      SELECT * FROM agent_jobs WHERE id = ?
    `, [id]);

    if (!row) return null;

    return this.mapRowToJob(row);
  }

  async findByAgent(agentId: string, options: {
    status?: 'queued' | 'running' | 'completed' | 'failed';
    isDemo?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<AgentJob[]> {
    const db = await this.getDb();

    let query = 'SELECT * FROM agent_jobs WHERE agent_id = ?';
    const params: any[] = [agentId];

    if (options.status) {
      query += ' AND status = ?';
      params.push(options.status);
    }

    if (options.isDemo !== undefined) {
      query += ' AND is_demo = ?';
      params.push(options.isDemo);
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
    return rows.map(row => this.mapRowToJob(row));
  }

  async findByUser(userWallet: string, options: {
    status?: 'queued' | 'running' | 'completed' | 'failed';
    isDemo?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<AgentJob[]> {
    const db = await this.getDb();

    let query = 'SELECT * FROM agent_jobs WHERE user_wallet = ?';
    const params: any[] = [userWallet];

    if (options.status) {
      query += ' AND status = ?';
      params.push(options.status);
    }

    if (options.isDemo !== undefined) {
      query += ' AND is_demo = ?';
      params.push(options.isDemo);
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
    return rows.map(row => this.mapRowToJob(row));
  }

  async findAll(options: {
    status?: 'queued' | 'running' | 'completed' | 'failed';
    isDemo?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<AgentJob[]> {
    const db = await this.getDb();

    let query = 'SELECT * FROM agent_jobs WHERE 1=1';
    const params: any[] = [];

    if (options.status) {
      query += ' AND status = ?';
      params.push(options.status);
    }

    if (options.isDemo !== undefined) {
      query += ' AND is_demo = ?';
      params.push(options.isDemo);
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
    return rows.map(row => this.mapRowToJob(row));
  }

  async update(id: string, data: UpdateJob): Promise<AgentJob | null> {
    const db = await this.getDb();

    // Validate input
    const validatedData = UpdateJobSchema.parse(data);

    const updateFields: string[] = [];
    const params: any[] = [];

    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbKey = this.camelToSnake(key);
        updateFields.push(`${dbKey} = ?`);

        if (key === 'input' || key === 'output') {
          params.push(this.serializeJson(value));
        } else if (key === 'completedAt') {
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
      UPDATE agent_jobs SET ${updateFields.join(', ')} WHERE id = ?
    `, params);

    return this.findById(id);
  }

  async updateStatus(id: string, status: 'queued' | 'running' | 'completed' | 'failed', output?: object, error?: string): Promise<AgentJob | null> {
    const updateData: UpdateJob = { status };

    if (status === 'completed' || status === 'failed') {
      updateData.completedAt = new Date();
    }

    if (output) {
      updateData.output = output;
    }

    if (error) {
      updateData.error = error;
    }

    return this.update(id, updateData);
  }

  async delete(id: string): Promise<boolean> {
    const db = await this.getDb();

    const result = await db.run('DELETE FROM agent_jobs WHERE id = ?', [id]);
    return (result.changes || 0) > 0;
  }

  async getJobStats(agentId?: string): Promise<{
    total: number;
    queued: number;
    running: number;
    completed: number;
    failed: number;
    demos: number;
  }> {
    const db = await this.getDb();

    let query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'queued' THEN 1 ELSE 0 END) as queued,
        SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) as running,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN is_demo = 1 THEN 1 ELSE 0 END) as demos
      FROM agent_jobs
    `;

    const params: any[] = [];

    if (agentId) {
      query += ' WHERE agent_id = ?';
      params.push(agentId);
    }

    const result = await db.get(query, params);

    return {
      total: result?.total || 0,
      queued: result?.queued || 0,
      running: result?.running || 0,
      completed: result?.completed || 0,
      failed: result?.failed || 0,
      demos: result?.demos || 0
    };
  }

  private mapRowToJob(row: any): AgentJob {
    return {
      id: row.id,
      agentId: row.agent_id,
      userWallet: row.user_wallet,
      status: row.status,
      input: this.parseJson<Record<string, any>>(row.input) || {},
      output: this.parseJson<Record<string, any>>(row.output) || undefined,
      error: row.error,
      createdAt: new Date(row.created_at),
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      isDemo: Boolean(row.is_demo)
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}