# Validation

Validated by source inspection plus successful builds:

- Universal estimator workflow is wired into the UI through `VariationBuilder.tsx`, `BuilderStepContent.tsx`, `ScopeStep.tsx`, `Editors.tsx`, `PricingStep.tsx`, and `ReviewStep.tsx`.
- Archetype-aware behavior exists through `WorkCategory.archetype`, `dimensionMode`, `isManualTemplateCategory`, `isTradeOnlyCategory`, and details rendering in `Editors.tsx`.
- Project-level baseline is separated from category-level scope details through `BaselineStep.tsx`, `deriveScopeDimensions`, and `syncScopePricing`.
- Rate-library transparency exists through `ParametricEditor.tsx`, `PricingStep.tsx`, compliance refs, editable rates, quantities, and override notes.
- Smart item selection exists through `tradeAnalyser.ts`, `createScopeFromCategory.ts`, pre-filled `parametricItems`, and selectable AI suggested BoQ items in `TradeAnalysisPanel.tsx`.
- Trade-chain expansion exists through `tradeChain.ts` and `TradeAnalysisPanel.tsx`.
- Dimension propagation exists through `baseline`, `deriveScopeDimensions`, `syncScopePricing`, `DimensionInput`, and `Editors.tsx`.
- Formal estimator review flags exist through `src/utils/estimatorReview.ts` and are surfaced in `ReviewStep.tsx`.
- Estimator review flags are now persisted onto saved variations as `reviewFlags` and shown in the builder report view.
- Customer-facing PDF wording has been polished through split PDF modules. The PDF now includes a document overview, clearer client-facing price labels, scoped inclusions/exclusions, and more careful important notes wording.
- Segal Build Terms and Conditions are now stored in split legal modules under `src/utils/legal/` and appended to generated quote/variation PDFs.
- Manual trade/category addition now includes an A-Z searchable individual trade selector in `CategoryBrowserPanel.tsx`, backed by `src/utils/trades/tradeDirectory.ts`.
- Added missing individual trade categories for Tiler, Carpenter, Plasterer and Bricklayer-style work through `individualTrades.ts`.
- The individual trades directory now includes a broader A-Z tradeperson list with rates and units tied to each trade through `tradeRateDirectory.ts`.
- Every individual tradeperson selection now maps to its own generated `trade...` category ID, so selecting Electrician, Bricklayer, Stonemason, Roofer, etc. uses that tradeperson's displayed rate rather than a broader work category rate.
- Generated tradeperson categories are created for the full trade directory, including Arborist, Asbestos Removalist, Excavator, Garage Door Installer, Gutter/Fascia Installer, Locksmith, Pest Controller, Scaffolder, Solar Installer and Stonemason.
- Tradeperson and BoQ rates now carry provenance metadata: `rateSource`, `rateConfidence`, and `lastReviewed`.
- Current tradeperson and BoQ rates are explicitly marked as `benchmark_unverified`, and the UI warns builders to verify rates before quoting.
- A deterministic validation harness now exists in `src/utils/validation/`. It checks quote maths, dimension propagation, trade-chain suggestions, rate provenance metadata, estimator flags and answer-based pricing.
- `SystemValidationPanel.tsx` surfaces the deterministic validation harness and rate audit summary on the welcome screen for visible QA.
- Category question answers are persisted into each scope and influence stage pricing through `answerPricing.ts` and `syncScopePricing`.
- Segal Build company details and outbound email signatures were updated from the supplied signature block, including ABN, BPC registrations, mobile, website, review link, social links and confidentiality notice.

Recent QA fix:

- `tradeAnalyser.ts` now uses `getAllParametricUnits()` so AI item selection sees the base and Part 2 rate libraries.
- Trade recognition fallback was expanded to cover more trade categories and infer likely independent trades from room words such as bathroom, kitchen, laundry, toilet and shower.
- Gemini trade results are now merged with deterministic keyword/room fallback results so obvious trades mentioned in the description are not dropped if the model misses them.

Not complete yet:

- No formal test runner is installed yet, but deterministic validation functions are available for the next test-runner integration.
- No Firestore, Authentication, or Customer Portal implementation exists yet.