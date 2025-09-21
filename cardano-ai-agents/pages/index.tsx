import { useState } from 'react';
import WalletConnector from '../components/WalletConnector';

export default function Home() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const askAgent = async () => {
    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skill: 'Check Balance',
        input: { address: query }
      })
    });
    const data = await res.json();
    setResponse(data.result || data.error);
  };

  return (
    <main>
      <h1>My Cardano dApp with AI Agents 🚀</h1>
      <WalletConnector />
      <div style={{ marginTop: 20 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Enter Cardano address" />
        <button onClick={askAgent}>Check Balance</button>
        <p>{response}</p>
      </div>
    </main>
  );
}
