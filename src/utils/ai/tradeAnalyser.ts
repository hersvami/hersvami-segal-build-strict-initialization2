import { buildTradePrompt } from './tradeAnalyserPrompt';
import { keywordFallback } from './tradeAnalyserFallback';
import { mergeDetectedTrades } from './tradeAnalyserMerge';
import { parseGeminiResponse } from './tradeAnalyserParser';
import type { AnalysisResult } from './tradeAnalyserTypes';

export type { AnalysisResult, TradeAnalysis, TradeItem } from './tradeAnalyserTypes';

export async function analyseScope(
  scopeText: string, projectAreaM2: number, apiKey?: string,
): Promise<AnalysisResult> {
  if (!scopeText.trim()) return { trades: [], fallback: true };
  if (!apiKey) return { trades: keywordFallback(scopeText), fallback: true };

  try {
    const prompt = buildTradePrompt(scopeText, projectAreaM2);
    const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-1.5-flash', 'gemini-2.0-flash'];

    for (const modelId of models) {
      try {
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 4096, temperature: 0.2 } }) },
        );
        if (resp.status === 429 || resp.status === 503) continue;
        if (!resp.ok) continue;
        const data = await resp.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) continue;
        const trades = parseGeminiResponse(text);
        if (trades.length > 0) {
          return { trades: mergeDetectedTrades(trades, keywordFallback(scopeText)), model: modelId, fallback: false };
        }
      } catch { continue; }
    }
  } catch { /* fall through */ }

  return { trades: keywordFallback(scopeText), fallback: true };
}