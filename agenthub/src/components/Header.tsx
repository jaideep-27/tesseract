import Link from 'next/link';
import { useWallet } from '@meshsdk/react';
import WalletConnector from './wallet/WalletConnector';

export default function Header() {
  const { connected } = useWallet();

  return (
    <header className="border-b border-gray-700 bg-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-sky-400 hover:text-sky-300 transition-colors">
              AgentHub
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/marketplace" className="text-gray-300 hover:text-white transition-colors">
                Marketplace
              </Link>
              {connected && (
                <>
                  <Link href="/wallet" className="text-gray-300 hover:text-white transition-colors">
                    Wallet
                  </Link>
                  <Link href="/create" className="text-gray-300 hover:text-white transition-colors">
                    Create Agent
                  </Link>
                  <Link href="/profile" className="text-gray-300 hover:text-white transition-colors">
                    Profile
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <WalletConnector />
          </div>
        </div>
      </div>
    </header>
  );
}