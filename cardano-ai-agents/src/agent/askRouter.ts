import { draftCip } from '../tools/geminiTool.js';
import { getBalance } from '../tools/queryTool.js';
import { sendAda } from '../tools/txTool.js';
import { addMemory } from './multiAgent.js';

// Dual-mode router:
// If AGENT_PRESET_MODE=true => always return preset (from AGENT_PRESET_RESPONSE or default)
// Else use heuristic intent detection for CIP draft / balance / send ADA.
function getPreset(): string {
  return process.env.AGENT_PRESET_RESPONSE || 'Preset response: Cardano Agent operational.';
}
function isPresetMode(): boolean {
  return /^true$/i.test(process.env.AGENT_PRESET_MODE || '');
}

export async function askNaturalLanguage(input: string): Promise<string> {
  const text = input.trim();
  const presetMode = isPresetMode();
  const preset = getPreset();
  if (!text) return presetMode ? preset : 'Empty query.';
  if (presetMode) return preset;

  // CIP drafting intent
  if (/\b(cip|improvement|proposal|draft)\b/i.test(text)) {
    const topicMatch = /for (.+)$/i.exec(text) || /about (.+)$/i.exec(text);
    const topic = topicMatch ? topicMatch[1] : text.replace(/^(please |generate |create )/i,'');
    try {
      const draft = await draftCip(topic.slice(0,200));
      addMemory({ timestamp: new Date().toISOString(), agent: 'CIPResearcher-NL', goal: topic, result: draft.slice(0,2000), tags: ['cip','nl'] });
      return draft;
    } catch (e:any) { return 'CIP draft error: ' + (e.message||e); }
  }

  // Balance intent
  if (/\b(balance|how much ada|funds)\b/i.test(text)) {
    const addr = /(addr_test[0-9a-z]+)/i.exec(text)?.[1];
    if (!addr) return 'Need a testnet address (addr_test...).';
    try { const b = await getBalance(addr); const out = 'Balance: ' + JSON.stringify(b); addMemory({ timestamp: new Date().toISOString(), agent: 'BalanceChecker-NL', goal: addr, result: out, tags: ['balance','nl'] }); return out; } catch (e:any) { return 'Balance error: ' + (e.message||e); }
  }

  // Send ADA intent
  if (/\b(send|transfer|pay)\b/i.test(text) && /\bada\b/i.test(text)) {
    const to = /(addr_test[0-9a-z]+)/i.exec(text)?.[1];
    const amt = /(\d+(?:\.\d+)?)\s*ada/i.exec(text)?.[1];
    if (!to || !amt) return 'Provide amount (e.g. 1.5 ADA) and destination addr_test...';
    if (!process.env.WALLET_MNEMONIC) return 'WALLET_MNEMONIC not set; cannot send. Add it to .env first.';
    try { const res = await sendAda(to, Number(amt)); const out = 'Tx result: ' + JSON.stringify(res); addMemory({ timestamp: new Date().toISOString(), agent: 'TxSender-NL', goal: text, result: out.slice(0,2000), tags: ['transaction','nl'] }); return out; } catch (e:any) { return 'Send error: ' + (e.message||e); }
  }

  if (/^(help|commands|what can you do)/i.test(text)) {
    return 'You can ask: "draft a CIP for X", "balance of addr_test...", or "send 1 ADA to addr_test..."';
  }

  return 'Unrecognized intent. Try: draft a CIP for topic | balance of addr_test... | send 1.2 ADA to addr_test...';
}
