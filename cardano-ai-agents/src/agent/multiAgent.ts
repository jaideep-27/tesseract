import fs from 'fs';
import path from 'path';
import { draftCip } from '../tools/geminiTool.js';
import { getBalance } from '../tools/queryTool.js';
import { sendAda } from '../tools/txTool.js';

export type AgentTask = {
  goal: string;
  context?: string;
};

export interface AgentDefinition {
  name: string;
  description: string;
  skills: string[];
  run: (task: AgentTask) => Promise<string>;
}

const memoryFile = path.resolve('data', 'memory.json');

function ensureMemoryFile() {
  if (!fs.existsSync(path.dirname(memoryFile))) fs.mkdirSync(path.dirname(memoryFile), { recursive: true });
  if (!fs.existsSync(memoryFile)) fs.writeFileSync(memoryFile, '[]', 'utf-8');
}

export interface MemoryItem {
  timestamp: string;
  agent: string;
  goal: string;
  result: string;
  tags: string[];
}

export function loadMemory(): MemoryItem[] {
  ensureMemoryFile();
  try { return JSON.parse(fs.readFileSync(memoryFile, 'utf-8')); } catch { return []; }
}

export function saveMemory(items: MemoryItem[]) {
  ensureMemoryFile();
  fs.writeFileSync(memoryFile, JSON.stringify(items, null, 2), 'utf-8');
}

export function addMemory(entry: MemoryItem) {
  const all = loadMemory();
  all.push(entry);
  saveMemory(all);
}

const agents: AgentDefinition[] = [
  {
    name: 'CIPResearcher',
    description: 'Generates a structured CIP draft for a given topic.',
    skills: ['draft_cip'],
    run: async (task) => {
      const draft = await draftCip(task.goal);
      return draft;
    }
  },
  {
    name: 'BalanceChecker',
    description: 'Retrieves ADA balance for a given address contained in the goal or context.',
    skills: ['get_balance'],
    run: async (task) => {
      const match = /(addr_test[0-9a-z]+)/.exec(task.goal + ' ' + (task.context||''));
      if (!match) return 'No testnet address found in goal/context.';
      const bal = await getBalance(match[1]);
      return JSON.stringify(bal);
    }
  },
  {
    name: 'TxSender',
    description: 'Sends ADA using configured wallet mnemonic (testnet only). Goal must specify amount and to address.',
    skills: ['send_ada'],
    run: async (task) => {
      const to = /(addr_test[0-9a-z]+)/.exec(task.goal + ' ' + (task.context||''))?.[1];
      const amt = /amount\s*=\s*([0-9]+(\.[0-9]+)?)/.exec(task.goal)?.[1];
      if (!to || !amt) return 'Need addr_test... and amount=number in goal.';
      const res = await sendAda(to, Number(amt));
      return JSON.stringify(res);
    }
  }
];

export function listAgents(): AgentDefinition[] { return agents; }

export async function runAgentByName(name: string, goal: string, context?: string) {
  const agent = agents.find(a => a.name.toLowerCase() === name.toLowerCase());
  if (!agent) throw new Error('Agent not found: ' + name);
  const result = await agent.run({ goal, context });
  addMemory({ timestamp: new Date().toISOString(), agent: agent.name, goal, result: result.slice(0, 2000), tags: deriveTags(goal, result) });
  return result;
}

function deriveTags(goal: string, result: string): string[] {
  const tags = new Set<string>();
  if (/cip/i.test(goal)) tags.add('cip');
  if (/balance/i.test(goal)) tags.add('balance');
  if (/send/i.test(goal) || /amount=/i.test(goal)) tags.add('transaction');
  if (/error/i.test(result)) tags.add('error');
  return Array.from(tags);
}

export function clearMemory() { saveMemory([]); }
