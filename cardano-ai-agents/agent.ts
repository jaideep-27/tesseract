/// <reference types="node" />
import 'dotenv/config';
import * as readline from 'readline';
// Tools live now under src/tools after moving agent to root.
import { askNaturalLanguage } from './src/agent/askRouter.js';
import { clearMemory, listAgents, loadMemory, runAgentByName } from './src/agent/multiAgent.js';
import { draftCip } from './src/tools/geminiTool.js';
import { masumiList, masumiStatus } from './src/tools/masumiTool.js';
import { getBalance, getTransactions, getUtxos } from './src/tools/queryTool.js';
import { sendAda } from './src/tools/txTool.js';

// Enforce network safety early.
if (process.env.CARDANO_NETWORK !== 'Preprod') {
  console.error('CARDANO_NETWORK must be Preprod. Aborting.');
  process.exit(1);
}

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
  },
  masumi_status: {
    help: 'masumi_status -> Show Masumi registry & payment service health',
    required: [],
    fn: async () => await masumiStatus()
  },
  masumi_list: {
    help: 'masumi_list -> List Masumi agents/services (best-effort)',
    required: [],
    fn: async () => await masumiList()
  },
  list_agents: {
    help: 'list_agents -> Show registered AI agents',
    required: [],
    fn: async () => listAgents().map(a => ({ name: a.name, description: a.description, skills: a.skills }))
  },
  run_agent: {
    help: 'run_agent name="CIPResearcher" goal="Draft CIP for light wallet UX"',
    required: ['name', 'goal'],
    fn: async ({ name, goal, context }) => await runAgentByName(name, goal, context)
  },
  show_memory: {
    help: 'show_memory -> Display stored agent memory entries',
    required: [],
    fn: async () => loadMemory()
  },
  clear_memory: {
    help: 'clear_memory -> Wipe agent memory log',
    required: [],
    fn: async () => { clearMemory(); return 'Memory cleared.'; }
  },
  ask: {
    help: 'ask "natural language question" -> Let router interpret and run a tool',
    required: ['q'],
    fn: async ({ q }) => await askNaturalLanguage(q)
  }
};

function parseLine(line: string): { cmd: string; args: Record<string, string> } | null {
  line = line.trim();
  if (!line) return null;
  const [cmd, ...rest] = line.split(/\s+/);
  const argStr = rest.join(' ');
  const args: Record<string, string> = {};
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
  for (const [k, v] of Object.entries(tools)) console.log(' - ' + v.help);
  console.log(' - exit -> Quit');
}

async function runCommand(cmd: string, args: Record<string, any>) {
  const t = tools[cmd];
  if (!t) { console.log('Unknown command: ' + cmd); help(); return; }
  for (const req of t.required) if (!(req in args)) { console.log(`Missing required arg ${req}. Usage: ${t.help}`); return; }
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
    const trimmed = line.trim();
    if (!trimmed) { rl.prompt(); return; }
    if (trimmed === 'exit') { rl.close(); return; }
    const parsed = parseLine(trimmed);
    if (parsed) {
      if (!tools[parsed.cmd] && !parsed.cmd.includes('=')) {
        // Possibly natural language without ask wrapper
        const answer = await askNaturalLanguage(trimmed);
        console.log('[ask] Result:\n', answer);
      } else {
        await runCommand(parsed.cmd, parsed.args);
      }
    } else {
      // Fallback to NL
      const answer = await askNaturalLanguage(trimmed);
      console.log('[ask] Result:\n', answer);
    }
    rl.prompt();
  });
  rl.on('close', () => { console.log('Goodbye.'); process.exit(0); });
}

// In some build setups path comparisons may differ; always start when executed directly via node
if (process.argv[1] && /agent\.([cm]?js|ts)$/.test(process.argv[1])) {
  startCli();
}
export { startCli };

