# Done And Remaining

Last updated: 2026-04-30

## Done

- [x] Restored the main Segal Build app source from repo/user-provided source.
- [x] Restored core state, domain types, company constants and local persisted state.
- [x] Restored category, pricing, AI, variation builder and report components.
- [x] Restored and cleaned app entry point so the restored app loads instead of the starter screen.
- [x] Created a clean handover structure under `handover/current/`.
- [x] Split large source files into smaller fetch-safe modules.
- [x] Split services, PDF generator, App, parametric units, categories, trade analyser, editor and variation builder files.
- [x] Added formal estimator review flags.
- [x] Persisted estimator review flags onto saved variations.
- [x] Displayed saved review flags in the builder report view.
- [x] Added AI suggested BoQ item UI and accept flow.
- [x] Expanded AI fallback recognition and merged fallback with Gemini results.
- [x] Added A-Z individual tradeperson selector.
- [x] Added broader tradeperson directory including stonemason, bricklayer, roofer, tiler, electrician and others.
- [x] Tied individual trades to rates, units, duration and generated trade categories.
- [x] Added rate provenance metadata and benchmark-unverified warnings.
- [x] Added answer-based pricing adjustments from category questions.
- [x] Added customer-facing PDF wording polish.
- [x] Added full Segal Build Terms and Conditions to generated PDFs.
- [x] Added Segal Build signature/contact details to outbound messages.
- [x] Added deterministic validation harness and visible validation panel.
- [x] Verified the app builds successfully after implementation blocks.
- [x] Implemented self-learning builder rate memory for future quotes/variations.
- [x] Added rateMemory utility that stores user-confirmed rate overrides in localStorage.
- [x] Added save-to-memory action when the builder edits a parametric unit rate in Pricing Step.
- [x] Applied remembered rates automatically when future parametric BoQ items are added.
- [x] Showed visual feedback (green highlight + 💾 icon) when remembered rates are being used.
- [x] Showed rate source as `user_override` with last updated timestamp.
- [x] Excluded stage costs from rate memory (lump-sum allowances, not unit rates).
- [x] Excluded materials from rate memory (volatile pricing, to be handled separately in future Material Library feature).

## Still To Do

- [ ] Add a formal test runner around the deterministic validation harness.
- [ ] Replace benchmark-unverified rates with verified Victorian supplier/subcontractor, Rawlinsons or QS-approved rates.
- [ ] Review and tune answer-based pricing multipliers with builder/QS input.
- [ ] Review PDF wording and Terms and Conditions with builder/legal input before production use.
- [ ] Implement Firebase Authentication.
- [ ] Implement Firestore persistence.
- [ ] Build the Customer Portal.
- [ ] Restore or replace `public/ignore.png` using a binary-safe method if needed.
- [ ] Decide whether `.firebase/hosting.ZGlzdA.cache` should remain excluded as deployment cache.
- [ ] Consider implementing a Material Library feature for managing volatile material costs separately from rate memory.

## Self-Learning Rate Memory Status

Status: ✅ IMPLEMENTED

Implementation completed on 2026-04-30:

- Added `src/utils/rateMemory.ts` utility that stores user-confirmed rate overrides in localStorage.
- Added save-to-memory action when the builder edits a parametric unit rate in Pricing Step (`src/components/variationBuilder/PricingStep.tsx`).
- Applied remembered rates automatically when future parametric BoQ items are added (`src/components/variationBuilder/ParametricEditor.tsx`).
- Showed visual feedback (green highlight + 💾 icon) when remembered rates are being used.
- Rate source shown as `user_override` with last updated timestamp.
- Stage costs excluded from rate memory (lump-sum allowances, not unit rates).
- Materials excluded from rate memory (volatile pricing, to be handled separately in future Material Library feature).