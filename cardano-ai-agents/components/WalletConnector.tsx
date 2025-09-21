import { useWallet } from '@meshsdk/react';

export default function WalletConnector() {
  const { connect, connected, disconnect, wallet } = useWallet();

  return (
    <div>
      {connected ? (
        <>
          <p>Wallet connected</p>
          <button onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={() => connect('eternl')}>Connect Wallet</button>
      )}
    </div>
  );
}
