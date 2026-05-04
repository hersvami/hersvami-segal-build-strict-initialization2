# Segal Build Work Handover

Last updated: 2026-05-04

## Current Status

The repository has been reconstructed on disk, packages have been installed, and the app builds successfully with `npm run build`.

## File Size Rule

- Keep active source files under approximately 150 lines where practical so files fetch cleanly from GitHub and remain easy to review.
- Only split files that are clearly too large or mixing too many responsibilities.
- Larger data-only files may exceed this rule when appropriate, but should be chunked if they become difficult to fetch or review.

## Completed

- [x] Synced source files from GitHub to disk.
- [x] Verified `src/utils/` structure exists, including rate memory and trade helper files.
- [x] Restored all `src/utils/` subdirectories, including categories, pricing, PDF, validation, services, trades, legal, company, and AI helpers.
- [x] Restored component root files, report files, and variation builder files.
- [x] Installed required packages: `lucide-react`, `jspdf`, `jspdf-autotable`.
- [x] Fixed `WorkCategory` stage typing to match category files (`rate` and `unit`).
- [x] Fixed category group files to use Rawlinsons-style stage templates correctly.
- [x] Added `src/types/index.ts` compatibility barrel for legacy imports.
- [x] Reworked `createScopeFromCategory` for the current quote-scope model.
- [x] Prevented single-trade scopes from inheriting whole-project scope descriptions.
- [x] Strengthened persistence with primary and backup localStorage keys.
- [x] Added backup state recovery.
- [x] Added explicit persistence flush on `pagehide` and `visibilitychange`.
- [x] Added immediate save in state updater.
- [x] Saved Gemini API key immediately to localStorage.
- [x] Added real edit flow for saved quotes and variations.
- [x] Added Edit button to quote/variation cards.
- [x] Made the builder load existing quotes/variations with saved scopes, baseline, margins, contingency, and variation metadata.
- [x] Made saving an edited quote update the existing variation instead of creating a duplicate.
- [x] Added saved quote pricing edits in the Builder view.
- [x] Confirmed persistence improvements were saved in `src/logic/state.ts`.
- [x] Confirmed existing quote/variation edit flow was saved across `VariationBuilder`, `useVariationBuilderController`, and `VariationReport`.
- [x] Added Rawlinsons 2021 benchmark data model and metadata.
- [x] Added Rawlinsons wage rates, cost types, labour/material split fields, GST metadata, escalation, and preliminaries helpers.
- [x] Connected Rawlinsons benchmark matching into stage pricing where appropriate.
- [x] Rebuilt PDF generation into a deterministic quote-style document.
- [x] Reworked send-message preview to include stage descriptions and stage prices.
- [x] Rebuilt successfully after each major change.

## Recent Completed Work

- [x] Add Rawlinsons pricing resolver foundation with benchmark, material/P.C., escalation, and preliminaries helpers.
- [x] Surface pricing source metadata in the Pricing UI.
- [x] Add editable preliminaries section to the Pricing step.
- [x] Persist preliminaries settings into quotes/variations.
- [x] Build a polished real builder quote HTML preview with quote metadata, line schedule, payment terms, and acceptance section.
- [x] Split the customer quote HTML view into smaller files under 100 lines.
- [x] Build a polished real builder PDF template matching the final HTML quote style.
- [x] Split PDF generator into fetch-ready modules under `src/utils/pdfQuote/`.
- [x] Split Rawlinsons 2021 rate library into fetch-ready modules under `src/utils/rates/`.
- [x] Added Rawlinsons material/P.C. supply-only rate library in fetch-ready modules.
- [x] Split persisted state logic into fetch-ready modules under `src/logic/`.
- [x] Fix download/export behavior across Chrome without blocked popup behavior.

## Remaining Work

- [ ] Add a PDF preview/print flow so the user can see exactly what the customer receives.
- [ ] Add deterministic quote numbering rather than using short IDs.
- [ ] Add quote expiry controls.
- [x] Add acceptance/signature section to HTML customer quote and PDF.
- [ ] Add payment schedule/stage claims section.
- [x] Add preliminaries as a dedicated editable quote section.
- [x] Add basic `cost_type` toggles in the pricing UI: composite, material-only, labour-only, hire, provision.
- [x] Add explicit Rawlinsons source labels beside rates in the Pricing UI.
- [x] Add basic rate confidence and source indicators to pricing rows.
- [ ] Add material/P.C. selector for relevant BoQ lines.
- [ ] Persist selected material/P.C. choices into quote items and reopen them correctly in edit mode.
- [ ] Add full rate library manager.
- [ ] Add CSV/JSON import for Rawlinsons and supplier rate sheets.
- [ ] Add supplier/subcontractor quote upload and extraction workflow.
- [ ] Move project, quote, API key, rate library, and rate memory persistence from localStorage to Firebase.
- [ ] Add authentication and company-scoped data.
- [ ] Add robust backup/export/import for project data.

## Known Caveats

- LocalStorage is improved but is still not suitable as the only long-term business storage.
- Rawlinsons rates are benchmark rates and must be reviewed before issuing final quotes.
- Rawlinsons matching is keyword-based and can select a nearby benchmark, not guaranteed exact item matching.
- Current PDF is generated client-side with jsPDF. A browser print-to-PDF HTML template may give more reliable styling.
- Existing PDF download should no longer open blocked popup tabs, but Chrome/browser settings can still affect automatic downloads.

## Next Recommended Task

Add a material/P.C. selector for relevant BoQ lines:

- Allow toilets, basins, baths, sinks, tapware, benchtops, tiles, flooring, hot water systems and similar items to select from the Rawlinsons material/P.C. library.
- Show base 2021 rate, escalation, escalated rate, GST excluded status, and source label.
- Apply the selected P.C./material rate to the BoQ line and recalculate totals.
- Persist the selected material/P.C. item and source metadata into saved quotes.

## Suggested New Chat Bootstrap Prompt

Use this in a new chat if context gets too long:

```text
We are continuing work on the Segal Build React + TypeScript + Vite + Tailwind construction estimating app.

Repository URL:
https://github.com/hersvami/hersvami-segal-build-strict-initialization2

Before making changes:
1. Fetch or inspect the repo file tree.
2. Read handover/WORK-HANDOVER.md first.
3. Read handover/CURRENT-HANDOVER.md second.
4. Verify the current source files exist locally, especially:
   - src/logic/state.ts
   - src/logic/persistence.ts
   - src/components/report/CustomerView.tsx
   - src/components/report/QuoteLineSchedule.tsx
   - src/components/variationBuilder/PricingStep.tsx
   - src/utils/rates/materialRates2021.ts
   - src/utils/rates/rawlinsons2021.ts
   - src/utils/pricing/rawlinsonsBenchmarkResolver.ts
   - src/utils/pricing/materialPcResolver.ts
   - src/utils/pricing/preliminaries.ts
5. Run npm install only through the package install tool if dependencies are missing.
6. Do not edit package.json directly.
7. Keep active source files approximately under 150 lines where practical. Only split files that are clearly too large or mixing too many responsibilities.
8. Use npm run build/build_project after changes.

Current completed work includes:
- Full repo/source sync.
- Build passes.
- localStorage persistence hardened with backup state and flush on pagehide/visibilitychange.
- Existing quote/variation edit flow added.
- Edit button on saved documents added.
- Existing quotes reopen in builder and save back to the same variation.
- Rawlinsons benchmark and material/P.C. data added in fetch-ready modules.
- Pricing resolver foundation added.
- Pricing UI shows source metadata and cost type selector.
- Editable preliminaries section added.
- Customer HTML quote and PDF quote template improved.

Next task:
Add a material/P.C. selector for relevant BoQ lines so a builder can choose Rawlinsons fixture/material values directly, persist the selection, and recalculate quote totals.
```
