import { useState, useEffect } from 'react';

interface DatabaseStatusProps {
  className?: string;
}

export default function DatabaseStatus({ className = '' }: DatabaseStatusProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [message, setMessage] = useState('Checking database...');

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      
      if (data.success) {
        setStatus('ready');
        setMessage('Database ready');
      } else {
        setStatus('error');
        setMessage(data.message || 'Database error');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to connect to database');
    }
  };

  const seedDatabase = async () => {
    setStatus('loading');
    setMessage('Seeding database...');
    
    try {
      const response = await fetch('/api/test-db?action=seed');
      const data = await response.json();
      
      if (data.success) {
        setStatus('ready');
        setMessage('Database seeded with sample data');
      } else {
        setStatus('error');
        setMessage(data.message || 'Seeding failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to seed database');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading': return 'text-yellow-400';
      case 'ready': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading': return '⏳';
      case 'ready': return '✅';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-4 border border-gray-700 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xl">{getStatusIcon()}</span>
          <div>
            <h4 className="font-semibold text-white">Database Status</h4>
            <p className={`text-sm ${getStatusColor()}`}>{message}</p>
          </div>
        </div>
        
        {status === 'ready' && (
          <button
            onClick={seedDatabase}
            className="bg-sky-600 hover:bg-sky-700 px-3 py-1 rounded text-sm transition-colors"
          >
            Seed Data
          </button>
        )}
        
        {status === 'error' && (
          <button
            onClick={checkDatabaseStatus}
            className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}