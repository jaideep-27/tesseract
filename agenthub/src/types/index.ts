// Wallet Types
export interface WalletAsset {
  unit: string;
  quantity: string;
  policyId?: string;
  assetName?: string;
  fingerprint?: string;
}

export interface WalletBalance {
  unit: string;
  quantity: string;
}

export interface WalletInfo {
  addresses: string[];
  balance: WalletBalance[];
  changeAddress: string;
}

// Re-export validation types
export type {
  Agent,
  CreateAgent,
  UpdateAgent,
  User,
  CreateUser,
  UpdateUser,
  Transaction,
  CreateTransaction,
  AgentJob,
  CreateJob,
  UpdateJob
} from '../lib/validations/schemas';