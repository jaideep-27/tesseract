import { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';
import { WalletAsset } from '@/types';

interface AssetViewerProps {
  className?: string;
}

export default function AssetViewer({ className = '' }: AssetViewerProps) {
  const { connected, wallet } = useWallet();
  const [assets, setAssets] = useState<WalletAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async () => {
    if (!wallet) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const walletAssets = await wallet.getAssets();
      setAssets(walletAssets || []);
    } catch (err) {
      setError('Failed to fetch wallet assets');
      console.error('Assets fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected && wallet) {
      fetchAssets();
    } else {
      setAssets([]);
    }
  }, [connected, wallet]);

  if (!connected) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
        <p className="text-gray-400 text-center">Connect your wallet to view assets</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
        <h3 className="text-lg font-semibold text-sky-400 mb-4">Wallet Assets</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-900 p-4 rounded">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 border border-red-700 ${className}`}>
        <h3 className="text-lg font-semibold text-sky-400 mb-4">Wallet Assets</h3>
        <div className="text-red-400 mb-4">{error}</div>
        <button
          onClick={fetchAssets}
          className="bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded text-sm transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-sky-400">Wallet Assets</h3>
        <button
          onClick={fetchAssets}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors"
        >
          Refresh
        </button>
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">No assets found</div>
          <p className="text-sm text-gray-500">
            Your wallet doesn't contain any tokens or NFTs
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {assets.map((asset: WalletAsset, index: number) => (
            <div key={index} className="bg-gray-900 p-4 rounded border border-gray-600">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white mb-1 truncate">
                    {asset.assetName || 'Unknown Asset'}
                  </h4>
                  <p className="text-xs text-gray-400 font-mono break-all mb-2">
                    Policy: {asset.policyId}
                  </p>
                  {asset.fingerprint && (
                    <p className="text-xs text-gray-500 font-mono">
                      Fingerprint: {asset.fingerprint}
                    </p>
                  )}
                </div>
                <div className="ml-4 text-right">
                  <div className="text-lg font-bold text-sky-400">
                    {asset.quantity}
                  </div>
                  <div className="text-xs text-gray-500">
                    {asset.quantity === '1' ? 'NFT' : 'Token'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {assets.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            Total assets: {assets.length}
          </p>
        </div>
      )}
    </div>
  );
}