export { BaseRepository } from './base';
export { AgentRepository } from './agents';
export { UserRepository } from './users';
export { TransactionRepository } from './transactions';
export { JobRepository } from './jobs';

// Import classes for singleton instances
import { AgentRepository } from './agents';
import { UserRepository } from './users';
import { TransactionRepository } from './transactions';
import { JobRepository } from './jobs';

// Create singleton instances
export const agentRepository = new AgentRepository();
export const userRepository = new UserRepository();
export const transactionRepository = new TransactionRepository();
export const jobRepository = new JobRepository();