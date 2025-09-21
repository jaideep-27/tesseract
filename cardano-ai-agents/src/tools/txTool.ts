import 'dotenv/config';
import { Blockfrost, Lucid } from 'lucid-cardano';

// Helper to init Lucid with Blockfrost for Preprod only.
async function getLucid(): Promise<Lucid> {
  const network = process.env.CARDANO_NETWORK;
  if (network !== 'Preprod') throw new Error('CARDANO_NETWORK must be Preprod. Current: ' + network);
  const key = process.env.BLOCKFROST_API_KEY;
  if (!key) throw new Error('Missing BLOCKFROST_API_KEY');

  const lucid = await Lucid.new(
    new Blockfrost('https://cardano-preprod.blockfrost.io/api/v0', key),
    'Preprod'
  );

  const mnemonic = process.env.WALLET_MNEMONIC;
  if (!mnemonic) throw new Error('Missing WALLET_MNEMONIC');
  await lucid.selectWalletFromSeed(mnemonic);
  return lucid;
}

export type SendAdaResult = {
  from: string;
  to: string;
  amountAda: number;
  txHash: string;
};

/**
 * sendAda - Build, sign and submit a simple ADA transaction.
 * @param to Receiving bech32 address on Preprod
 * @param amountAda Decimal ADA amount (converted to lovelace)
 */
export async function sendAda(to: string, amountAda: number): Promise<SendAdaResult> {
  if (amountAda <= 0) throw new Error('Amount must be > 0');

  const lucid = await getLucid();
  const fromAddr = await lucid.wallet.address();

  // Basic self-send safety.
  if (fromAddr === to) throw new Error('Refusing to send to same address');

  const lovelace = BigInt(Math.round(amountAda * 1_000_000));

  // Ensure balance is sufficient.
  const utxos = await lucid.utxosAt(fromAddr);
  const total = utxos.reduce((acc, u) => acc + (u.assets['lovelace'] || 0n), 0n);
  if (total < lovelace) throw new Error('Insufficient balance');

  const tx = await lucid
    .newTx()
    .payToAddress(to, { lovelace })
    .complete();

  const signed = await tx.sign().complete();
  const txHash = await signed.submit();

  return { from: fromAddr, to, amountAda, txHash };
}
