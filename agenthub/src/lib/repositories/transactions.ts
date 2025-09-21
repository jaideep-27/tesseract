import { BaseRepository } from './base';
import { Transaction, CreateTransaction, TransactionSchema, CreateTransactionSchema } from '../validations/schemas';

export class TransactionRepository extends BaseRepository {
  async create(data: CreateTransaction): Promise<Transaction> {
    const db = await this.getDb();
    
    // Validate input
    const validatedData = CreateTransactionSchema.parse(data);
    
    const transaction: Transaction = {
      ...validatedData,
      id: this.generateId(),
      createdAt: new Date()
    };

    // Validate complete transaction
    const validatedTransaction = TransactionSchema.parse(transaction);

    await db.run(`
      INSERT INTO transactions (
        id, tx_hash, from_wallet, to_wallet, amount, agent_id,
        status, created_at, confirmed_at, block_height
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      validatedTransaction.id,
      validatedTransaction.txHash,
      validatedTransaction.fromWallet,
      validatedTransaction.toWallet,
      validatedTransaction.amount,
      validatedTransaction.agentId,
      validatedTransaction.status,
      this.formatDate(validatedTransaction.createdAt),
      validatedTransaction.confirmedAt ? this.formatDate(validatedTransaction.confirmedAt) : null,
      validatedTransaction.blockHeight || null
    ]);

    return validatedTransaction;
  }

  async findById(id: string): Promise<Transaction | null> {
    const db = await this.getDb();
    
    const row = await db.get(`
      SELECT * FROM transactions WHERE id = ?
    `, [id]);

    if (!row) return null;

    return this.mapRowToTransaction(row);
  }

  async findByTxHash(txHash: string): Promise<Transaction | null> {
    const db = await this.getDb();
    
    const row = await db.get(`
      SELECT * FROM transactions WHERE tx_hash = ?
    `, [txHash]);

    if (!row) return null;

    return this.mapRowToTransaction(row);
  }

  async findByWallet(walletAddress: string, options: {
    limit?: number;
    offset?: number;
  } = {}): Promise<Transaction[]> {
    const db = await this.getDb();
    
    let query = `
      SELECT * FROM transactions 
      WHERE from_wallet = ? OR to_wallet = ?
      ORDER BY created_at DESC
    `;
    const params = [walletAddress, walletAddress];

    if (options.limit) {
      query += ' LIMIT ?';
      params.push(options.limit.toString());
    }

    if (options.offset) {
      query += ' OFFSET ?';
      params.push(options.offset.toString());
    }

    const rows = await db.all(query, params);
    return rows.map(row => this.mapRowToTransaction(row));
  }

  async findByAgent(agentId: string, options: {
    limit?: number;
    offset?: number;
  } = {}): Promise<Transaction[]> {
    const db = await this.getDb();
    
    let query = `
      SELECT * FROM transactions 
      WHERE agent_id = ?
      ORDER BY created_at DESC
    `;
    const params = [agentId];

    if (options.limit) {
      query += ' LIMIT ?';
      params.push(options.limit.toString());
    }

    if (options.offset) {
      query += ' OFFSET ?';
      params.push(options.offset.toString());
    }

    const rows = await db.all(query, params);
    return rows.map(row => this.mapRowToTransaction(row));
  }

  async findAll(options: {
    status?: 'pending' | 'confirmed' | 'failed';
    limit?: number;
    offset?: number;
  } = {}): Promise<Transaction[]> {
    const db = await this.getDb();
    
    let query = 'SELECT * FROM transactions WHERE 1=1';
    const params: any[] = [];

    if (options.status) {
      query += ' AND status = ?';
      params.push(options.status);
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
    return rows.map(row => this.mapRowToTransaction(row));
  }

  async updateStatus(id: string, status: 'pending' | 'confirmed' | 'failed', confirmedAt?: Date, blockHeight?: number): Promise<Transaction | null> {
    const db = await this.getDb();
    
    await db.run(`
      UPDATE transactions 
      SET status = ?, confirmed_at = ?, block_height = ?
      WHERE id = ?
    `, [
      status,
      confirmedAt ? this.formatDate(confirmedAt) : null,
      blockHeight || null,
      id
    ]);

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const db = await this.getDb();
    
    const result = await db.run('DELETE FROM transactions WHERE id = ?', [id]);
    return (result.changes || 0) > 0;
  }

  async getTotalEarnings(walletAddress: string): Promise<number> {
    const db = await this.getDb();
    
    const result = await db.get(`
      SELECT SUM(amount) as total
      FROM transactions 
      WHERE to_wallet = ? AND status = 'confirmed'
    `, [walletAddress]);

    return result?.total || 0;
  }

  async getEarningsByAgent(agentId: string): Promise<number> {
    const db = await this.getDb();
    
    const result = await db.get(`
      SELECT SUM(amount) as total
      FROM transactions 
      WHERE agent_id = ? AND status = 'confirmed'
    `, [agentId]);

    return result?.total || 0;
  }

  private mapRowToTransaction(row: any): Transaction {
    return {
      id: row.id,
      txHash: row.tx_hash,
      fromWallet: row.from_wallet,
      toWallet: row.to_wallet,
      amount: row.amount,
      agentId: row.agent_id,
      status: row.status,
      createdAt: new Date(row.created_at),
      confirmedAt: row.confirmed_at ? new Date(row.confirmed_at) : undefined,
      blockHeight: row.block_height
    };
  }
}