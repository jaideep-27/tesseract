import Head from 'next/head';
import Layout from '@/components/Layout';
import WalletInfo from '@/components/wallet/WalletInfo';
import AssetViewer from '@/components/wallet/AssetViewer';
import { useWallet } from '@meshsdk/react';

export default function WalletPage() {
  const { connected } = useWallet();

  return (
    <>
      <Head>
        <title>Wallet - AgentHub</title>
        <meta name="description" content="View your Cardano wallet information and assets" />
      </Head>
      
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
            <p className="text-gray-400">
              View your Cardano wallet information, balance, and assets
            </p>
          </div>

          {!connected ? (
            <div className="text-center py-12">
              <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-md mx-auto">
                <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
                <p className="text-gray-400 mb-6">
                  Please connect your Cardano wallet to view your information and assets.
                </p>
                <div className="text-sm text-gray-500">
                  <p>Supported wallets: Yoroi, Daedalus, UTXOS, and more</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <WalletInfo />
              <AssetViewer />
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}