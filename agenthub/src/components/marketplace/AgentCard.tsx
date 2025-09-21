import React from 'react';
import Link from 'next/link';
import { Agent } from '../../types';

interface AgentCardProps {
  agent: Agent;
  onDemo: (agentId: string) => void;
  onBuy: (agentId: string) => void;
  isConnected: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onDemo,
  onBuy,
  isConnected
}) => {
  const formatPrice = (lovelace: number) => {
    return (lovelace / 1_000_000).toFixed(2);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Agent Avatar */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        {agent.avatar ? (
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-white text-6xl font-bold">
            {agent.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Agent Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {agent.name}
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {agent.category}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 h-10 overflow-hidden">
          {agent.shortDescription && agent.shortDescription.length > 80
            ? `${agent.shortDescription.substring(0, 80)}...`
            : agent.shortDescription || 'No description available'}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">
            by {agent.creator}
          </span>
          <span className="text-lg font-bold text-green-600">
            ₳{formatPrice(agent.price)}
          </span>
        </div>

        {/* Tags */}
        {agent.tags && agent.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {agent.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {agent.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{agent.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onDemo(agent.id)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Try Demo
          </button>

          <button
            onClick={() => onBuy(agent.id)}
            disabled={!isConnected}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${isConnected
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {isConnected ? 'Buy Now' : 'Connect Wallet'}
          </button>
        </div>

        {/* View Details Link */}
        <Link
          href={`/agents/${agent.id}`}
          className="block text-center text-blue-600 hover:text-blue-800 text-sm mt-2 transition-colors duration-200"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};