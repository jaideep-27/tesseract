import { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';
import { WalletInfo as WalletInfoType, WalletBalance } from '@/types';

interface WalletInfoProps {
  className?: string;
}

export default function WalletInfo({ className = '' }: WalletInfoProps) {
  const { connected, wallet } = useWallet();
  const [walletData, setWalletData] = useState<WalletInfoType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletInfo = async () => {
    if (!wallet) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [addresses, balance, changeAddress] = await Promise.all([
        wallet.getRewardAddresses(),
        wallet.getBalance(),
        wallet.getChangeAddress()
      ]);
      
      setWalletData({
        addresses,
        balance,
        changeAddress
      });
    } catch (err) {
      setError('Failed to fetch wallet information');
      console.error('Wallet info error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected && wallet) {
      fetchWalletInfo();
    } else {
      setWalletData(null);
    }
  }, [connected, wallet]);

  if (!connected) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
        <p className="text-gray-400 text-center">Connect your wallet to view information</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 border border-red-700 ${className}`}>
        <div className="text-red-400 mb-4">{error}</div>
        <button
          onClick={fetchWalletInfo}
          className="bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded text-sm transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!walletData) return null;

  const adaBalance = walletData.balance.find((item: WalletBalance) => item.unit === 'lovelace');
  const otherAssets = walletData.balance.filter((item: WalletBalance) => item.unit !== 'lovelace');

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
      <h3 className="text-lg font-semibold text-sky-400 mb-4">Wallet Information</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Address</label>
          <div className="bg-gray-900 p-3 rounded font-mono text-xs break-all">
            {walletData.changeAddress}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">ADA Balance</label>
          <div className="bg-gray-900 p-3 rounded">
            <span className="text-2xl font-bold text-sky-400">
              {adaBalance ? (parseInt(adaBalance.quantity) / 1000000).toFixed(6) : '0.000000'}
            </span>
            <span className="text-gray-400 ml-2">ADA</span>
          </div>
        </div>

        {otherAssets.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">Other Assets</label>
            <div className="bg-gray-900 p-3 rounded space-y-2">
              {otherAssets.map((asset: WalletBalance, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="font-mono text-gray-400 truncate">
                    {asset.unit.slice(0, 20)}...
                  </span>
                  <span className="font-semibold">{asset.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={fetchWalletInfo}
        className="mt-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition-colors"
      >
        Refresh
      </button>
    </div>
  );
}