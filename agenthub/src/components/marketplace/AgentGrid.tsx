import React from 'react';
import { AgentCard } from './AgentCard';
import { Agent } from '../../types';

interface AgentGridProps {
  agents: Agent[];
  loading?: boolean;
  onDemo: (agentId: string) => void;
  onBuy: (agentId: string) => void;
  isConnected: boolean;
}

export const AgentGrid: React.FC<AgentGridProps> = ({
  agents,
  loading = false,
  onDemo,
  onBuy,
  isConnected
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-300 h-48 rounded-t-lg"></div>
            <div className="bg-white p-4 rounded-b-lg shadow-md">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded mb-3"></div>
              <div className="flex justify-between mb-3">
                <div className="h-3 bg-gray-300 rounded w-20"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-300 rounded flex-1"></div>
                <div className="h-8 bg-gray-300 rounded flex-1"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🤖</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No agents found
        </h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your filters or search terms
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onDemo={onDemo}
          onBuy={onBuy}
          isConnected={isConnected}
        />
      ))}
    </div>
  );
};