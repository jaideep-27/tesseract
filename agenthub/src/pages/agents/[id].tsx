import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useWallet } from '@meshsdk/react';
import Layout from '../../components/Layout';
import { AgentProfile } from '../../components/marketplace';
import { Agent } from '../../types';

const AgentDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { connected, wallet } = useWallet();
  const [userWallet, setUserWallet] = useState<string | undefined>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);

  // Mock agent data - in real app this would come from API
  const mockAgents: Record<string, Agent> = {
    '1': {
      id: '1',
      name: 'Content Writer AI',
      description: 'Advanced AI agent for creating high-quality content, blog posts, and marketing copy. This agent uses state-of-the-art natural language processing to understand your requirements and generate engaging, SEO-optimized content that resonates with your target audience. Whether you need blog posts, product descriptions, social media content, or marketing copy, this agent delivers professional-quality writing tailored to your brand voice and style.',
      shortDescription: 'AI-powered content creation for blogs and marketing',
      creator: 'ContentCorp',
      creatorWallet: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a6gtmk4l3aq4s',
      price: 5000000, // 5 ADA in lovelace
      category: 'Content',
      tags: ['writing', 'marketing', 'blog', 'SEO', 'copywriting'],
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
          topic: { 
            type: 'string', 
            description: 'The main topic or subject for the content' 
          },
          length: { 
            type: 'number', 
            description: 'Desired word count for the content',
            minimum: 100,
            maximum: 5000
          },
          tone: {
            type: 'string',
            description: 'Writing tone (professional, casual, friendly, etc.)',
            enum: ['professional', 'casual', 'friendly', 'authoritative', 'conversational']
          },
          target_audience: {
            type: 'string',
            description: 'Target audience for the content'
          }
        },
        required: ['topic', 'length']
      },
      crewaiConfig: {}
    },
    '2': {
      id: '2',
      name: 'Data Analyst Pro',
      description: 'Sophisticated data analysis agent that can process CSV files, generate insights, create visualizations, and provide actionable recommendations. This agent excels at statistical analysis, trend identification, data cleaning, and creating comprehensive reports. It can handle various data formats and provides both technical analysis and business-friendly summaries of findings.',
      shortDescription: 'Professional data analysis and visualization',
      creator: 'DataWiz',
      creatorWallet: 'addr1qy3fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a6gtmk4l3aq4s',
      price: 10000000, // 10 ADA in lovelace
      category: 'Analytics',
      tags: ['data', 'analysis', 'visualization', 'statistics', 'reporting'],
      avatar: undefined,
      isActive: true,
      isApproved: true,
      demoLimit: 2,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-25'),
      nftTokenId: 'nft123456789abcdef',
      inputSchema: {
        type: 'object',
        properties: {
          data: { 
            type: 'string', 
            description: 'CSV data or file path to analyze' 
          },
          analysis_type: { 
            type: 'string', 
            description: 'Type of analysis to perform',
            enum: ['descriptive', 'correlation', 'trend', 'forecasting', 'clustering']
          },
          output_format: {
            type: 'string',
            description: 'Desired output format',
            enum: ['report', 'charts', 'summary', 'detailed']
          }
        },
        required: ['data', 'analysis_type']
      },
      crewaiConfig: {}
    },
    '3': {
      id: '3',
      name: 'Code Assistant',
      description: 'AI coding assistant that helps with debugging, code review, optimization, and best practices. This agent can analyze code in multiple programming languages, identify bugs, suggest improvements, refactor code for better performance, and provide detailed explanations of complex algorithms. It\'s like having a senior developer review your code 24/7.',
      shortDescription: 'Smart coding assistant for developers',
      creator: 'DevTools Inc',
      creatorWallet: 'addr1qz3fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a6gtmk4l3aq4s',
      price: 7500000, // 7.5 ADA in lovelace
      category: 'Development',
      tags: ['coding', 'debugging', 'optimization', 'review', 'refactoring'],
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
          code: { 
            type: 'string', 
            description: 'Code to analyze or debug' 
          },
          language: { 
            type: 'string', 
            description: 'Programming language',
            enum: ['javascript', 'typescript', 'python', 'java', 'cpp', 'rust', 'go']
          },
          task: {
            type: 'string',
            description: 'What you want the assistant to do',
            enum: ['debug', 'review', 'optimize', 'explain', 'refactor']
          },
          context: {
            type: 'string',
            description: 'Additional context about the code or problem'
          }
        },
        required: ['code', 'language', 'task']
      },
      crewaiConfig: {}
    }
  };

  useEffect(() => {
    if (id && typeof id === 'string') {
      // Simulate API call
      setTimeout(() => {
        const foundAgent = mockAgents[id];
        setAgent(foundAgent || null);
        setLoading(false);
      }, 500);
    }

    // Check purchase status (mock)
    setIsPurchased(false);
  }, [id]);

  useEffect(() => {
    // Get user wallet address when connected
    if (connected && wallet) {
      wallet.getUsedAddresses().then((addresses) => {
        if (addresses.length > 0) {
          setUserWallet(addresses[0]);
        }
      }).catch(console.error);
    } else {
      setUserWallet(undefined);
    }
  }, [connected, wallet]);



  const handleBuy = (agentId: string) => {
    console.log('Buy agent:', agentId);
    if (!connected) {
      alert('Please connect your wallet first!');
    } else {
      alert('Purchase functionality will be implemented in the payment task!');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AgentProfile
            agent={{} as Agent}
            onBuy={handleBuy}
            isConnected={connected}
            isPurchased={isPurchased}
            isLoading={true}
            userWallet={userWallet}
          />
        </div>
      </Layout>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">🤖</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Agent Not Found</h1>
          <p className="text-gray-600 mb-4">
            The agent you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/marketplace')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{agent.name} - AgentHub</title>
        <meta name="description" content={agent.shortDescription} />
      </Head>

      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Marketplace
          </button>

          <AgentProfile
            agent={agent}
            onBuy={handleBuy}
            isConnected={connected}
            isPurchased={isPurchased}
            isLoading={false}
            userWallet={userWallet}
          />
        </div>
      </Layout>
    </>
  );
};

export default AgentDetailPage;