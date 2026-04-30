# Segal Build - Variation Builder Handover

## Project Overview
A React-based variation builder for construction estimating, allowing users to create, price, and manage variation orders with trade-specific templates, baseline dimensions, and intelligent rate memory.

## Key Features Implemented

### 1. Baseline Dimensions
- Users define building length, width, and height in the "Baseline" step.
- These dimensions automatically calculate quantities (Area, Volume, Perimeter) for all subsequent trade scopes.
- **Fallback Logic**: If no baseline is set, the system defaults to 10m² to prevent $0 estimates.

### 2. Trade Scope Templates
- Pre-configured templates for major trades (Demolition, Concrete, Masonry, etc.).
- Templates include standard BoQ items with default rates and units.
- Users can add/remove items and adjust quantities per project.

### 3. Rate Memory System (NEW)
- **Purpose**: Remembers custom unit rates entered by users across sessions.
- **How it works**:
  - When a user manually changes a unit rate (e.g., Concrete from $150 to $165/m²), the new rate is saved to `localStorage`.
  - When adding the same trade item in future variations, the saved rate is automatically applied.
  - Visual indicators (green highlight + 💾 icon) show when a saved rate is being used.
- **Scope**: Applies only to parametric (unit-based) items, not lump-sum stage allowances.
- **Persistence**: Data stored in browser `localStorage` under key `segal_build_rate_memory`.

### 4. Pricing & Overrides
- **Stage Allowance**: Users can override the total calculated cost for a trade with a lump sum.
- **Unit Rate Override**: Users can adjust individual item rates; these are tracked and saved.
- **Visual Feedback**: 
  - Green borders/backgrounds indicate saved rates.
  - "Manual Override" badges appear when stage totals are overridden.

### 5. Document Management
- Users can attach plans, specs, and photos to each variation.
- Supports drag-and-drop upload and preview.

## Technical Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: React Context + useReducer
- **Storage**: localStorage (for rate memory and draft variations)
- **Build Tool**: Vite
- **Deployment**: GitHub Pages / Netlify ready

## File Structure

src/
├── components/
│   └── variationBuilder/
│       ├── BaselineStep.tsx
│       ├── ScopeSelectionStep.tsx
│       ├── PricingStep.tsx       # [KEY] Rate memory save logic & visual feedback
│       ├── ParametricEditor.tsx  # [KEY] Item addition with rate recall
│       └── SummaryStep.tsx
├── utils/
│   ├── rateMemory.ts             # [CORE] Utility: save/load/apply rates from localStorage
│   ├── createScopeFromCategory.ts# [CORE] Scope creation with 10m² fallback logic
│   ├── tradeTemplates.ts         # Default trade data
│   └── formatters.ts
├── types/index.ts                # TypeScript interfaces
└── data/tradeCategories.ts       # Master list of trade items


### Critical Implementation Details

#### 1. Rate Memory Logic (`src/utils/rateMemory.ts`)
- Uses `localStorage` to persist a map of `{ categoryId: rate }`.
- Exports `saveRateOverride`, `getRememberedRate`, and `applyRememberedRates`.

#### 2. Visual Feedback (`src/components/variationBuilder/PricingStep.tsx`)
- Checks `item.isRateOverridden` flag.
- Applies Tailwind classes: `border-green-500 bg-green-50 text-green-700 font-bold`.
- Displays "💾 Saved" indicator.

#### 3. Zero-Cost Fix (`src/utils/createScopeFromCategory.ts`)
- Calculates area: `length * width`.
- **Fallback**: If result is 0, uses `10` (10m²) to ensure costs are never zero.
- Injects remembered rates during scope initialization.

---

## Testing Guide

### ✅ Test Case 1: Rate Memory (Save & Recall)
1. Go to **Baseline Step**: Enter 10m x 10m.
2. Go to **Scope Selection**: Add "Demolition".
3. Go to **Pricing Step**:
   - Find "Skip Bin Hire".
   - Change rate to **$999**.
   - **Verify**: Input turns **Green** and shows **💾**.
4. **Refresh Page** (or start a new variation).
5. Add "Demolition" again.
6. **Verify**: "Skip Bin Hire" automatically shows **$999** and is **Green**.

### ✅ Test Case 2: Missing Baseline Fallback
1. Start a **New Variation**.
2. **Skip** the Baseline Step (leave dimensions empty).
3. Go to **Scope Selection**: Add "Demolition".
4. Go to **Pricing Step**:
   - **Verify**: Quantity shows **10** (not 0).
   - **Verify**: Total Cost is **NOT $0**.

### ✅ Test Case 3: Adding New Items Manually
1. In Pricing Step, click **+ Add Item**.
2. Select an item you previously changed (e.g., "Brickwork").
3. **Verify**: The new row appears with your **saved rate** pre-filled.

---

## Known Limitations
- **Material Costs**: Rates are "all-in" (labor + material). Material price volatility is not separately tracked.
- **Browser Scope**: Rate memory is local to the browser/device (`localStorage`). Not synced across devices yet.
- **Currency**: Hardcoded to AUD ($). Multi-currency support not implemented.

---

## Future Roadmap
- [ ] **Cloud Sync**: Move rate memory to Firebase/User Profiles for cross-device access.
- [ ] **Material Split**: Separate Labor vs. Material costs in the data model.
- [ ] **Exports**: PDF/Excel generation for quotes.
- [ ] **Integrations**: Xero/MYOB connectivity.
- [ ] **Collaboration**: Multi-user editing and comments.

---

## Getting Started

### Installation
```bash
npm install
npm run dev

Deployment Checklist
Ensure all changes are committed: git add . && git commit -m "Latest updates"
Push to remote: git push -u origin main
Note: Use Personal Access Token for authentication if required.
Verify build: npm run build
Deploy to hosting (GitHub Pages/Netlify).
Recent Changelog
v1.2.0: Added Rate Memory system with visual feedback.
v1.1.1: Fixed "$0 Demolition" bug by adding 10m² default fallback.
v1.1.0: Integrated rate memory into scope creation factory.
v1.0.0: Initial release with Baseline, Scopes, and Pricing steps.

