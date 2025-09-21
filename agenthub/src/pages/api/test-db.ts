import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeDatabase, seedDatabase, testDatabase } from '@/lib/database/init';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { action } = req.query;

    switch (action) {
      case 'init':
        const initResult = await initializeDatabase();
        return res.status(200).json({ 
          success: initResult, 
          message: initResult ? 'Database initialized' : 'Database initialization failed' 
        });

      case 'seed':
        const seedResult = await seedDatabase();
        return res.status(200).json({ 
          success: seedResult, 
          message: seedResult ? 'Database seeded' : 'Database seeding failed' 
        });

      case 'test':
        const testResult = await testDatabase();
        return res.status(200).json({ 
          success: testResult, 
          message: testResult ? 'Database test passed' : 'Database test failed' 
        });

      default:
        // Default: just initialize
        const defaultResult = await initializeDatabase();
        return res.status(200).json({ 
          success: defaultResult, 
          message: defaultResult ? 'Database ready' : 'Database setup failed',
          actions: {
            init: '/api/test-db?action=init',
            seed: '/api/test-db?action=seed',
            test: '/api/test-db?action=test'
          }
        });
    }
  } catch (error) {
    console.error('Database API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}