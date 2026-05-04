import { callGeminiWithFallback } from './geminiModels';

export async function polishScopeWithAI(
  description: string,
  apiKey?: string,
): Promise<{ text: string; model?: string; tier?: number; fallback?: boolean }> {
  if (!apiKey) return { text: description };

  const prompt = [
    'You are a senior Australian construction estimator writing a formal Scope of Works.',
    'Rewrite the builder notes below into a complete, professionally structured Scope of Works using clear, plain Australian building terminology.',
    'Output requirements: Start with a one-line summary heading.',
    'Then 4-8 short sections, each with a bold header ending in ":".',
    'Under each header, use short bullet points starting with "- ".',
    'Reference relevant trades, AS standards and BCA where appropriate.',
    'Do NOT invent dimensions or PC item dollar values.',
    'Do NOT use markdown asterisks. Cover the full scope.',
    `Builder notes: """${description}"""`,
  ].join(' ');

  try {
    const result = await callGeminiWithFallback(prompt, apiKey);
    return { text: result.text.trim(), model: result.model, tier: result.tier, fallback: result.fallback };
  } catch {
    return { text: description };
  }
}

export async function recogniseScopeWithAI(
  description: string,
  categoryIds: string[],
  apiKey?: string,
): Promise<{ categoryId: string; model: string } | null> {
  if (!apiKey) return null;

  const prompt = [
    'You are an Australian construction expert.',
    `Given this description, identify the SINGLE most relevant category from: ${categoryIds.join(', ')}.`,
    `Description: "${description}".`,
    'Return ONLY the category ID.',
  ].join(' ');

  try {
    const result = await callGeminiWithFallback(prompt, apiKey);
    const cleaned = result.text.trim().toLowerCase().replace(/[^a-z-]/g, '');
    if (categoryIds.includes(cleaned)) return { categoryId: cleaned, model: result.model };
    const match = categoryIds.find((id) => cleaned.includes(id) || id.includes(cleaned));
    return match ? { categoryId: match, model: result.model } : null;
  } catch {
    return null;
  }
}
