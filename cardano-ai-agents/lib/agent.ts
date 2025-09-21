import { blockfrost } from './cardano';

// Simple placeholder Agent class if masumi package not yet integrated.
// Replace with real import: import { Agent } from 'masumi';
class AgentLike {
  constructor(public config: any) {}
  async run(skill: string, input: any) {
    const s = this.config.skills.find((sk: any) => sk.name === skill);
    if (!s) throw new Error('Unknown skill');
    return await s.run(input);
  }
}

export const transactionAgent = new AgentLike({
  name: 'Cardano Tx Agent',
  description: 'Helps with checking balances and sending tADA',
  skills: [
    {
      name: 'Check Balance',
      run: async ({ address }: { address: string }) => {
        try {
          const balance = await blockfrost.addresses(address);
          const lovelace = balance.amount.find(a => a.unit === 'lovelace')?.quantity || '0';
          return `Balance for ${address}: ${lovelace} lovelace`;
        } catch (err: any) {
          return `Error: ${err.message}`;
        }
      }
    },
    {
      name: 'Send tADA',
      run: async ({ from, to, amount }: { from: string; to: string; amount: number }) => {
        return `Pretend sending ${amount} tADA from ${from} to ${to}`;
      }
    }
  ]
});
