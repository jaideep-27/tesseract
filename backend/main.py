"""
FastAPI application for AgentHub marketplace backend.
Provides API endpoints for agent management and marketplace functionality.
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
import sqlite3
import json
import uuid
from datetime import datetime
from pydantic import BaseModel, Field

from config import settings
from database import get_db_connection, init_database

# Initialize database on startup
init_database()

# Initialize FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response validation
class AgentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=1000)
    short_description: str = Field(..., min_length=1, max_length=200)
    creator: str = Field(..., min_length=1, max_length=100)
    creator_wallet: str = Field(..., min_length=1)
    price: int = Field(..., ge=0)  # Price in lovelace
    category: str = Field(..., min_length=1, max_length=50)
    tags: List[str] = Field(default_factory=list)
    avatar: Optional[str] = None
    demo_limit: int = Field(default=3, ge=0)
    input_schema: dict = Field(default_factory=dict)
    crewai_config: dict = Field(default_factory=dict)

class AgentCreate(AgentBase):
    pass

class AgentResponse(AgentBase):
    id: str
    is_active: bool
    is_approved: bool
    created_at: str
    updated_at: str
    nft_token_id: Optional[str] = None

class ErrorResponse(BaseModel):
    error: str
    detail: str
    status_code: int

class DemoRequest(BaseModel):
    input: dict = Field(default_factory=dict)
    user_wallet: Optional[str] = None

class DemoResponse(BaseModel):
    job_id: str
    status: str
    message: str
    output: Optional[dict] = None
    demo_count: int
    demo_limit: int

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for consistent error responses."""
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content=ErrorResponse(
                error="HTTP Exception",
                detail=exc.detail,
                status_code=exc.status_code
            ).dict()
        )
    
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal Server Error",
            detail="An unexpected error occurred",
            status_code=500
        ).dict()
    )

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "AgentHub API is running", "version": "1.0.0"}

@app.get("/api/agents", response_model=List[AgentResponse])
async def list_agents(
    category: Optional[str] = None,
    is_active: bool = True,
    is_approved: bool = True,
    limit: int = settings.DEFAULT_PAGE_SIZE,
    offset: int = 0
):
    """
    List all available agents with optional filtering.
    
    - **category**: Filter by agent category
    - **is_active**: Filter by active status (default: True)
    - **is_approved**: Filter by approval status (default: True)
    - **limit**: Maximum number of agents to return (default: 50)
    - **offset**: Number of agents to skip (default: 0)
    """
    # Validate pagination parameters
    if limit > settings.MAX_PAGE_SIZE:
        raise HTTPException(status_code=400, detail=f"Limit cannot exceed {settings.MAX_PAGE_SIZE}")
    if offset < 0:
        raise HTTPException(status_code=400, detail="Offset cannot be negative")
    
    conn = get_db_connection()
    try:
        # Build query with filters
        query = """
            SELECT id, name, description, short_description, creator, creator_wallet,
                   price, category, tags, avatar, is_active, is_approved, demo_limit,
                   created_at, updated_at, nft_token_id, input_schema, crewai_config
            FROM agents 
            WHERE is_active = ? AND is_approved = ?
        """
        params = [is_active, is_approved]
        
        if category:
            query += " AND category = ?"
            params.append(category)
        
        query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])
        
        cursor = conn.execute(query, params)
        rows = cursor.fetchall()
        
        agents = []
        for row in rows:
            agent_data = dict(row)
            # Parse JSON fields
            agent_data['tags'] = json.loads(agent_data['tags']) if agent_data['tags'] else []
            agent_data['input_schema'] = json.loads(agent_data['input_schema']) if agent_data['input_schema'] else {}
            agent_data['crewai_config'] = json.loads(agent_data['crewai_config']) if agent_data['crewai_config'] else {}
            agents.append(AgentResponse(**agent_data))
        
        return agents
        
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()

@app.get("/api/agents/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: str):
    """
    Get detailed information about a specific agent.
    
    - **agent_id**: Unique identifier for the agent
    """
    conn = get_db_connection()
    try:
        cursor = conn.execute("""
            SELECT id, name, description, short_description, creator, creator_wallet,
                   price, category, tags, avatar, is_active, is_approved, demo_limit,
                   created_at, updated_at, nft_token_id, input_schema, crewai_config
            FROM agents 
            WHERE id = ?
        """, (agent_id,))
        
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        agent_data = dict(row)
        # Parse JSON fields
        agent_data['tags'] = json.loads(agent_data['tags']) if agent_data['tags'] else []
        agent_data['input_schema'] = json.loads(agent_data['input_schema']) if agent_data['input_schema'] else {}
        agent_data['crewai_config'] = json.loads(agent_data['crewai_config']) if agent_data['crewai_config'] else {}
        
        return AgentResponse(**agent_data)
        
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()

@app.post("/api/agents", response_model=AgentResponse)
async def create_agent(agent: AgentCreate):
    """
    Create a new agent in the marketplace.
    
    - **agent**: Agent data including name, description, creator info, price, etc.
    """
    conn = get_db_connection()
    try:
        # Generate unique ID and timestamps
        agent_id = str(uuid.uuid4())
        current_time = datetime.utcnow().isoformat()
        
        # Insert new agent
        cursor = conn.execute("""
            INSERT INTO agents (
                id, name, description, short_description, creator, creator_wallet,
                price, category, tags, avatar, is_active, is_approved, demo_limit,
                created_at, updated_at, input_schema, crewai_config
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            agent_id,
            agent.name,
            agent.description,
            agent.short_description,
            agent.creator,
            agent.creator_wallet,
            agent.price,
            agent.category,
            json.dumps(agent.tags),
            agent.avatar,
            True,  # is_active
            False,  # is_approved (requires admin approval)
            agent.demo_limit,
            current_time,
            current_time,
            json.dumps(agent.input_schema),
            json.dumps(agent.crewai_config)
        ))
        
        conn.commit()
        
        # Return the created agent
        return AgentResponse(
            id=agent_id,
            name=agent.name,
            description=agent.description,
            short_description=agent.short_description,
            creator=agent.creator,
            creator_wallet=agent.creator_wallet,
            price=agent.price,
            category=agent.category,
            tags=agent.tags,
            avatar=agent.avatar,
            is_active=True,
            is_approved=False,
            demo_limit=agent.demo_limit,
            created_at=current_time,
            updated_at=current_time,
            nft_token_id=None,
            input_schema=agent.input_schema,
            crewai_config=agent.crewai_config
        )
        
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid agent data: {str(e)}")
    finally:
        conn.close()

@app.post("/api/agents/{agent_id}/demo", response_model=DemoResponse)
async def demo_agent(agent_id: str, demo_request: DemoRequest):
    """
    Start a demo session for an agent with limited functionality.
    
    - **agent_id**: Unique identifier for the agent
    - **demo_request**: Demo input parameters and optional user wallet
    """
    conn = get_db_connection()
    try:
        # First, verify the agent exists and is active
        cursor = conn.execute("""
            SELECT id, name, demo_limit, is_active, is_approved, input_schema, crewai_config
            FROM agents 
            WHERE id = ? AND is_active = 1 AND is_approved = 1
        """, (agent_id,))
        
        agent_row = cursor.fetchone()
        if not agent_row:
            raise HTTPException(status_code=404, detail="Agent not found or not available")
        
        agent_data = dict(agent_row)
        demo_limit = agent_data['demo_limit']
        
        # Check demo usage if user wallet is provided
        demo_count = 0
        if demo_request.user_wallet:
            cursor = conn.execute("""
                SELECT COUNT(*) as count
                FROM agent_jobs 
                WHERE agent_id = ? AND user_wallet = ? AND is_demo = 1
            """, (agent_id, demo_request.user_wallet))
            
            count_row = cursor.fetchone()
            demo_count = count_row['count'] if count_row else 0
            
            if demo_count >= demo_limit:
                raise HTTPException(
                    status_code=429, 
                    detail=f"Demo limit reached. You have used {demo_count}/{demo_limit} demos for this agent."
                )
        
        # Create a demo job
        job_id = str(uuid.uuid4())
        current_time = datetime.utcnow().isoformat()
        
        # Simulate limited demo functionality
        demo_output = {
            "message": "This is a demo response with limited functionality.",
            "demo": True,
            "input_received": demo_request.input,
            "agent_name": agent_data['name'],
            "note": "Purchase full access to unlock complete functionality."
        }
        
        # Insert demo job record
        cursor = conn.execute("""
            INSERT INTO agent_jobs (
                id, agent_id, user_wallet, status, input, output, 
                created_at, completed_at, is_demo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            job_id,
            agent_id,
            demo_request.user_wallet or "anonymous",
            "completed",
            json.dumps(demo_request.input),
            json.dumps(demo_output),
            current_time,
            current_time,
            True  # is_demo
        ))
        
        conn.commit()
        
        return DemoResponse(
            job_id=job_id,
            status="completed",
            message="Demo completed successfully",
            output=demo_output,
            demo_count=demo_count + 1,
            demo_limit=demo_limit
        )
        
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Demo execution error: {str(e)}")
    finally:
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)