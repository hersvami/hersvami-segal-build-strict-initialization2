# Next Steps

Last updated: 2026-04-30

## Fetch-Safe Refactor Blocks

Continue splitting large files so future AI sessions can fetch every text file safely.

Recommended order:

1. ✅ Split `src/utils/pdfGenerator.ts`.
2. ✅ Split `src/App.tsx` into app layout/actions/hooks files.
3. ✅ Split `src/utils/pricing/parametricUnits.ts` and `parametricUnitsPart2.ts` by trade group.
4. ✅ Split large category files by category group.
5. ✅ Keep every `.ts`, `.tsx`, and `.md` file below roughly 3.5 KB where practical.

Status: ✅ COMPLETED - All major files have been split into fetch-safe modules.

## Feature Work After Refactor

1. ✅ Implement self-learning rate memory so builder-updated rates are remembered and applied to future quotes/variations.
2. Review answer-based pricing multipliers with a builder/QS and tune by category.
3. Replace benchmark-unverified rates with verified Victorian supplier/subcontractor or QS-approved rates.
4. Review customer-facing PDF wording with builder/legal input before production use.
5. Plan Firestore, Authentication, and Customer Portal as separate major phases.
6. Optional: add Vitest or another formal test runner around the existing validation harness.

## Self-Learning Rate Memory - IMPLEMENTED

Implementation completed on 2026-04-30:

1. ✅ Store user rate overrides locally using `localStorage` via `src/utils/rateMemory.ts`.
2. ✅ Track each override by categoryId (trade/category).
3. ✅ Save rate, last updated date, and source (`user_override`).
4. ✅ Apply saved overrides automatically when adding parametric BoQ items.
5. ✅ Show UI indicator (green highlight + 💾 icon) when a rate comes from user memory.
6. ✅ Stage costs excluded (lump-sum allowances, not unit rates).
7. ✅ Materials excluded (volatile pricing, future Material Library feature).

Files modified:
- `src/utils/rateMemory.ts` - New utility for managing rate memory
- `src/components/variationBuilder/PricingStep.tsx` - Saves rate overrides when user manually changes rates
- `src/components/variationBuilder/ParametricEditor.tsx` - Applies remembered rates to new items

This is builder-controlled learning - the app remembers rates only when the builder explicitly changes them.

## Required Verification

- ✅ Run `build_project` after each implementation block.
- ✅ Update this handover after each implementation block.