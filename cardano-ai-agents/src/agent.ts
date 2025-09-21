import 'dotenv/config';
import readline from 'node:readline';
import { draftCip } from './tools/geminiTool.js';
import { getBalance, getTransactions, getUtxos } from './tools/queryTool.js';
import { sendAda } from './tools/txTool.js';

// Enforce network safety early.
if (process.env.CARDANO_NETWORK !== 'Preprod') {
  console.error('CARDANO_NETWORK must be Preprod. Aborting.');
  process.exit(1);
}

// Tool registry: maps command keyword to implementation + simple schema.
type ToolFn = (args: Record<string, any>) => Promise<any>;

const tools: Record<string, { fn: ToolFn; help: string; required: string[] }> = {
  draft_cip: {
    help: 'draft_cip topic="..." -> Generate a CIP draft scaffold for topic',
    required: ['topic'],
    fn: async ({ topic }) => await draftCip(topic)
  },
  get_balance: {
    help: 'get_balance address="addr_test..." -> Show ADA balance',
    required: ['address'],
    fn: async ({ address }) => await getBalance(address)
  },
  get_utxos: {
    help: 'get_utxos address="addr_test..." -> List UTXOs summary',
    required: ['address'],
    fn: async ({ address }) => await getUtxos(address)
  },
  get_txs: {
    help: 'get_txs address="addr_test..." [limit=5] -> Recent transactions',
    required: ['address'],
    fn: async ({ address, limit }) => await getTransactions(address, limit ? Number(limit) : 5)
  },
  send_ada: {
    help: 'send_ada to="addr_test..." amount=1.5 -> Send ADA (testnet only)',
    required: ['to', 'amount'],
    fn: async ({ to, amount }) => await sendAda(to, Number(amount))
  }
};

function parseLine(line: string): { cmd: string; args: Record<string, string> } | null {
  line = line.trim();
  if (!line) return null;
  const [cmd, ...rest] = line.split(/\s+/);
  const argStr = rest.join(' ');
  const args: Record<string, string> = {};
  // match key="quoted value" or key=value
  const regex = /(\w+)=\"([^\"]+)\"|(\w+)=([^\s]+)/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(argStr))) {
    if (m[1] && m[2]) args[m[1]] = m[2];
    else if (m[3] && m[4]) args[m[3]] = m[4];
  }
  return { cmd, args };
}

function help() {
  console.log('\nAvailable commands:');
  for (const [k, v] of Object.entries(tools)) {
    console.log(' - ' + v.help);
  }
  console.log(' - exit -> Quit');
}

async function runCommand(cmd: string, args: Record<string, any>) {
  const t = tools[cmd];
  if (!t) {
    console.log('Unknown command: ' + cmd);
    help();
    return;
  }
  for (const req of t.required) {
    if (!(req in args)) {
      console.log(`Missing required arg ${req}. Usage: ${t.help}`);
      return;
    }
  }
  console.log(`\n[${cmd}] Running with args`, args);
  try {
    const result = await t.fn(args);
    console.log(`[${cmd}] Result:\n`, typeof result === 'string' ? result : JSON.stringify(result, null, 2));
  } catch (err: any) {
    console.error(`[${cmd}] ERROR:`, err?.message || err);
  }
}

function startCli() {
  console.log('Cardano CIP Agent (Preprod)');
  help();

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: '> ' });
  rl.prompt();

  rl.on('line', async (line) => {
    if (line.trim() === 'exit') {
      rl.close();
      return;
    }
    const parsed = parseLine(line);
    if (parsed) await runCommand(parsed.cmd, parsed.args);
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('Goodbye.');
    process.exit(0);
  });
}

// Start if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startCli();
}

export { startCli };

