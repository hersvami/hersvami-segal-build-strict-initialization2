# Segal Build — Handover Document

> Generated: 2025-01-02
> Build: `npm run build` ✅ green — 2142 modules, 1,283.43 kB (382.27 kB gzipped)

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [What Was Completed (Verified On Disk)](#2-what-was-completed-verified-on-disk)
3. [What Was Partially Done](#3-what-was-partially-done)
4. [What Was Claimed But Not Actually Done](#4-what-was-claimed-but-not-actually-done)
5. [What Remains To Be Done](#5-what-remains-to-be-done)
6. [File Structure](#6-file-structure)
7. [Known Caveats](#7-known-caveats)
8. [How To Continue](#8-how-to-continue)

---

## 1. Project Overview

Segal Build is a React + TypeScript + Vite + Tailwind CSS construction estimating app for Victorian builders. It manages projects, quotes, variations, scope recognition (AI + keyword fallback), pricing (Rawlinsons 2021 benchmarks), PDF generation (jsPDF), and customer communication.

**Tech stack:** React 19, TypeScript, Vite 7, Tailwind CSS 4, lucide-react, jsPDF, jspdf-autotable.

**Storage:** localStorage only (not Firebase). State normalised on every write.

---

## 2. What Was Completed (Verified On Disk)

### Core Infrastructure
- [x] Full source tree synced and reconstructed on disk (all 5 chunks)
- [x] Packages installed: `lucide-react`, `jspdf`, `jspdf-autotable`
- [x] Project builds successfully (`npm run build`)
- [x] `tsconfig.json` and `vite.config.ts` configured with path aliases
- [x] `src/types/index.ts` compatibility barrel for legacy imports

### State & Persistence
- [x] Primary + backup localStorage keys (`segal-build-v2.0`, `segal-build-latest`)
- [x] Persistence flush on `pagehide` and `visibilitychange`
- [x] Immediate save in state updater function
- [x] Gemini API key saved immediately to localStorage
- [x] `uiState.showProjectForm` preserved during state normalisation (modal opens correctly)

### Projects & Variations
- [x] Project duplication — copies project + all variations with new IDs, appends "(Copy)" to name
- [x] Real-time project search in sidebar — filters by project name, address, or customer name
- [x] Estimator pipeline analytics dashboard on welcome screen — total projects, pipeline value, win rate, avg quote size
- [x] Real edit flow for saved quotes and variations
- [x] Edit button on quote/variation cards in `VariationReport.tsx`
- [x] Builder loads existing quotes/variations with saved scopes, baseline, margins, contingency
- [x] Saving an edited quote updates the existing variation (no duplicate)
- [x] Saved quote pricing edits available in the Builder view

### Categories & Rawlinsons
- [x] Rawlinsons 2021 benchmark data model, metadata, wage rates
- [x] Cost types (composite/material/labour), GST metadata, escalation, preliminaries helpers
- [x] Rawlinsons benchmark matching connected into stage pricing
- [x] **6-layer scoring system** in `rawlinsonsMatcher.ts` — trade field match (+15), must-have keywords (+5 each with multi-hit bonuses), stage label word-boundary matching (+3), unit exact match (+3), exclude penalties (-20), no-trade-match penalty (-10)
- [x] **`'allow'` unit short-circuit** — builder's lump-sum allowances skip Rawlinsons benchmark matching entirely
- [x] Rawlinsons rate library split into fetch-ready modules under `src/utils/rates/`
- [x] Rawlinsons material/P.C. supply-only rate library (9 categories, 60+ items)
- [x] Category group files use Rawlinsons-style stage templates
- [x] `WorkCategory` stage typing fixed to match category files

### PDF & Customer Views
- [x] PDF generation rebuilt into deterministic quote-style document (jsPDF)
- [x] PDF generator split into modules under `src/utils/pdfQuote/`
- [x] Customer quote HTML view split into files under 100 lines each
- [x] Acceptance/signature section in HTML quote and PDF
- [x] Send-message preview includes stage descriptions and stage prices

### UI Hardening
- [x] Sidebar hardened against missing app action props (prevents runtime crash)
- [x] Download/export uses `dispatchEvent(new MouseEvent('click'))` to avoid blocked popups
- [x] No-cache HTML metadata + runtime cache cleanup helper

### Pricing UI (Existing)
- [x] Pricing source metadata surface in the Pricing step
- [x] Editable preliminaries section in the Pricing step
- [x] Preliminaries settings persist into quotes/variations
- [x] Cost type toggles (composite, material-only, labour-only, hire, provision)
- [x] Rawlinsons source labels beside rates
- [x] Rate confidence and source indicators on pricing rows

### Supplier/Subcontractor Quote Upload
- [x] `SupplierQuoteUpload.tsx` — 4-step wizard (Upload → Map → Preview → Done)
- [x] Excel (.xlsx/.xls) parsing via `xlsx` library + CSV support
- [x] Smart column auto-detection (trade, description, qty, unit, rate, total)
- [x] Trade matching against `TRADE_RATE_DIRECTORY` by name or keywords
- [x] Summary cards: total line items, matched/unmatched, total value
- [x] Preview table with matched trade indicators (green ✓ / amber ⚠)
- [x] Imports matched rates as overrides (only if >5% different from benchmark)
- [x] Accessible from Rate Library Manager header and Welcome Screen

### CSV/JSON Rate Import
- [x] `RateImportModal.tsx` — drag-drop CSV/JSON file upload with auto column detection (trade, rate, unit, item, description, cost)
- [x] Smart trade matching: fuzzy match against `TRADE_RATE_DIRECTORY` by name or keywords
- [x] Preview table showing imported rate, current benchmark rate, and % difference
- [x] Unmatched rows highlighted in amber for manual review
- [x] Applies all matched rates to localStorage overrides in one click
- [x] Accessible from Rate Library Manager header (Import button) and Welcome Screen (Import Rates button)

### Rate Library Manager
- [x] `RateLibraryManager.tsx` — full-page UI with tabbed Trade Rates / Material-P.C. views
- [x] Search filtering across trades (by name, description, keywords) and materials (by name, category)
- [x] Category filter pills for materials (all 9 categories)
- [x] Inline rate editing with Enter-to-save for trade rates
- [x] Reset-to-benchmark button for each overridden rate
- [x] Override persistence in localStorage (`segal_build_rate_overrides`)
- [x] Overrides applied in `syncScopePricing` — stage costs use overridden rates
- [x] WelcomeScreen has a "Rate Library" button
- [x] SystemValidationPanel shows active override count

### Material/P.C. Selector (Latest Work)
- [x] `materialPcId` + `selectedMaterialLabel` added to `PricingSourceMeta` in `src/types/domain.ts`
- [x] `MaterialPcSelectorModal` component — searchable modal with 9 category filter pills, table showing base 2021 rate, escalation factor, escalated rate, type badge (PC/Supply), select button
- [x] Purple price-tag button on each BoQ line in `PricingStep.tsx` opens the selector
- [x] Selected rate applies escalated rate + full `pricingSource` metadata to the BoQ item
- [x] Selected material label shows inline on the BoQ line (e.g. "· W.C. Suite — Vitreous China")
- [x] `RateSourceBadge` shows purple badge for material/PC sourced rates, blue for other sources
- [x] `ParametricEditor.tsx` — integrated Material/P.C. selector (PackageSearch button), shows base 2021 rate → escalated rate, escalation factor, GST status inline on each row

### Document Numbering & Headers
- [x] `CustomerQuoteHeader.tsx` — contextual "Quotation # Q-001" vs "Variation # V-001" based on `documentType`
- [x] Labels changed from "Quotation Date" → "Document Date" and "Expiration" → "Valid until"
- [x] `buildVariationPayload.ts` — deterministic `Q-001`, `Q-002` for quotes alongside `V-001`, `V-002` for variations

### Quote Expiry Controls
- [x] `expiryDays` field added to `Variation` type in `src/types/domain.ts` (default 30)
- [x] Editable expiry days control in `PricingStep.tsx` (4-column grid)
- [x] Editable expiry days control in `ReviewStep.tsx` (inline in pricing summary)
- [x] `buildVariationPayload.ts` — persists `expiryDays` to variation
- [x] `useVariationBuilderController.ts` — state management + edit flow persistence
- [x] `CustomerQuoteHeader.tsx` — uses `variation.expiryDays` to calculate expiry date

### PDF Preview & Payment Stages
- [x] PDF Preview button in `VariationReport.tsx` (indigo Eye icon) — opens generated PDF in new browser tab for native preview/print
- [x] DBCA 1995 (Section 40) progressive payment schedule in `CustomerView.tsx` via `PaymentStages.tsx` component — Deposit 5%, Base 10%, Frame 15%, Lock-up 35%, Fixing 20%, PC 15%, with cumulative totals

### Project Management & Analytics
- [x] Project duplication — `duplicateProject()` in `projectActions.ts`, copies project + all variations with new IDs, appends "(Copy)" to name
- [x] Real-time project search in sidebar — filters by project name, address, or customer name (shows when >5 projects)
- [x] Copy/Duplicate button on each project card (visible on hover)
- [x] Estimator pipeline analytics dashboard on welcome screen — 4 stat cards: Total Projects, Pipeline Value, Win Rate, Avg Quote Size

### Material Takeoff (Builder Only)
- [x] "Materials" tab in Variation Report (visible to Builder, hidden from Customer)
- [x] **Deduplication Engine**: Uses Map-based aggregation to merge identical materials across multiple scopes. Guarantees no double-counting of items or prices.
- [x] **Per-Scope Dimensions**: Every scope now supports individual Width, Length, and Height inputs (via `ScopeDimensions.tsx`), allowing precise material calculations for each trade.
- [x] **Smart Preferences Panel**: 15+ product selectors (Tile Size/Type, Decking Timber/Profile, Flooring Type/Width, Shower Screen, Vanity Size, Paint Brand/Finish, Insulation R-Value, Window Type, etc.) that dynamically adjust cost and quantity estimates.
- [x] **27+ Category Generators**: Covers every major trade including Decking, Bathroom, Kitchen, Flooring, Tiling, Painting, Insulation, Windows, Carpentry, Plumbing, Electrical, Concreting, Roofing, Fencing, Waterproofing, Plastering, Demolition, Brickwork, Structural, HVAC, Landscaping, Pergola, Paving, Cladding, Rendering, Ceilings, Internal Walls, and Cabinetry.
- [x] Editable table inside the app — add, remove, or adjust any item
- [x] "Export Material List" button — generates PDF with "BUILDER ONLY" watermark

---

## 3. What Was Partially Done

_No partially done items remaining._

---

## 4. What Was Claimed But Not Actually Done

_All 4 items have now been implemented:_

| Item | Implementation |
|---|---|
| **ParametricEditor + Material/P.C. library** | PackageSearch button opens `MaterialPcSelectorModal`, rate applied with full `pricingSource` metadata, inline base→escalated display |
| **DBCA 1995 stage claim table** | `PaymentStages.tsx` — 6-stage Victorian schedule (Deposit 5% → PC 15%), cumulative totals |
| **PDF Preview button** | `VariationReport.tsx` — indigo Eye icon opens PDF blob in new browser tab |
| **Base 2021 rate + escalation in ParametricEditor** | Each BoQ row shows `selectedMaterialLabel`, `$base → $escalated (x-factor)`, GST status |

---

## 5. What Remains To Be Done

### High Priority (Near-Term Value)

| Priority | Task | Status |
|---|---|---|
| 🔴 | Contextual document header | ✅ Done |
| 🔴 | Deterministic quote numbering | ✅ Done |
| 🟡 | PDF preview / print flow | ✅ Done — indigo Preview button opens PDF in new tab |
| 🟡 | Stage claim table (DBCA 1995) | ✅ Done — `PaymentStages.tsx` with 6-stage Victorian schedule |

### Medium Priority

| Priority | Task | Status |
|---|---|---|
| 🟡 | Material/P.C. selector in ParametricEditor | ✅ Done |
| 🟢 | Persist material/P.C. selection to edit mode | ✅ Done |
| 🟢 | Quote expiry controls | ✅ Done — editable in Pricing + Review steps, persisted to variation |

**All medium priority items complete.**
| 🟢 | Quote expiry controls | ✅ Done — editable expiry days in Pricing Step + Review Step, persisted to variation, used in CustomerQuoteHeader |

### Lower Priority (Future)

| Priority | Task | Description | Estimated Effort |
|---|---|---|---|
| 🔵 | ~~Full rate library manager~~ | ✅ Done — `RateLibraryManager.tsx` with tabbed Trade/Material views, search, inline editing, localStorage persistence, and override reset to benchmark. |
| 🔵 | ~~CSV/JSON import for rate sheets~~ | ✅ Done — `RateImportModal.tsx` with drag-drop CSV/JSON upload, auto column detection, trade matching against benchmark library, % diff display, localStorage persistence. Accessible from Rate Library Manager and Welcome Screen. |
| 🔵 | ~~Supplier/subcontractor quote upload~~ | ✅ Done — `SupplierQuoteUpload.tsx` with Excel (.xlsx/.xls) and CSV upload, smart column auto-detection, trade matching, preview table, import to rate overrides. |
| 🔵 | **Firebase migration** | Move all persistence from localStorage to Firestore. Auth + company-scoped data. | 3-5 days |
| 🔵 | **Backup/export/import** | Robust JSON export + import of full project data with validation. | 1-2 days |

---

## 6. File Structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── app/
│   ├── AppLayout.tsx
│   ├── MainContent.tsx
│   └── useAppActions.ts
├── components/
│   ├── ExternalQuoteModal.tsx
│   ├── LoadingSpinner.tsx
│   ├── RateLibraryManager.tsx             ← NEW (rate library CRUD UI)
│   ├── RateImportModal.tsx                ← NEW (CSV/JSON rate import)
│   ├── SupplierQuoteUpload.tsx            ← NEW (Excel/CSV supplier quote upload)
│   ├── PhotoCapture.tsx
│   ├── ProgressHub.tsx
│   ├── ProjectChat.tsx
│   ├── ProjectForm.tsx
│   ├── SendWelcomeEmailModal.tsx
│   ├── Sidebar.tsx
│   ├── SystemValidationPanel.tsx
│   ├── VariationBuilder.tsx
│   ├── WelcomeScreen.tsx
│   ├── welcomeMessages.ts
│   ├── report/
│   │   ├── BuilderView.tsx
│   │   ├── CustomerQuoteHeader.tsx
│   │   ├── CustomerQuoteSummary.tsx
│   │   ├── CustomerView.tsx
│   │   ├── CustomerViewParts.tsx
│   │   ├── PaymentStages.tsx              ← NEW (DBCA 1995 payment schedule)
│   │   ├── ProgressHub.tsx
│   │   ├── QuoteLineSchedule.tsx
│   │   ├── ReportSendModal.tsx
│   │   └── VariationReport.tsx
│   └── variationBuilder/
│       ├── AddedScopesPanel.tsx
│       ├── BaselineStep.tsx
│       ├── BuilderHeader.tsx
│       ├── BuilderStepContent.tsx
│       ├── CategoryBrowserPanel.tsx
│       ├── CategoryInfoPanel.tsx
│       ├── CategoryQuestions.tsx
│       ├── DimensionInput.tsx
│       ├── EditableList.tsx
│       ├── Editors.tsx
│       ├── MaterialPcSelectorModal.tsx     ← NEW (latest work)
│       ├── PCItemEditor.tsx
│       ├── ParametricEditor.tsx
│       ├── PhaseBoqPanel.tsx
│       ├── PreliminariesPanel.tsx
│       ├── PricingStep.tsx                ← MODIFIED (latest work)
│       ├── RateSourceBadge.tsx            ← MODIFIED (latest work)
│       ├── ReviewStep.tsx
│       ├── ScopeDetailEditor.tsx
│       ├── ScopeDimensions.tsx
│       ├── ScopeInputPanel.tsx
│       ├── ScopeStep.tsx
│       ├── StageListEditor.tsx
│       ├── TradeAnalysisPanel.tsx
│       ├── answerPricing.ts
│       ├── buildVariationPayload.ts
│       ├── builderDraft.ts
│       ├── builderShared.ts
│       ├── phaseGrouping.ts
│       ├── scopePricing.ts
│       └── useVariationBuilderController.ts
├── constants/
│   └── companies.ts
├── logic/
│   ├── initialState.ts
│   ├── persistence.ts
│   ├── projectActions.ts
│   ├── state.ts
│   ├── usePersistedAppState.ts
│   └── variationActions.ts
├── types/
│   ├── appState.ts
│   ├── domain.ts                           ← MODIFIED (added materialPcId, selectedMaterialLabel)
│   └── index.ts
├── utils/
│   ├── cacheControl.ts
│   ├── cn.ts
│   ├── rateOverrides.ts                 ← NEW (override persistence)
│   ├── createScopeFromCategory.ts
│   ├── estimatorReview.ts
│   ├── formatters.ts
│   ├── helpers.ts
│   ├── rateMemory.ts
│   ├── tradeCategories.ts
│   ├── tradeTemplates.ts
│   ├── ai/
│   │   ├── tradeAnalyser.ts
│   │   ├── tradeAnalyserFallback.ts
│   │   ├── tradeAnalyserMerge.ts
│   │   ├── tradeAnalyserParser.ts
│   │   ├── tradeAnalyserPrompt.ts
│   │   ├── tradeAnalyserTypes.ts
│   │   └── tradeNormaliser.ts
│   ├── categories/
│   │   ├── categoryTypeOptions.ts
│   │   ├── core.ts
│   │   ├── corePart2.ts
│   │   ├── corePart3.ts
│   │   ├── extended.ts
│   │   ├── types.ts
│   │   └── groups/ (13 files)
│   ├── company/
│   │   └── signature.ts
│   ├── legal/
│   │   ├── terms.ts
│   │   ├── termsPart1.ts
│   │   ├── termsPart2.ts
│   │   └── termsPart3.ts
│   ├── pdf/ (8 files)
│   ├── pdfQuote/ (7 files)
│   ├── pricing/
│   │   ├── baselineMultipliers.ts
│   │   ├── benchmarkTypes.ts
│   │   ├── constants.ts
│   │   ├── engine.ts
│   │   ├── index.ts
│   │   ├── materialPcResolver.ts
│   │   ├── parametricUnits.ts
│   │   ├── parametricUnitsPart2.ts
│   │   ├── preliminaries.ts
│   │   ├── quoteCalculator.ts
│   │   ├── quoteDefaults.ts
│   │   ├── rawlinsonsBenchmarkResolver.ts
│   │   ├── rawlinsonsCategoryMap.ts
│   │   ├── scopeRecogniser.ts
│   │   ├── tradeChain.ts
│   │   ├── types.ts
│   │   └── units/ (9 files)
│   ├── rates/
│   │   ├── materialRateMetadata.ts
│   │   ├── materialRates2021.ts
│   │   ├── materialRatesConstruction.ts
│   │   ├── materialRatesExternal.ts
│   │   ├── materialRatesFinishes.ts
│   │   ├── materialRatesFixtures.ts
│   │   ├── materialRateTypes.ts
│   │   ├── rawlinsons2021.ts
│   │   ├── rawlinsonsData.ts
│   │   ├── rawlinsonsEscalation.ts
│   │   ├── rawlinsonsMatcher.ts
│   │   ├── rawlinsonsMetadata.ts
│   │   ├── rawlinsonsRates.ts
│   │   └── rawlinsonsTypes.ts
│   ├── services/
│   │   ├── cloudinary.ts
│   │   ├── geminiModels.ts
│   │   └── scopeAi.ts
│   ├── trades/
│   │   ├── tradeDirectory.ts
│   │   ├── tradeIds.ts
│   │   ├── tradeRateDirectory.ts
│   │   ├── tradeRateTypes.ts
│   │   ├── tradeRatesAtoF.ts
│   │   ├── tradeRatesGtoM.ts
│   │   └── tradeRatesNtoZ.ts
│   └── validation/
│       ├── estimatorValidation.ts
│       ├── index.ts
│       └── rateAudit.ts
```

---

## 7. Known Caveats

1. **LocalStorage only** — Not suitable for long-term business storage. Firebase migration needed.

## 7a. Code Cleanup (Dead Files Removed)

| File | Reason |
|---|---|
| `src/utils/cn.ts` | Duplicate of `cn()` in `helpers.ts` — 0 imports |
| `src/utils/formatters.ts` | 0 imports anywhere |
| `src/utils/pdf/` (9 files) | 0 imports — `pdfQuote/` is the active PDF system |
2. **Rawlinsons rates are benchmarks** — Must be reviewed before issuing final quotes.
3. **Keyword-based matching** — Can select a nearby benchmark, not guaranteed exact item matching.
4. **Client-side PDF** — jsPDF may produce less polished output than browser print-to-PDF from HTML.
5. **Chrome download behaviour** — Automatic downloads may still be affected by browser settings despite the `dispatchEvent` fix.
6. **Escalation hardcoded** — 2021→2025 at 5% p.a. (factor ~1.216). Should be configurable.

## 8. Future Roadmap (Potential Enhancements)

- [ ] **Architectural Plan Takeoff Tool (Manual Trace):** Allow builders to upload PDF/Image plans, calibrate the scale by clicking two known points, and "trace" walls/areas with a mouse. The app would auto-calculate Length/Area and feed those dimensions directly into the **Material List**.
- [ ] **Cost vs. Quote Comparison:** Once a quote is approved, allow the builder to input *actual* costs incurred during the build to compare against the original estimate for profitability analysis.
- [ ] **Progress Claims Invoicing:** Connect the "Stage Complete" status in Progress Hub to an automatic "Generate Progress Invoice" feature (DBCA 1995 compliant).
- [ ] **Firebase Migration:** Move data persistence from localStorage to Firebase for multi-device sync and backup.
- [ ] **Customer Portal Authentication:** Add real password validation for the `/portal` route instead of accepting any password for a matching email.

---

## 8. How To Continue

### To pick up work:
```bash
npm install        # if needed
npm run build      # confirm it still builds
```

### Immediate next steps (recommended order):
1. Fix `CustomerQuoteHeader.tsx` — contextual "Quotation #" vs "Variation #" (30 min)
2. Add deterministic `Q-001` numbering in `buildVariationPayload.ts` (1-2 hrs)
3. Add PDF Preview button in `VariationReport.tsx` (1 hr)
4. Add DBCA 1995 stage claim table (2-3 hrs)
5. Wire Material/P.C. selector into `ParametricEditor.tsx` (1-2 hrs)

### To resume in a new chat:
Paste this prompt:

```
Continue Segal Build. Handover doc is at HANDOVER.md.
Completed: Supplier quote upload (Excel/CSV with column mapping), Rate Library Manager, CSV/JSON rate import, Material/P.C. selector, contextual Q/V headers, Q-001 numbering, PDF preview, DBCA 1995 payment stages, quote expiry controls, 6-layer Rawlinsons scoring.
All High and Medium priority items done.
Next: Firebase migration, authentication, company-scoped data.
Build status: ✅ green.
```
