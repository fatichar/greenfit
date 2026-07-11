# Build my diet plan — implementation plan

## Context

GreenFit already has a multi-step **Build my diet plan** wizard at **`/diet-plans/build`** (nav: “Build a plan”). Core pieces exist:

| Area | Location |
|------|----------|
| Route + SSR recipes | `src/app/diet-plans/build/page.tsx` |
| Wizard UI | `src/components/diet-plan-builder.tsx` |
| Targets, suggestions, totals, week gen, storage | `src/lib/diet-plan-builder.ts` |
| Types | `DietBuilderInputs`, `DietBuilderTargets`, `SelectedPlanItem` in `src/lib/types.ts` |
| Recipes (meal slots + numeric nutrition) | `data/recipes/*.json` via `getRecipes()` |
| Print CSS | `src/app/globals.css` (`.print-root`, `.print-hidden`) |

**Already covered (vs product brief):**

- Vitals form → `localStorage` (`greenfit:diet-plan-builder:v1`)
- Height, weight, gender, age, goal presets
- Optional target weight / duration
- Allergies & dislikes
- Suggested calorie / protein / fiber with sliders
- Daily ₹ budget
- Workout yes/no + time of day
- Meal slots (pre/post only if workout)
- Multi-select recipes per slot with portions
- Live totals + progress bars that can show **>100%** (scale to 150%)
- Remove items + portion ±0.5×
- Review with ±10% warning
- 7-day variations
- “Save as PDF” via **browser print dialog** (not a real file download)

**Gaps vs full brief:**

- True guided meal-by-meal flow (blank → one meal at a time → next)
- Real PDF file download
- Richer 7-day day editing (add/remove/swap like master)
- Cost math correctness (`costInr` is batch, not per serving)
- Analytics, sitemap entry, diet-plans index CTA polish

This plan **extends the existing builder** rather than rewriting from scratch.

---

## Product flow (target UX)

```
Details (vitals + budget + workout)
    → Targets (editable cal / protein / fiber sliders)
    → Build meals (guided sequential slots + sticky progress)
    → Review / finalize (warn if off-target)
    → Optional 7-day variations (editable)
    → Download PDF (master and/or week)
```

State persists in browser storage across refresh.

---

## Recommended approach

### 1. Sequential meal-building UX (primary product gap)

**Today:** Accordion lists all meal slots; user can open any.

**Target:** Start blank → suggest next meal type → show options for that type only → when user finishes the slot, advance to the next → easy skip.

**Implementation:**

- Derive **active slot queue** from `MEAL_SLOTS` filtered by `inputs.workout` (hide pre/post when no workout).
- Optionally **reorder** by `workoutTime`:
  - Morning: pre-workout → breakfast → brunch → lunch → evening-snack → dinner → post-workout (or post near training)
  - Evening: breakfast → brunch → lunch → evening-snack → pre-workout → post-workout → dinner
- Build step UI modes:
  - **Guided (default):** single “Now add: Lunch” panel with recipe option cards; actions **Add**, **Skip this meal**, **Done with this meal → next**.
  - **Overview (secondary):** list/accordion so users can jump back and edit earlier meals.
- Sticky summary stays visible with calorie / protein / fiber % (existing `ProgressMetric` already supports overshoot via amber styling and 150% scale).
- Each option card shows **calories, protein g, fiber g** (and approx cost after cost fix) before add.

**Files:** `src/components/diet-plan-builder.tsx` (`BuildStep`), `src/lib/diet-plan-builder.ts` (e.g. `getOrderedMealSlots(inputs)`).

### 2. Finalize + warnings

**Today:** Review step; amber alert if any of cal/protein/fiber outside **0.9–1.1×** targets; Confirm vs Back.

**Tighten:**

- If **within** band: primary CTA **Finalize master plan** (sets `confirmed`).
- If **outside** band: show which macros failed (use `targetWarning.ratios`); require Confirm or Back to edit.
- Empty plan (no meals / all skipped) → block finalize with clear message.
- Reuse `portionGuidance()` for actionable copy.

### 3. Seven-day variations (variety over perfection)

**Today:** `generateWeekVariations` swaps recipes via suggestion rotation; day portion edit + regenerate whole day.

**Improve:**

- Generate with **variety bias**: avoid same recipe slug on consecutive days when alternatives exist; allow daily totals roughly **85–115%** of targets (document as intentional).
- Per day: **edit like master** — change portion, **remove** item, **swap/add** from same meal-type suggestions (not only regenerate whole day).
- Persist `variations` in existing localStorage payload (`DIET_BUILDER_STORAGE_KEY`).

**Files:** `generateWeekVariations` in `src/lib/diet-plan-builder.ts` + `ReviewStep` day editor UI.

### 4. Download as PDF

**Today:** `window.print()` + CSS hide chrome (browser “Save as PDF”).

**Target:** Explicit download of master and/or week.

**Recommended implementation (client-only, no server):**

- Add **`jspdf` + `jspdf-autotable`** (or `@react-pdf/renderer`).
- Prefer **programmatic layout** (tables of meals + macros) over HTML screenshot for reliable multi-day export.
- Export options:
  - Master day only
  - Full 7-day week (if generated)
- Keep print as secondary fallback.

**New helper:** `src/lib/diet-plan-pdf.ts` called from Review step Download buttons.

**Dependency:** add `jspdf` (+ `jspdf-autotable`) to `package.json`.

### 5. Correctness fixes in math / suggestions

| Issue | Fix |
|-------|-----|
| `costInr` is **batch** but scaled like a serving | In `scaleRecipeNutrition`, use `(costInr ?? 0) / Math.max(1, servings) * multiplier` |
| Budget filter uses batch cost | Prefer per-serving cost vs soft daily budget |
| Allergy filter is substring | Keep simple; document “comma-separated keywords” |

Also surface **fiber** consistently on option cards and summary lines.

### 6. Discoverability & polish

- Header already links “Build a plan” → `/diet-plans/build`.
- Add CTA card on `src/app/diet-plans/page.tsx` if missing.
- Sitemap: include `/diet-plans/build` in `src/app/sitemap.ts`.
- Analytics: `trackEvent` on step advance, finalize, week generate, PDF download (`src/lib/analytics.ts`).
- Disclaimer: keep medical disclaimer on details + review.
- Refactor dense one-line JSX in `diet-plan-builder.tsx` when touching Build/Review (readability, no behavior change unless intended).

### 7. Out of scope for this pass

- Saving plans to a backend / user accounts
- Non–plant-based diets
- Building from generic `foods.json` (recipes only)
- Server-side PDF
- Replacing curated static plans on `/diet-plans/[slug]`

---

## Critical files

| Action | Path |
|--------|------|
| Enhance wizard UX | `src/components/diet-plan-builder.tsx` |
| Slot order, week gen, cost scale, suggestions | `src/lib/diet-plan-builder.ts` |
| Types if needed (variation edit ops) | `src/lib/types.ts` |
| **New** PDF export | `src/lib/diet-plan-pdf.ts` |
| Route (exists) | `src/app/diet-plans/build/page.tsx` |
| Sitemap | `src/app/sitemap.ts` |
| Diet plans index CTA | `src/app/diet-plans/page.tsx` |
| Print styles | `src/app/globals.css` |
| Recipe data only if mealTypes sparse | `data/recipes/*.json` |

**Reuse (do not reinvent):**

- `calculateSuggestedTargets`, `getMealSuggestions`, `calculateTotals`, `targetRatio`, `targetWarning`, `portionGuidance`, `safeLoadBuilderState`, `DIET_BUILDER_STORAGE_KEY`
- `ProgressMetric` pattern (bars that show overshoot)
- `Slider`, `Button`, `Card`, `Alert`, `Input`, `Label`
- Recipe fields: `mealTypes`, `nutrition.{calories,proteinG,fiberG}`, `costInr`, `servings`, `dietary`

---

## Implementation sequence

1. **Math fix** — per-serving cost + budget soft-filter.
2. **Guided Build step** — ordered slots, sequential “current meal” panel, skip/done, keep summary + remove.
3. **Review finalize** — empty-plan guard; clearer confirm when off-target.
4. **Week variations** — better variety algorithm + per-day add/remove/swap.
5. **PDF module** + wire Download actions.
6. **Sitemap, analytics, diet-plans CTA**, light refactor.
7. **Manual QA** (below).

---

## Verification

1. Open `/diet-plans/build` with empty localStorage.
2. Enter vitals; confirm target sliders work; refresh restores state.
3. Workout **Yes** + time → pre/post appear and order sensibly; **No** → slots hidden.
4. Guided flow: one meal’s options at a time; skip and next work; multi-add + remove updates totals.
5. Progress bars: force overshoot → % > 100 and amber styling.
6. Review: off-target → warning + back/confirm; finalize → week generate → edit a day.
7. PDF downloads master and week files; openable in a PDF reader.
8. Budget + peanut allergy: peanut-heavy recipes deprioritized/filtered.
9. No console errors; TypeScript/lint clean; usable on mobile.

---

## Success criteria

User can complete **details → targets → guided meal picks → finalize** (with optional soft warning) → optional **7-day variety** (editable) → **download PDF**, with state restored from browser storage, using existing plant-based recipes and honest overshoot-capable progress UI.

---

## Existing code map (quick reference)

### Steps in `DietPlanBuilder`

| Step | Label | Responsibility |
|------|--------|----------------|
| 0 | Your details | Vitals, goal, budget, workout |
| 1 | Targets | Cal / protein / fiber sliders |
| 2 | Build meals | Slot picker + suggestions + summary |
| 3 | Review | Warning, confirm, week, print/PDF |

### Key functions in `src/lib/diet-plan-builder.ts`

- `calculateSuggestedTargets(inputs)` — Mifflin-style BMR + goal multipliers
- `getMealSuggestions(mealType, recipes, inputs)` — plant-based + budget + mealTypes
- `calculateTotals(selections, recipes)` — day totals
- `targetWarning` / `portionGuidance` — finalize feedback
- `generateWeekVariations` — 7 day swaps
- `safeLoadBuilderState` / `DIET_BUILDER_STORAGE_KEY` — persistence

### Meal slots (`MEAL_SLOTS`)

pre-workout, post-workout, breakfast, brunch, lunch, evening-snack, dinner  
(Pre/post gated on `inputs.workout`.)
