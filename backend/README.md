# AgentHub FastAPI Backend

This is the FastAPI backend for the AgentHub AI Agent Marketplace. It provides REST API endpoints for agent management, marketplace functionality, and integration with the Next.js frontend.

## Features

- **Agent Management**: Create, list, and retrieve AI agents
- **Database Integration**: SQLite database with automatic initialization
- **Error Handling**: Comprehensive error handling with structured responses
- **CORS Support**: Configured for Next.js frontend integration
- **Data Validation**: Pydantic models for request/response validation
- **API Documentation**: Automatic OpenAPI/Swagger documentation

## API Endpoints

### Core Endpoints

- `GET /` - Health check
- `GET /api/agents` - List all agents with filtering
- `GET /api/agents/{agent_id}` - Get specific agent details
- `POST /api/agents` - Create new agent

### Query Parameters for `/api/agents`

- `category` (optional): Filter by agent category
- `is_active` (optional): Filter by active status (default: true)
- `is_approved` (optional): Filter by approval status (default: true)
- `limit` (optional): Maximum number of results (default: 50, max: 100)
- `offset` (optional): Number of results to skip (default: 0)

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Initialize the database:
```bash
python database.py
```

3. Start the development server:
```bash
python run.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- Interactive API docs: `http://localhost:8000/docs`
- ReDoc documentation: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

## Testing

Run the test script to verify all endpoints:
```bash
python test_api.py
```

## Configuration

Configuration is managed in `config.py`. Key settings:

- `DATABASE_PATH`: Path to SQLite database file
- `ALLOWED_ORIGINS`: CORS allowed origins for frontend
- `DEFAULT_PAGE_SIZE`: Default pagination size
- `MAX_PAGE_SIZE`: Maximum pagination size

## Database Schema

The backend uses SQLite with the following main table:

### agents
- `id` (TEXT PRIMARY KEY): Unique agent identifier
- `name` (TEXT): Agent name
- `description` (TEXT): Full agent description
- `short_description` (TEXT): Brief agent description
- `creator` (TEXT): Creator name
- `creator_wallet` (TEXT): Creator's wallet address
- `price` (INTEGER): Price in lovelace
- `category` (TEXT): Agent category
- `tags` (TEXT): JSON array of tags
- `avatar` (TEXT): Avatar image URL
- `is_active` (BOOLEAN): Whether agent is active
- `is_approved` (BOOLEAN): Whether agent is approved
- `demo_limit` (INTEGER): Number of free demos allowed
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp
- `nft_token_id` (TEXT): Associated NFT token ID
- `input_schema` (TEXT): JSON schema for agent inputs
- `crewai_config` (TEXT): CrewAI configuration

## Error Handling

The API provides structured error responses:

```json
{
  "error": "Error Type",
  "detail": "Detailed error message",
  "status_code": 400
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

## Development

The backend is configured for development with:
- Auto-reload on code changes
- CORS enabled for localhost:3000
- Detailed error logging
- SQLite for easy local development

## Integration with Frontend

The backend is designed to integrate with the Next.js frontend:
- CORS configured for `http://localhost:3000`
- Database path points to `../agenthub/data/agents.db`
- Response models match frontend TypeScript interfaces