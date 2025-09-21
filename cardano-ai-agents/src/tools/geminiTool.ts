import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

/**
 * draftCip - Generates a structured CIP draft scaffold using Gemini.
 * @param topic - High level topic or problem statement provided by user.
 * @returns Markdown string for a CIP scaffold.
 */
export async function draftCip(topic: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const systemPrompt = `You are an assistant that drafts Cardano Improvement Proposal (CIP) scaffolds.
Return ONLY well formatted GitHub Markdown suitable for a new CIP pull request.
Do NOT invent finalized standards language—produce a DRAFT scaffold clearly marked as a draft.
Use concise, technical language.
Sections required:
1. Title (proposed)
2. Status (always: Draft, DO NOT change)
3. Category (attempt best fit: Core, Wallets, Metadata, Tokens, Plutus, Governance, Other)
4. Authors (placeholder line)
5. Discussions-To (placeholder link)
6. Created (today's date in ISO)
7. License (Apache-2.0 recommended, with placeholder note)
8. Abstract
9. Motivation
10. Specification (outline only)
11. Rationale
12. Backwards Compatibility
13. Reference Implementation (outline or pseudocode if helpful)
14. Security Considerations
15. Privacy Considerations
16. Risks and Trade-offs
17. Future Work
18. References
Include a short motivation focusing on why this matters to the Cardano ecosystem.`;

  const userPrompt = `Topic: ${topic}`;

  try {
    const result = await model.generateContent([
      { role: 'user', parts: [{ text: systemPrompt + '\n' + userPrompt }] }
    ] as any);

    const text = result.response.text();
    return text;
  } catch (err: any) {
    console.error('[draftCip] Error:', err?.message || err);
    throw new Error('Gemini CIP drafting failed');
  }
}

// Allow quick manual demo if run directly
if (process.argv[2] === 'demo') {
  (async () => {
    const topic = process.argv.slice(3).join(' ') || 'Decentralized light wallet sync optimization';
    const md = await draftCip(topic);
    console.log('\n--- CIP DRAFT ---\n');
    console.log(md);
  })();
}
