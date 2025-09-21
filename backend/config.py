"""
Configuration settings for AgentHub FastAPI backend.
"""

import os
from typing import List

class Settings:
    """Application settings and configuration."""
    
    # API Configuration
    API_TITLE: str = "AgentHub API"
    API_DESCRIPTION: str = "AI Agent Marketplace API"
    API_VERSION: str = "1.0.0"
    
    # Database Configuration
    DATABASE_PATH: str = os.getenv("DATABASE_PATH", "../agenthub/data/agents.db")
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",  # Next.js dev server
        "http://127.0.0.1:3000",
    ]
    
    # Pagination defaults
    DEFAULT_PAGE_SIZE: int = 50
    MAX_PAGE_SIZE: int = 100
    
    # Agent defaults
    DEFAULT_DEMO_LIMIT: int = 3
    
    # Development settings
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
settings = Settings()