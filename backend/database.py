"""
Database utilities and initialization for AgentHub backend.
"""

import sqlite3
import os
from config import settings

def init_database():
    """Initialize the database with required tables."""
    # Ensure the data directory exists
    db_dir = os.path.dirname(settings.DATABASE_PATH)
    if not os.path.exists(db_dir):
        os.makedirs(db_dir)
    
    conn = sqlite3.connect(settings.DATABASE_PATH)
    try:
        # Create agents table if it doesn't exist
        conn.execute("""
            CREATE TABLE IF NOT EXISTS agents (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                short_description TEXT,
                creator TEXT NOT NULL,
                creator_wallet TEXT NOT NULL,
                price INTEGER NOT NULL,
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
            )
        """)
        
        # Create agent_jobs table for demo and job tracking
        conn.execute("""
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
            )
        """)
        
        # Create indexes for better query performance
        conn.execute("CREATE INDEX IF NOT EXISTS idx_agents_category ON agents(category)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_agents_creator ON agents(creator_wallet)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_agents_active_approved ON agents(is_active, is_approved)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_jobs_agent ON agent_jobs(agent_id)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_jobs_user ON agent_jobs(user_wallet)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_jobs_demo ON agent_jobs(is_demo)")
        
        conn.commit()
        print("Database initialized successfully")
        
    except sqlite3.Error as e:
        print(f"Database initialization error: {e}")
        raise
    finally:
        conn.close()

def get_db_connection():
    """Get a database connection with proper configuration."""
    try:
        conn = sqlite3.connect(settings.DATABASE_PATH)
        conn.row_factory = sqlite3.Row  # Enable dict-like access to rows
        return conn
    except sqlite3.Error as e:
        raise Exception(f"Database connection error: {str(e)}")

if __name__ == "__main__":
    init_database()