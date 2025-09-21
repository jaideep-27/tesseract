import type { NextApiRequest, NextApiResponse } from 'next';
import { transactionAgent } from '../../lib/agent';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });
  try {
    const { skill, input } = req.body;
    const result = await transactionAgent.run(skill, input);
    res.json({ result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
