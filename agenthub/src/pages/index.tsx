import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import WalletInfo from '@/components/wallet/WalletInfo';
import DatabaseStatus from '@/components/DatabaseStatus';
import { useWallet } from '@meshsdk/react';

export default function Home() {
  const { connected } = useWallet();

  return (
    <>
      <Head>
        <title>AgentHub - AI Agent Marketplace</title>
        <meta name="description" content="Discover and purchase AI agents with Cardano" />
      </Head>
      
      <Layout>
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-5xl font-thin mb-6">
              AI Agent <span className="text-sky-400">Marketplace</span>
            </h1>
            <p className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto">
              Discover, demo, and purchase AI agents using Cardano testnet ADA. 
              Connect with creators and unlock the power of decentralized AI services.
            </p>
            
            {!connected ? (
              <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-md mx-auto">
                <h3 className="text-2xl font-bold mb-4">Get Started</h3>
                <p className="text-gray-400 mb-6">
                  Connect your Cardano wallet to start exploring AI agents.
                </p>
                <div className="text-sm text-gray-500">
                  <p>Supported: Yoroi, Daedalus, UTXOS, and more</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center space-x-4">
                <Link 
                  href="/wallet"
                  className="bg-sky-600 hover:bg-sky-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  View Wallet
                </Link>
                <Link 
                  href="/marketplace"
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Browse Agents
                </Link>
              </div>
            )}
          </div>

          {/* Status Section */}
          <div className="max-w-4xl mx-auto space-y-6">
            <DatabaseStatus />
            
            {/* Wallet Quick View */}
            {connected && <WalletInfo />}
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-3">AI Agents</h3>
              <p className="text-gray-400 mb-4">
                Browse a marketplace of AI agents created by developers worldwide. 
                Each agent offers unique capabilities and services.
              </p>
              <Link 
                href="/marketplace"
                className="inline-block bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Explore Marketplace
              </Link>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
              <p className="text-gray-400 mb-4">
                Purchase agent access using testnet ADA with secure blockchain transactions. 
                All payments are transparent and verifiable.
              </p>
              <div className="text-sm text-gray-500">Coming Soon</div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-3">Creator Tools</h3>
              <p className="text-gray-400 mb-4">
                Deploy your own AI agents to the marketplace. Set pricing, 
                track earnings, and monetize your AI services.
              </p>
              <div className="text-sm text-gray-500">Coming Soon</div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-center mb-8 text-sky-400">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-sky-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h4 className="font-semibold mb-2">Connect Wallet</h4>
                <p className="text-gray-400 text-sm">
                  Connect your Cardano wallet to access the marketplace
                </p>
              </div>

              <div className="text-center">
                <div className="bg-sky-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h4 className="font-semibold mb-2">Browse Agents</h4>
                <p className="text-gray-400 text-sm">
                  Explore AI agents and try them with free demos
                </p>
              </div>

              <div className="text-center">
                <div className="bg-sky-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h4 className="font-semibold mb-2">Purchase Access</h4>
                <p className="text-gray-400 text-sm">
                  Pay with testnet ADA to unlock full agent functionality
                </p>
              </div>

              <div className="text-center">
                <div className="bg-sky-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h4 className="font-semibold mb-2">Use AI Services</h4>
                <p className="text-gray-400 text-sm">
                  Interact with your purchased agents and get results
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-6">
              Join the future of decentralized AI services on Cardano
            </p>
            {!connected && (
              <p className="text-sky-400 font-medium">
                Connect your wallet above to begin exploring
              </p>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
