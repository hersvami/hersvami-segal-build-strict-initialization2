const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', tier: 1, freeRPM: 10, freeRPD: 250 },
  { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite', tier: 2, freeRPM: 15, freeRPD: 1000 },
  { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', tier: 3, freeRPM: 15, freeRPD: 1500 },
  { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', tier: 4, freeRPM: 5, freeRPD: 100 },
] as const;

type ModelId = (typeof GEMINI_MODELS)[number]['id'];
const rateLimitedModels = {} as Partial<Record<ModelId, number>>;
const RATE_LIMIT_COOLDOWN_MS = 65_000;

function getAvailableModels() {
  const now = Date.now();
  return GEMINI_MODELS.filter((model) => {
    const limitedAt = rateLimitedModels[model.id];
    if (!limitedAt) return true;
    if (now - limitedAt > RATE_LIMIT_COOLDOWN_MS) {
      delete rateLimitedModels[model.id];
      return true;
    }
    return false;
  });
}

export type GeminiResult = { text: string; model: string; tier: number; fallback: boolean };

export async function callGeminiWithFallback(prompt: string, apiKey: string): Promise<GeminiResult> {
  const models = getAvailableModels();
  if (models.length === 0) throw new Error('All models rate-limited. Try again in 1 minute.');

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model.id}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 4096, temperature: 0.2 },
          }),
        },
      );
      if (resp.status === 429 || resp.status === 503) {
        rateLimitedModels[model.id] = Date.now();
        continue;
      }
      if (!resp.ok) continue;
      const data = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) continue;
      return { text, model: model.id, tier: model.tier, fallback: i > 0 };
    } catch {
      continue;
    }
  }
  throw new Error('All free models exhausted. Using keyword fallback.');
}

export function getModelStatus() {
  const now = Date.now();
  const available: { id: string; label: string; tier: number; freeRPD: number }[] = [];
  const rateLimited: { id: string; label: string; resumesIn: number }[] = [];
  for (const model of GEMINI_MODELS) {
    const limitedAt = rateLimitedModels[model.id];
    if (limitedAt && now - limitedAt < RATE_LIMIT_COOLDOWN_MS) {
      rateLimited.push({ id: model.id, label: model.label, resumesIn: Math.ceil((RATE_LIMIT_COOLDOWN_MS - (now - limitedAt)) / 1000) });
    } else {
      available.push({ id: model.id, label: model.label, tier: model.tier, freeRPD: model.freeRPD });
    }
  }
  return {
    available, rateLimited,
    totalFreeRPD: available.reduce((sum, model) => sum + model.freeRPD, 0),
  };
}
