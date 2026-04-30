# Segal Build Current Handover

Last updated: 2026-04-30

This is the clean handover index for the current sandbox restoration and refactor session. The old repo handover set is intentionally not restored because the user asked for a simpler handover.

## Latest Update: Rate Memory Feature Complete ✅

The self-learning rate memory feature has been fully implemented with visual feedback, smart exclusions (stage costs and materials), and automatic application to new parametric BoQ items. See `handover/current/05-done-and-remaining.md` for full details.

## Read These Files

- `handover/current/01-status.md` - current source sync and build status.
- `handover/current/02-restored-files.md` - restored app files by area.
- `handover/current/03-validation.md` - implemented estimator features and gaps.
- `handover/current/04-next-steps.md` - recommended next work blocks.
- `handover/current/05-done-and-remaining.md` - clear checklist of completed work and remaining work.

## Source Of Truth

Repo: https://github.com/hersvami/segal-build-app-initialization

Branch: main

## Current Build Status

Status: passing after the latest implementation block. Re-run `build_project` after every implementation block.

## Standing Rules

- Exclude `package-lock.json`, `node_modules`, `dist`, `.env`, `.env.local`, and `.DS_Store`.
- Do not claim exact parity unless every expected non-excluded file is present and content-verified.
- Keep source files small enough for future AI sessions to fetch safely.
- Keep this handover split into small files to avoid future truncation.