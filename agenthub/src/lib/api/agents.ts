/**
 * API client functions for agent management endpoints.
 * Integrates with the FastAPI backend for agent operations.
 */

import { Agent, CreateAgent } from '../validations/schemas';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AgentListParams {
  category?: string;
  is_active?: boolean;
  is_approved?: boolean;
  limit?: number;
  offset?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Fetch all agents with optional filtering
 */
export async function fetchAgents(params: AgentListParams = {}): Promise<ApiResponse<Agent[]>> {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.category) searchParams.append('category', params.category);
    if (params.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());
    if (params.is_approved !== undefined) searchParams.append('is_approved', params.is_approved.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.offset) searchParams.append('offset', params.offset.toString());

    const url = `${API_BASE_URL}/api/agents${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return {
        error: errorData.detail || errorData.error || 'Failed to fetch agents',
        status: response.status,
      };
    }

    const agents = await response.json();
    return {
      data: agents,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

/**
 * Fetch a specific agent by ID
 */
export async function fetchAgent(agentId: string): Promise<ApiResponse<Agent>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agents/${agentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return {
        error: errorData.detail || errorData.error || 'Failed to fetch agent',
        status: response.status,
      };
    }

    const agent = await response.json();
    return {
      data: agent,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

/**
 * Create a new agent
 */
export async function createAgent(agentData: CreateAgent): Promise<ApiResponse<Agent>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agentData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return {
        error: errorData.detail || errorData.error || 'Failed to create agent',
        status: response.status,
      };
    }

    const agent = await response.json();
    return {
      data: agent,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

/**
 * Demo request interface
 */
export interface DemoRequest {
  input: Record<string, any>;
  user_wallet?: string;
}

/**
 * Demo response interface
 */
export interface DemoResponse {
  job_id: string;
  status: string;
  message: string;
  output?: Record<string, any>;
  demo_count: number;
  demo_limit: number;
}

/**
 * Start a demo session for an agent
 */
export async function demoAgent(agentId: string, demoRequest: DemoRequest): Promise<ApiResponse<DemoResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agents/${agentId}/demo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(demoRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return {
        error: errorData.detail || errorData.error || 'Failed to start demo',
        status: response.status,
      };
    }

    const demoResult = await response.json();
    return {
      data: demoResult,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

/**
 * Check API health
 */
export async function checkApiHealth(): Promise<ApiResponse<{ message: string; version: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        error: 'API health check failed',
        status: response.status,
      };
    }

    const data = await response.json();
    return {
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}