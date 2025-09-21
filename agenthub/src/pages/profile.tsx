import Head from 'next/head';
import Layout from '@/components/Layout';
import WalletInfo from '@/components/wallet/WalletInfo';
import { useWallet } from '@meshsdk/react';

export default function ProfilePage() {
  const { connected } = useWallet();

  return (
    <>
      <Head>
        <title>Profile - AgentHub</title>
        <meta name="description" content="Manage your AgentHub profile and view your activity" />
      </Head>
      
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
            <p className="text-gray-400">
              Manage your account, view purchased agents, and track your activity
            </p>
          </div>

          {!connected ? (
            <div className="text-center py-12">
              <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-md mx-auto">
                <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
                <p className="text-gray-400 mb-6">
                  Please connect your Cardano wallet to view your profile.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-sky-400">Account Overview</h2>
                  <div className="space-y-4">
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">👤</div>
                        <h3 className="text-lg font-semibold mb-2">Profile Coming Soon</h3>
                        <p className="text-gray-400 text-sm">
                          User profiles, purchase history, and agent management features 
                          are currently under development.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-sky-400">Purchased Agents</h2>
                  <div className="bg-gray-900 rounded-lg p-6 text-center">
                    <div className="text-gray-400 mb-2">No agents purchased yet</div>
                    <p className="text-sm text-gray-500">
                      Your purchased agents will appear here once the marketplace is live
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-sky-400">Transaction History</h2>
                  <div className="bg-gray-900 rounded-lg p-6 text-center">
                    <div className="text-gray-400 mb-2">No transactions yet</div>
                    <p className="text-sm text-gray-500">
                      Your payment history will be displayed here
                    </p>
                  </div>
                </div>
              </div>

              {/* Wallet Info Sidebar */}
              <div>
                <WalletInfo />
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}