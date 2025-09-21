import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

const blockfrostKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || process.env.BLOCKFROST_API_KEY || '';

export const blockfrost = new BlockFrostAPI({ projectId: blockfrostKey });
