import { z } from 'zod';

// Agent validation schema
export const AgentSchema = z.object({
    id: z.string(),
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    shortDescription: z.string().max(200).optional(),
    creator: z.string().min(1),
    creatorWallet: z.string().min(1),
    price: z.number().int().min(0), // in lovelace
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    avatar: z.string().optional(),
    isActive: z.boolean().default(true),
    isApproved: z.boolean().default(false),
    demoLimit: z.number().int().min(0).default(3),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
    nftTokenId: z.string().optional(),
    inputSchema: z.record(z.string(), z.any()).default({}),
    crewaiConfig: z.record(z.string(), z.any()).default({})
});

export const CreateAgentSchema = AgentSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    isActive: true,
    isApproved: true
});

export const UpdateAgentSchema = AgentSchema.partial().omit({
    id: true,
    createdAt: true
}).extend({
    updatedAt: z.date().default(() => new Date())
});

// User validation schema
export const UserSchema = z.object({
    id: z.string(),
    walletAddress: z.string().min(1),
    username: z.string().min(1).max(50).optional(),
    email: z.string().optional(),
    isCreator: z.boolean().default(false),
    isAdmin: z.boolean().default(false),
    createdAt: z.date().default(() => new Date()),
    lastLoginAt: z.date().optional(),
    purchasedAgents: z.array(z.string()).default([]),
    createdAgents: z.array(z.string()).default([])
});

export const CreateUserSchema = UserSchema.omit({
    id: true,
    createdAt: true
});

export const UpdateUserSchema = UserSchema.partial().omit({
    id: true,
    createdAt: true
});

// Transaction validation schema
export const TransactionSchema = z.object({
    id: z.string(),
    txHash: z.string().min(1),
    fromWallet: z.string().min(1),
    toWallet: z.string().min(1),
    amount: z.number().int().min(0), // in lovelace
    agentId: z.string(),
    status: z.enum(['pending', 'confirmed', 'failed']).default('pending'),
    createdAt: z.date().default(() => new Date()),
    confirmedAt: z.date().optional(),
    blockHeight: z.number().int().optional()
});

export const CreateTransactionSchema = TransactionSchema.omit({
    id: true,
    createdAt: true
});

// Job validation schema
export const AgentJobSchema = z.object({
    id: z.string(),
    agentId: z.string(),
    userWallet: z.string().min(1),
    status: z.enum(['queued', 'running', 'completed', 'failed']).default('queued'),
    input: z.record(z.string(), z.any()).default({}),
    output: z.record(z.string(), z.any()).optional(),
    error: z.string().optional(),
    createdAt: z.date().default(() => new Date()),
    completedAt: z.date().optional(),
    isDemo: z.boolean().default(false)
});

export const CreateJobSchema = AgentJobSchema.omit({
    id: true,
    createdAt: true
});

export const UpdateJobSchema = AgentJobSchema.partial().omit({
    id: true,
    createdAt: true,
    agentId: true,
    userWallet: true
});

// Export types
export type Agent = z.infer<typeof AgentSchema>;
export type CreateAgent = z.infer<typeof CreateAgentSchema>;
export type UpdateAgent = z.infer<typeof UpdateAgentSchema>;

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;

export type AgentJob = z.infer<typeof AgentJobSchema>;
export type CreateJob = z.infer<typeof CreateJobSchema>;
export type UpdateJob = z.infer<typeof UpdateJobSchema>;