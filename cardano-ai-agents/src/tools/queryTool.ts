import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import 'dotenv/config';

// Initialize Blockfrost for Preprod only.
function getApi(): BlockFrostAPI {
  const network = process.env.CARDANO_NETWORK;
  if (network !== 'Preprod') {
    throw new Error('CARDANO_NETWORK must be Preprod for safety. Current: ' + network);
  }
  const key = process.env.BLOCKFROST_API_KEY;
  if (!key) throw new Error('Missing BLOCKFROST_API_KEY');

  return new BlockFrostAPI({ projectId: key });
}

export async function getBalance(address: string): Promise<string> {
  const api = getApi();
  const addrInfo = await api.addresses(address);
  const lovelaceObj = addrInfo.amount.find(a => a.unit === 'lovelace');
  const lovelace = lovelaceObj ? BigInt(lovelaceObj.quantity) : 0n;
  const ada = Number(lovelace) / 1_000_000;
  return `${ada} ADA ( ${lovelace} lovelace )`;
}

export async function getUtxos(address: string) {
  const api = getApi();
  const utxos = await api.addressesUtxos(address);
  return utxos.map(u => ({
    tx_hash: u.tx_hash,
    output_index: u.output_index,
    lovelace: u.amount.find(a => a.unit === 'lovelace')?.quantity || '0'
  }));
}

export async function getTransactions(address: string, limit: number = 10) {
  const api = getApi();
  const txs = await api.addressesTransactions(address, { page: 1, count: limit });
  return txs.map(t => ({ tx_hash: t.tx_hash, tx_index: t.tx_index, block_height: t.block_height }));
}
