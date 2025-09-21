import { CardanoWallet, useWallet } from '@meshsdk/react';

interface WalletConnectorProps {
  className?: string;
}

export default function WalletConnector({ className = '' }: WalletConnectorProps) {
  const { connected, wallet } = useWallet();

  return (
    <div className={`wallet-connector ${className}`}>
      <style jsx global>{`
        .wallet-connector .mesh-button {
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%) !important;
          border: 1px solid #0284c7 !important;
          border-radius: 8px !important;
          padding: 8px 16px !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2) !important;
        }
        
        .wallet-connector .mesh-button:hover {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important;
          border-color: #0369a1 !important;
          box-shadow: 0 4px 8px rgba(14, 165, 233, 0.3) !important;
          transform: translateY(-1px) !important;
        }
        
        .wallet-connector .mesh-button:active {
          transform: translateY(0) !important;
          box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2) !important;
        }
        
        .wallet-connector .mesh-wallet-list {
          background: #1f2937 !important;
          border: 1px solid #374151 !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
          padding: 8px !important;
        }
        
        .wallet-connector .mesh-wallet-item {
          background: transparent !important;
          border: 1px solid transparent !important;
          border-radius: 8px !important;
          padding: 12px 16px !important;
          margin: 4px 0 !important;
          transition: all 0.2s ease !important;
        }
        
        .wallet-connector .mesh-wallet-item:hover {
          background: #374151 !important;
          border-color: #0ea5e9 !important;
        }
        
        .wallet-connector .mesh-wallet-item img {
          border-radius: 4px !important;
        }
        
        .wallet-connector .mesh-wallet-item span {
          color: #f9fafb !important;
          font-weight: 500 !important;
        }
      `}</style>
      <CardanoWallet />
    </div>
  );
}