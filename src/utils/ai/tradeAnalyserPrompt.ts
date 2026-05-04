import { getAllParametricUnits } from '../pricing/parametricUnits';
import { getAllCategories } from '../pricing/scopeRecogniser';

export function buildTradePrompt(scopeText: string, projectAreaM2: number): string {
  const unitList = getAllParametricUnits().map((u) => `${u.id}|${u.categoryId}|${u.label}|${u.unit}|${u.rate}`).join('\n');
  const validCategories = getAllCategories()
    .filter((category) => category.archetype !== 'assembly')
    .map((category) => `- ${category.id} (${category.label})`)
    .join('\n');

  return `System Role: You are a Senior Victorian Residential Estimator for a Tier-1 domestic builder. Convert rough builder notes into a professional, sequenced and priced multi-trade scope package for Victoria, Australia.

Location + standards:
- Victoria, Australia only
- Follow VBA, HIA, MBA and NCC expectations
- Prioritise Rawlinsons VIC and HIA/MBA market rates
- Never skip invisible but necessary trades when clearly implied: demolition, skip hire, waterproofing, screeding/sheeting, grouting, caulking, cleaning, testing, certification, fit-off

Builder notes:
"""${scopeText}"""
Project area: ${projectAreaM2}m2

Valid category IDs you may use (must use ONLY these IDs):
${validCategories}

Available priced unit items (id|categoryId|label|unit|rate):
${unitList}

Return JSON ONLY, no markdown, no commentary, using this exact schema:
{ "trades": [{ "categoryId": "electrical", "label": "Electrical", "confidence": 0.95, "tradeScope": "1-3 sentences for this trade only.", "preFilledItems": [{ "unitId": "el-downlight", "quantity": 6, "reason": "6 LED downlights mentioned" }], "suggestedItems": [{ "unitId": "el-gpo-double", "quantity": 2, "reason": "Common fit-off item" }] }] }

Rules:
- MUST ONLY use category IDs from the valid list above.
- NEVER return room assemblies such as bathroom, kitchen, laundry or toilet/wc as detected trades.
- Detect only independent priced trades that will actually be quoted.
- tradeScope must be specific to that trade only, never the full project narrative.
- Mention compliance refs where relevant, for example AS3740, AS/NZS 3000, AS3786.
- preFilledItems are explicitly mentioned or strongly evidenced.
- suggestedItems are commonly required chain items not clearly mentioned, max 5 per trade.
- confidence must be between 0.1 and 1.0.
- Return valid JSON only.`;
}
