/**
 * API Test Page - Test the FastAPI backend integration
 */

import { useState, useEffect } from 'react';
import { fetchAgents, fetchAgent, createAgent, checkApiHealth } from '../lib/api/agents';
import { Agent, CreateAgent } from '../types';

export default function ApiTestPage() {
    const [healthStatus, setHealthStatus] = useState<string>('Checking...');
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    // Test data for creating an agent
    const testAgentData: CreateAgent = {
        name: 'Frontend Test Agent',
        description: 'A test agent created from the Next.js frontend',
        shortDescription: 'Frontend test agent',
        creator: 'Frontend Tester',
        creatorWallet: 'addr_test_frontend123456789',
        price: 2000000, // 2 ADA in lovelace
        category: 'testing',
        tags: ['frontend', 'test', 'integration'],
        avatar: 'https://via.placeholder.com/150',
        demoLimit: 5,
        inputSchema: {
            type: 'object',
            properties: {
                message: { type: 'string', description: 'Test message' }
            },
            required: ['message']
        },
        crewaiConfig: {
            role: 'test_assistant',
            goal: 'Help with frontend testing',
            backstory: 'A helpful agent for testing frontend integration'
        }
    };

    useEffect(() => {
        checkHealth();
        loadAgents();
    }, []);

    const checkHealth = async () => {
        const result = await checkApiHealth();
        if (result.data) {
            setHealthStatus(`✅ API is running (${result.data.version})`);
        } else {
            setHealthStatus(`❌ API error: ${result.error}`);
        }
    };

    const loadAgents = async () => {
        setLoading(true);
        setError('');

        const result = await fetchAgents({ is_approved: false }); // Include unapproved agents for testing

        if (result.data) {
            setAgents(result.data);
        } else {
            setError(result.error || 'Failed to load agents');
        }

        setLoading(false);
    };

    const handleCreateAgent = async () => {
        setLoading(true);
        setError('');

        const result = await createAgent(testAgentData);

        if (result.data) {
            setAgents(prev => [result.data!, ...prev]);
            alert(`Agent created successfully! ID: ${result.data.id}`);
        } else {
            setError(result.error || 'Failed to create agent');
        }

        setLoading(false);
    };

    const handleViewAgent = async (agentId: string) => {
        setLoading(true);
        setError('');

        const result = await fetchAgent(agentId);

        if (result.data) {
            setSelectedAgent(result.data);
        } else {
            setError(result.error || 'Failed to load agent details');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">FastAPI Backend Test</h1>

                {/* Health Check */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">API Health Status</h2>
                    <p className="text-lg">{healthStatus}</p>
                    <button
                        onClick={checkHealth}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Refresh Health Check
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {/* Agent Management */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Agent Management</h2>
                        <div className="space-x-2">
                            <button
                                onClick={loadAgents}
                                disabled={loading}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                            >
                                {loading ? 'Loading...' : 'Refresh Agents'}
                            </button>
                            <button
                                onClick={handleCreateAgent}
                                disabled={loading}
                                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Test Agent'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {agents.map((agent) => (
                            <div key={agent.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-2">
                                    {agent.avatar && (
                                        <img
                                            src={agent.avatar}
                                            alt={agent.name}
                                            className="w-12 h-12 rounded-full mr-3"
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-semibold">{agent.name}</h3>
                                        <p className="text-sm text-gray-600">by {agent.creator}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-700 mb-2">{agent.shortDescription}</p>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-green-600 font-medium">
                                        {(agent.price / 1000000).toFixed(2)} ADA
                                    </span>
                                    <div className="space-x-1">
                                        <span className={`px-2 py-1 rounded text-xs ${agent.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {agent.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs ${agent.isApproved ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {agent.isApproved ? 'Approved' : 'Pending'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleViewAgent(agent.id)}
                                    className="mt-2 w-full px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>

                    {agents.length === 0 && !loading && (
                        <p className="text-gray-500 text-center py-8">
                            No agents found. Create a test agent to get started!
                        </p>
                    )}
                </div>

                {/* Agent Details Modal */}
                {selectedAgent && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold">{selectedAgent.name}</h3>
                                    <button
                                        onClick={() => setSelectedAgent(null)}
                                        className="text-gray-500 hover:text-gray-700 text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <strong>Description:</strong>
                                        <p className="mt-1">{selectedAgent.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <strong>Creator:</strong>
                                            <p>{selectedAgent.creator}</p>
                                        </div>
                                        <div>
                                            <strong>Price:</strong>
                                            <p>{(selectedAgent.price / 1000000).toFixed(2)} ADA</p>
                                        </div>
                                        <div>
                                            <strong>Category:</strong>
                                            <p>{selectedAgent.category || 'Uncategorized'}</p>
                                        </div>
                                        <div>
                                            <strong>Demo Limit:</strong>
                                            <p>{selectedAgent.demoLimit}</p>
                                        </div>
                                    </div>

                                    {selectedAgent.tags.length > 0 && (
                                        <div>
                                            <strong>Tags:</strong>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {selectedAgent.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <strong>Input Schema:</strong>
                                        <pre className="mt-1 p-3 bg-gray-100 rounded text-sm overflow-x-auto">
                                            {JSON.stringify(selectedAgent.inputSchema, null, 2)}
                                        </pre>
                                    </div>

                                    <div>
                                        <strong>CrewAI Config:</strong>
                                        <pre className="mt-1 p-3 bg-gray-100 rounded text-sm overflow-x-auto">
                                            {JSON.stringify(selectedAgent.crewaiConfig, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}