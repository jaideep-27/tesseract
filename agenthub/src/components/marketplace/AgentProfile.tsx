import React, { useState } from 'react';
import Link from 'next/link';
import { Agent } from '../../types';
import AgentDemo from '../agents/AgentDemo';
import { DemoResponse } from '../../lib/api/agents';

interface AgentProfileProps {
  agent: Agent;
  onBuy: (agentId: string) => void;
  isConnected: boolean;
  isPurchased?: boolean;
  isLoading?: boolean;
  userWallet?: string;
}

export const AgentProfile: React.FC<AgentProfileProps> = ({
  agent,
  onBuy,
  isConnected,
  isPurchased = false,
  isLoading = false,
  userWallet
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'creator' | 'demo'>('overview');

  const formatPrice = (lovelace: number) => {
    return (lovelace / 1_000_000).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-300 h-64 rounded-lg mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
          <div>
            <div className="bg-gray-300 h-32 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Agent Avatar */}
          <div className="w-32 h-32 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            {agent.avatar ? (
              <img 
                src={agent.avatar} 
                alt={agent.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-white text-4xl font-bold">
                {agent.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Agent Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{agent.name}</h1>
                <p className="text-blue-100 mb-2">by {agent.creator}</p>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {agent.category}
                </span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">₳{formatPrice(agent.price)}</div>
                {agent.nftTokenId && (
                  <div className="text-sm text-blue-200 mt-1">
                    NFT: {agent.nftTokenId.slice(0, 8)}...
                  </div>
                )}
              </div>
            </div>

            <p className="text-blue-100 mb-4">{agent.shortDescription}</p>

            {/* Tags */}
            {agent.tags && agent.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {agent.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-white/20 px-2 py-1 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('demo')}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Try Demo
              </button>
              
              {isPurchased ? (
                <Link
                  href={`/agents/${agent.id}/interact`}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
                >
                  Use Agent
                </Link>
              ) : (
                <button
                  onClick={() => onBuy(agent.id)}
                  disabled={!isConnected}
                  className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                    isConnected
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isConnected ? 'Buy Now' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'demo', label: 'Try Demo' },
                { id: 'schema', label: 'Input Schema' },
                { id: 'creator', label: 'Creator Info' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'schema' | 'creator' | 'demo')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Description</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {agent.description || agent.shortDescription}
                  </p>
                </div>
                
                {agent.demoLimit && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Demo Information</h4>
                    <p className="text-blue-700 text-sm">
                      You can try this agent up to {agent.demoLimit} times for free before purchasing.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'demo' && (
              <div>
                <AgentDemo
                  agent={agent}
                  userWallet={userWallet}
                  onDemoComplete={(result: DemoResponse) => {
                    console.log('Demo completed:', result);
                    // Could trigger analytics or other side effects here
                  }}
                  onPurchasePrompt={() => onBuy(agent.id)}
                />
              </div>
            )}

            {activeTab === 'schema' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Input Schema</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-800 overflow-x-auto">
                    {JSON.stringify(agent.inputSchema, null, 2)}
                  </pre>
                </div>
                <p className="text-gray-600 text-sm mt-3">
                  This schema defines the expected input format for this agent.
                </p>
              </div>
            )}

            {activeTab === 'creator' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Creator Information</h3>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {agent.creator.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{agent.creator}</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      Wallet: {agent.creatorWallet.slice(0, 8)}...{agent.creatorWallet.slice(-8)}
                    </p>
                    <Link
                      href={`/creators/${agent.creatorWallet}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View all agents by this creator →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Agent Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Agent Details</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  agent.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {agent.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="text-gray-900">
                  {new Date(agent.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-gray-900">
                  {new Date(agent.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Related Agents */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Similar Agents</h4>
            <p className="text-gray-600 text-sm">
              Discover more agents in the {agent.category} category.
            </p>
            <Link
              href={`/marketplace?category=${encodeURIComponent(agent.category || '')}`}
              className="inline-block mt-3 text-blue-600 hover:text-blue-800 text-sm"
            >
              Browse {agent.category} agents →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};