-- AgentHub Database Schema

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    creator TEXT NOT NULL,
    creator_wallet TEXT NOT NULL,
    price INTEGER NOT NULL DEFAULT 0, -- in lovelace
    category TEXT,
    tags TEXT, -- JSON array
    avatar TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT FALSE,
    demo_limit INTEGER DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nft_token_id TEXT,
    input_schema TEXT, -- JSON
    crewai_config TEXT -- JSON
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    username TEXT,
    email TEXT,
    is_creator BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    purchased_agents TEXT, -- JSON array
    created_agents TEXT -- JSON array
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    tx_hash TEXT UNIQUE NOT NULL,
    from_wallet TEXT NOT NULL,
    to_wallet TEXT NOT NULL,
    amount INTEGER NOT NULL, -- in lovelace
    agent_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    block_height INTEGER,
    FOREIGN KEY (agent_id) REFERENCES agents (id)
);

-- Jobs table
CREATE TABLE IF NOT EXISTS agent_jobs (
    id TEXT PRIMARY KEY,
    agent_id TEXT NOT NULL,
    user_wallet TEXT NOT NULL,
    status TEXT DEFAULT 'queued',
    input TEXT, -- JSON
    output TEXT, -- JSON
    error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    is_demo BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (agent_id) REFERENCES agents (id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_creator ON agents(creator_wallet);
CREATE INDEX IF NOT EXISTS idx_agents_category ON agents(category);
CREATE INDEX IF NOT EXISTS idx_agents_active ON agents(is_active, is_approved);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions(from_wallet);
CREATE INDEX IF NOT EXISTS idx_transactions_agent ON transactions(agent_id);
CREATE INDEX IF NOT EXISTS idx_jobs_agent ON agent_jobs(agent_id);
CREATE INDEX IF NOT EXISTS idx_jobs_user ON agent_jobs(user_wallet);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON agent_jobs(status);