import axios from 'axios';
import 'dotenv/config';

// Basic Masumi integration tool: health and simple list placeholder.
// Expects MASUMI_REGISTRY_URL (default http://localhost:3000) and MASUMI_PAYMENT_URL (default http://localhost:3001)

const REGISTRY_URL = process.env.MASUMI_REGISTRY_URL || 'http://localhost:3000';
const PAYMENT_URL = process.env.MASUMI_PAYMENT_URL || 'http://localhost:3001';

export async function masumiStatus() {
  const results: Record<string, any> = {};
  try {
    const r = await axios.get(`${REGISTRY_URL}/api/v1/health`);
    results.registry = r.data;
  } catch (e: any) {
    results.registry = { error: e.message };
  }
  try {
    const p = await axios.get(`${PAYMENT_URL}/api/v1/health`);
    results.payment = p.data;
  } catch (e: any) {
    results.payment = { error: e.message };
  }
  return results;
}

// Placeholder for listing registered agents or services if endpoint exists.
export async function masumiList() {
  try {
    const r = await axios.get(`${REGISTRY_URL}/api/v1/agents`).catch(()=>null);
    if (!r) return { agents: [], note: 'Endpoint /api/v1/agents not reachable or not implemented.' };
    return r.data;
  } catch (e: any) {
    return { error: e.message };
  }
}
