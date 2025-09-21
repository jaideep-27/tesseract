import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useWallet } from '@meshsdk/react';
import Layout from '../components/Layout';
import { AgentGrid, FilterPanel } from '../components/marketplace';
import { Agent } from '../types';

interface FilterOptions {
  search: string;
  category: string;
  priceRange: [number, number];
  sortBy: 'name' | 'price' | 'popularity' | 'newest';
  tags: string[];
}

const MarketplacePage: NextPage = () => {
  const { connected } = useWallet();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: '',
    priceRange: [0, 1000],
    sortBy: 'popularity',
    tags: []
  });

  // Mock data for development
  const mockAgents: Agent[] = [
    {
      id: '1',
      name: 'Content Writer AI',
      description: 'Advanced AI agent for creating high-quality content, blog posts, and marketing copy.',
      shortDescription: 'AI-powered content creation for blogs and marketing',
      creator: 'ContentCorp',
      creatorWallet: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a6gtmk4l3aq4s',
      price: 5000000, // 5 ADA in lovelace
      category: 'Content',
      tags: ['writing', 'marketing', 'blog'],
      avatar: undefined,
      isActive: true,
      isApproved: true,
      demoLimit: 3,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      nftTokenId: undefined,
      inputSchema: {
        type: 'object',
        properties: {
          topic: { type: 'string', description: 'Content topic' },
          length: { type: 'number', description: 'Word count' }
        }
      },
      crewaiConfig: {}
    },
    {
      id: '2',
      name: 'Data Analyst Pro',
      description: 'Sophisticated data analysis agent that can process CSV files and generate insights.',
      shortDescription: 'Professional data analysis and visualization',
      creator: 'DataWiz',
      creatorWallet: 'addr1qy3fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a6gtmk4l3aq4s',
      price: 10000000, // 10 ADA in lovelace
      category: 'Analytics',
      tags: ['data', 'analysis', 'visualization'],
      avatar: undefined,
      isActive: true,
      isApproved: true,
      demoLimit: 2,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-25'),
      nftTokenId: 'nft123456',
      inputSchema: {
        type: 'object',
        properties: {
          data: { type: 'string', description: 'CSV data or file path' },
          analysis_type: { type: 'string', description: 'Type of analysis' }
        }
      },
      crewaiConfig: {}
    },
    {
      id: '3',
      name: 'Code Assistant',
      description: 'AI coding assistant that helps with debugging, code review, and optimization.',
      shortDescription: 'Smart coding assistant for developers',
      creator: 'DevTools Inc',
      creatorWallet: 'addr1qz3fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a6gtmk4l3aq4s',
      price: 7500000, // 7.5 ADA in lovelace
      category: 'Development',
      tags: ['coding', 'debugging', 'optimization'],
      avatar: undefined,
      isActive: true,
      isApproved: true,
      demoLimit: 5,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-22'),
      nftTokenId: undefined,
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string', description: 'Code to analyze' },
          language: { type: 'string', description: 'Programming language' }
        }
      },
      crewaiConfig: {}
    }
  ];

  const categories = ['Content', 'Analytics', 'Development', 'Design', 'Marketing'];
  const availableTags = ['writing', 'marketing', 'blog', 'data', 'analysis', 'visualization', 'coding', 'debugging', 'optimization'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAgents(mockAgents);
      setFilteredAgents(mockAgents);
      setLoading(false);
    }, 1000);

    // Wallet connection is handled by useWallet hook
  }, []);

  useEffect(() => {
    let filtered = [...agents];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (agent.description || '').toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(agent => agent.category === filters.category);
    }

    // Apply price range filter
    const minPrice = filters.priceRange[0] * 1_000_000; // Convert to lovelace
    const maxPrice = filters.priceRange[1] * 1_000_000;
    filtered = filtered.filter(agent => agent.price >= minPrice && agent.price <= maxPrice);

    // Apply tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(agent =>
        filters.tags.some(tag => agent.tags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popularity':
        default:
          return 0; // Mock popularity sorting
      }
    });

    setFilteredAgents(filtered);
  }, [agents, filters]);

  const handleDemo = (agentId: string) => {
    console.log('Demo agent:', agentId);
    // TODO: Implement demo functionality
    alert('Demo functionality will be implemented in the next task!');
  };

  const handleBuy = (agentId: string) => {
    console.log('Buy agent:', agentId);
    // TODO: Implement purchase functionality
    if (!connected) {
      alert('Please connect your wallet first!');
    } else {
      alert('Purchase functionality will be implemented in the payment task!');
    }
  };

  return (
    <>
      <Head>
        <title>AI Agent Marketplace - AgentHub</title>
        <meta name="description" content="Discover and purchase AI agents on the Cardano blockchain" />
      </Head>

      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Agent Marketplace
            </h1>
            <p className="text-gray-600">
              Discover, demo, and purchase AI agents powered by the Cardano blockchain
            </p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
                availableTags={availableTags}
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
              />
            </div>

            {/* Agent Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {loading ? 'Loading...' : `${filteredAgents.length} agents found`}
                </p>
                {!connected && (
                  <div className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
                    Connect your wallet to purchase agents
                  </div>
                )}
              </div>

              {/* Agent Grid */}
              <AgentGrid
                agents={filteredAgents}
                loading={loading}
                onDemo={handleDemo}
                onBuy={handleBuy}
                isConnected={connected}
              />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default MarketplacePage;