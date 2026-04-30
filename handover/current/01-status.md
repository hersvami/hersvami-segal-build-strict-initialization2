# Current Status

Last updated: 2026-04-29

## Restoration Summary

The app source was restored from the GitHub repo plus user-provided full contents for files that exceeded API output limits.

The application has built successfully multiple times using the required build tool.

## Known Missing Or Intentionally Unsynced

Ignored by instruction:

- `package-lock.json`
- `node_modules/`
- `dist/`
- `.env`
- `.env.local`
- `.DS_Store`

Not restored because it is binary:

- `public/ignore.png`

Not restored because it is deployment cache metadata, not app source:

- `.firebase/hosting.ZGlzdA.cache`

Old handover docs:

- The original multi-file handover docs are not restored locally. This smaller handover replaces them for the current session.

## Fetch-Safe Refactor Started

The user approved splitting large files so future AI sessions can fetch repo files without truncation.

Completed in the first refactor block:

- `src/utils/services.ts` was reduced to a small barrel export.
- Gemini model logic moved to `src/utils/services/geminiModels.ts`.
- AI scope helpers moved to `src/utils/services/scopeAi.ts`.
- Cloudinary helpers moved to `src/utils/services/cloudinary.ts`.
- The handover was split into small `handover/current/*.md` files.

Completed in the second refactor block:

- `src/utils/pdfGenerator.ts` was reduced to a small orchestrator.
- PDF rendering helpers moved into `src/utils/pdf/`.
- `src/App.tsx` was reduced to a small entry component.
- App state actions moved to `src/app/useAppActions.ts`.
- App layout and main content moved to `src/app/AppLayout.tsx` and `src/app/MainContent.tsx`.

Completed in the third refactor block:

- `src/utils/pricing/parametricUnits.ts` was reduced to a compatibility barrel and lookup helper module.
- `src/utils/pricing/parametricUnitsPart2.ts` was reduced to a small Part 2 compatibility export.
- Parametric unit data was split into `src/utils/pricing/units/*.ts` by trade/category group.
- Existing imports from `parametricUnits.ts` and `parametricUnitsPart2.ts` remain supported.

Completed in the fourth refactor block:

- Large category definition files were reduced to compatibility aggregators.
- Category data was split into smaller `src/utils/categories/groups/*.ts` modules.
- Existing imports from `core.ts`, `corePart2.ts`, `corePart3.ts`, and `extended.ts` remain supported.

Completed in the final fetch-safe refactor block:

- `src/utils/ai/tradeAnalyser.ts` was split into prompt, parser, fallback, and type modules.
- `src/components/variationBuilder/Editors.tsx` was reduced to small compatibility exports.
- Scope detail editing was split into `ScopeDetailEditor`, `StageListEditor`, `ScopeDimensions`, and `PhaseBoqPanel`.
- `src/components/VariationBuilder.tsx` was reduced to a modal shell.
- Variation builder controller logic and payload creation moved into smaller `variationBuilder` modules.