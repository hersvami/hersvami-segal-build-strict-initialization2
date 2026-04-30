# Next Steps

## Fetch-Safe Refactor Blocks

Continue splitting large files so future AI sessions can fetch every text file safely.

Recommended order:

1. Split `src/utils/pdfGenerator.ts`.
2. Split `src/App.tsx` into app layout/actions/hooks files.
3. Split `src/utils/pricing/parametricUnits.ts` and `parametricUnitsPart2.ts` by trade group.
4. Split large category files by category group.
5. Keep every `.ts`, `.tsx`, and `.md` file below roughly 3.5 KB where practical.

## Feature Work After Refactor

1. Implement self-learning rate memory so builder-updated rates are remembered and applied to future quotes/variations.
2. Review answer-based pricing multipliers with a builder/QS and tune by category.
3. Replace benchmark-unverified rates with verified Victorian supplier/subcontractor or QS-approved rates.
4. Review customer-facing PDF wording with builder/legal input before production use.
5. Plan Firestore, Authentication, and Customer Portal as separate major phases.
6. Optional: add Vitest or another formal test runner around the existing validation harness.

## Self-Learning Rate Memory Proposal

Recommended implementation:

1. Store user rate overrides locally first using `localStorage`.
2. Track each override by trade/category or BoQ unit ID.
3. Save rate, unit, note, source, last updated date, and previous value.
4. Apply saved overrides automatically when creating future scopes.
5. Show a UI indicator when a rate comes from user memory rather than benchmark defaults.
6. Later, migrate these overrides to Firestore per company once Authentication and Firestore exist.

This should be treated as builder-controlled learning, not autonomous AI learning. The app should remember rates only when the builder explicitly saves or confirms them.

## Required Verification

- Run `build_project` after each implementation block.
- Update this handover after each implementation block.