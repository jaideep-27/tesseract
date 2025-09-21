import Head from 'next/head';
import Layout from '@/components/Layout';
import { useWallet } from '@meshsdk/react';

export default function CreatePage() {
  const { connected } = useWallet();

  return (
    <>
      <Head>
        <title>Create Agent - AgentHub</title>
        <meta name="description" content="Deploy your AI agent to the marketplace" />
      </Head>
      
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Create AI Agent</h1>
            <p className="text-gray-400">
              Deploy your AI agent to the AgentHub marketplace and start earning
            </p>
          </div>

          {!connected ? (
            <div className="text-center py-12">
              <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-md mx-auto">
                <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
                <p className="text-gray-400 mb-6">
                  Please connect your Cardano wallet to create and deploy AI agents.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🚧</div>
                <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
                <p className="text-gray-400 mb-6">
                  The agent creation wizard is currently under development. 
                  Soon you'll be able to deploy your AI agents with CrewAI integration.
                </p>
                <div className="bg-gray-900 rounded-lg p-6 text-left max-w-md mx-auto">
                  <h3 className="font-semibold mb-3 text-sky-400">Planned Features:</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Multi-step agent creation wizard</li>
                    <li>• CrewAI framework integration</li>
                    <li>• Custom pricing in testnet ADA</li>
                    <li>• Agent avatar and description</li>
                    <li>• Automatic FastAPI endpoint generation</li>
                    <li>• Earnings tracking dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}