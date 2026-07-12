# Recipe Catalog Plan — Complementing “Build My Diet Plan”

## Purpose

GreenFit’s USP is **Build my diet plan**. Recipes are not a standalone cookbook; they are the inventory users pick from when filling meal slots across a day and a week.

This plan reviews the current recipe set against those meal slots, names gaps, and proposes a **first batch of new dishes** with fixed names, meal slots, roles, and dietary eligibility. It prioritizes **complete, everyday Indian meals** with stronger **vegetable and fruit** coverage—not more protein-centric dishes for their own sake.

---

## Meal slots in scope

Primary slots used when building a diet plan:

| Slot | Role |
|------|------|
| Breakfast | Start-of-day meal |
| Brunch | Flexible mid-morning / late breakfast |
| Lunch | Main midday meal |
| Evening snack | Bridge to dinner |
| Dinner | Satisfying final meal |
| Pre-workout | Light fuel before training (when workout is enabled) |
| Post-workout | Recovery option after training (when workout is enabled) |

Related recipe tags also exist on the site (tea-time, travel-snack, craving, festival). They support lifestyle use cases but are secondary to the builder slots above.

### Slot matching (product constraint)

- The **recipe catalog** surfaces a recipe in a meal-type filter only when that type is listed on the recipe (`mealTypes`).
- The **diet plan builder** additionally soft-matches some slots:
  - **Brunch** may also show breakfast, lunch, and tea-time recipes.
  - **Pre-workout** may also show breakfast, evening-snack, tea-time, and travel-snack recipes.
  - **Post-workout** may also show breakfast, lunch, evening-snack, and travel-snack recipes.
- Soft match is **not** a substitute for tagging. Cross-slot items that should appear reliably in lunch, dinner, or evening snack must list those types explicitly.
- Brunch / pre-workout / post-workout tags are still useful when a dish is *primarily* for that use (e.g. a recovery bowl).

### Current builder behavior

- Every recipe records a `role`: main, light main, side, or snack.
- Lunch and dinner suggest mains/light mains first; sides and snacks are shown separately as optional add-ons.
- Seven-day variations preserve the selected recipe's role and draw from up to seven comparable options, so a main cannot rotate into a side.
- The builder still has free-text *allergy* and *dislike* exclusions, not affirmative Jain, soy-free, nut-free, or gluten-free preference filters. Dietary flags remain useful, accurate recipe metadata but are not a promise of automatic builder filtering.

---

## Principles

1. **Complement the plan builder** — For each meal of the day, the catalog should provide enough recipes to build a complete meal and offer meaningful variety across a week.
2. **Prefer complete mains for catalog variety** — A **main** is a single recipe that is a full plate or bowl (e.g. sabzi + roti, dal + rice + veg). Week generation swaps recipes **per selected item** within a slot’s suggestion list; multi-item “thalis” assembled from separate components do **not** stay coherent across days. Therefore this plan prioritizes **complete mains** for lunch/dinner choice, and treats components as optional manual add-ons.
3. **Components are additive, not automatic thalis** — Sides (kachumber, cut fruit) improve the master plan when a user multi-selects them. Success is measured as “more vegetable/fruit **options and complete plates**,” not “the builder constructs coherent multi-item thalis every day of the week.”
4. **Vegetables and fruit are first-class** — Indian seasonal vegetables and fruit should appear as real dishes and sides, not only as garnish in high-protein bowls.
5. **Protein is already covered enough** — Existing dal, chana, rajma, tofu, besan, sprouts, and peanut recipes cover protein anchors. New work rebalances toward produce and complete veg-forward plates.
6. **Seasonal fruit as one flexible pattern** — Prefer a seasonal cut-fruit bowl (plus a small set of fruit snacks) over many one-off fruit recipes. Seasonal swaps belong in recipe variations, not as separate approval items.
7. **One canonical name per dish** — No “A or B” approval items. Seasonal or regional swaps go in variations after the recipe exists.
8. **No substantial duplicates of existing recipes** — Do not re-approve “more vegetable” variants of chilla, poha, upma, or khichdi as new first-batch dishes; those can be variation sections on existing recipes later.
9. **Dietary eligibility is explicit** — First-batch dishes declare Jain, no-onion-no-garlic, soy-free, nut-free, and gluten-free support (or lack of it) as accurate recipe metadata. This does not claim automatic filtering in the current builder.
10. **Dish metadata before content** — Full recipe bodies start only after the approval matrix is accepted.

---

## Roles (approval vocabulary)

Roles are stored in the recipe schema and used by the builder to keep mains, sides, and snacks in appropriate suggestion groups.

| Role | Meaning |
|------|---------|
| **Main** | Stands alone as a full meal for that slot (plate/bowl with grain or equivalent satiety). Primary driver of weekly main-meal variety. |
| **Light main** | Can be a small meal alone (e.g. fruit + curd bowl, soup + roti) but is lighter than a full thali-style plate. |
| **Side** | Salad, fruit, or sabzi-style add-on meant to pair with something else. Useful in multi-select; not relied on alone for dinner variety. |
| **Snack** | Portioned for evening snack / tea-time / pre-workout, not as lunch or dinner alone. |

---

## Current catalog summary

There are **22 recipes** today. Rough balance:

- Strong on snacks, tea-time, portable bites, and a few protein-forward bowls.
- Thin on **complete lunch and dinner** rotations.
- Very thin on **Indian vegetable sabzis** (one dedicated sabzi).
- Almost no **fruit as a meal item** (fruit appears mainly inside sweets, oats, or smoothies).

### Breakfast (existing)

- Besan Chilla  
- Masala Tofu Scramble  
- Overnight Chia Pudding  
- Creamy Peanut Butter Oats  
- Savory Rava Upma  
- Vegetable Poha  

**Assessment:** Enough for a basic week. Limited regional and vegetable-heavy variety. Fruit is not a breakfast option by itself.

### Brunch (existing)

No recipes are dedicated to brunch. Users effectively see breakfast, lunch, and tea-time style options via soft matching.

**Assessment:** Usable via fallback; no true brunch plates.

### Lunch (existing)

| Recipe | Role |
|--------|------|
| Rajma Rice Bowl | Main |
| Comfort Moong Khichdi | Main |
| Spiced Tofu Veggie Wrap | Main (portable) |
| Zesty Chickpea Salad | Light main / salad-forward |
| Masala Tofu Scramble | Light main (breakfast-leaning) |
| Sprouts Chaat | Snack / light lunch |
| Simple Dal Tadka | Side / component (needs grain) |
| Jain-Style Cabbage and Peas Subzi | Side |

**Assessment:** About 3–4 solid complete mains. Weak for a full week of non-repetitive lunches. Little classic sabzi + roti/rice structure.

### Dinner (existing)

| Recipe | Role |
|--------|------|
| Rajma Rice Bowl | Main |
| Comfort Moong Khichdi | Main |
| Simple Dal Tadka | Side / component |
| Jain-Style Cabbage and Peas Subzi | Side |

**Assessment:** Weakest core slot. After a few nights, the same two mains dominate. Few veg-forward evening plates.

### Evening snack (existing)

- Banana Nice Cream  
- Besan Chilla  
- Zesty Chickpea Salad  
- Cucumber Mint Tea Sandwich  
- Date-Nut Energy Bites  
- Masala Makhana  
- Crispy Masala Peanuts  
- Overnight Chia Pudding  
- Creamy Peanut Butter Oats  
- Roasted Chana Trail Mix  
- Savory Rava Upma  
- Sprouts Chaat  
- Spiced Tofu Veggie Wrap  

**Assessment:** Strong volume. Skews toward packaged-style snacks and protein bites; few produce-led options.

### Pre-workout / post-workout (existing)

No dedicated recipes. Soft match only.

**Assessment:** Usable but unclear. Prefer a few explicitly tagged light fruit options (pre) and recovery bowls/soups (post), without making protein shakes the default.

### Secondary tags (existing)

Tea-time, travel-snack, craving, and festival coverage is adequate for now and is not the USP priority.

---

## Gap analysis

### 1. Protein skew

Existing recipes lean on legumes, tofu, besan, sprouts, and nuts. Everyday plans also need **volume from vegetables and fruit**.

### 2. Missing Indian vegetables

Common household vegetables barely appear as dishes (lauki, bhindi, baingan, turai, gajar–matar, beans, gobi, kaddu, palak, mixed seasonal sabzi). Only **Jain-style cabbage and peas** is a clear sabzi recipe today.

### 3. Missing fruit as a meal building block

There is no cut fruit bowl, fruit chaat, or plant-curd fruit bowl selectable in plan slots.

### 4. Multi-item thalis vs week generation

Users can multi-select several items in one slot when building a master plan. **Seven-day variation** replaces each selected item independently from that slot’s suggestion pool. A hand-built dal + sabzi + salad + fruit stack can become four unrelated items on later days.

**Product implication for this catalog plan:**

- Ship **complete mains** (veg plate already includes roti/rice/dal as appropriate) so users can choose a balanced plate as one slot item.
- Ship **sides** (kachumber, fruit) for users who want more produce on the master day.
- Do **not** claim that this batch alone delivers “coherent automated thali days” across a generated week.
- Curated meal bundles and role-aware week generation are **out of scope** for this plan (possible later product work).

### 5. Lunch and dinner variety

Lunch and dinner need the most new **mains**. Fruit and light sides are cross-slot support. Pre/post need a small explicit set only if tagged; otherwise soft match plus fruit sides is enough for batch 1.

---

## How fruit should appear

| Role | Explicit `mealTypes` (required) | Dish |
|------|----------------------------------|------|
| Side / finish | breakfast, lunch, dinner, evening-snack | Seasonal Cut Fruit Bowl |
| Snack | evening-snack, tea-time, breakfast | Fruit Chaat |
| Light recovery / breakfast | breakfast, post-workout, evening-snack | Soy Curd Fruit Bowl |

**Seasonal Cut Fruit Bowl** is one recipe with seasonal variation guidance (e.g. summer mango/watermelon/muskmelon; monsoon apple/pear/pomegranate; winter orange/guava/papaya/amla), plus optional chaat masala, lemon, and mint. Optional nuts/seeds are a **variation**, default bowl stays nut-free.

**Soy Curd Fruit Bowl** is the recovery/breakfast path that needs soy. Peanut curd is **not** mixed into the same approval item (that would break soy-free and nut-free filtering). Peanut curd fruit bowl can be a later recipe if needed.

---

## First batch — approval matrix

Fifteen canonical dishes. Each row is one recipe to create after approval.

**Slot columns:** primary first; secondary in parentheses.  
**Dietary:** intended `dietary` flags (all are plant-based). Y = supports as written; N = does not claim support; Var = default is N, recipe variations may describe a compliant swap (not a separate dish). These flags are catalog/recipe metadata; the current builder does not offer affirmative dietary-preference filters.

| # | Dish | mealTypes | Role | Jain | No onion/garlic | Soy-free | Nut-free | Gluten-free |
|---|------|-----------|------|------|-----------------|----------|----------|-------------|
| 1 | Lauki Sabzi with Dal and Rice | lunch, dinner | Main | Y | Y | Y | Y | Y |
| 2 | Bhindi Masala with Roti and Kachumber | lunch, dinner | Main | N | N | Y | Y | N (roti; millet roti Var) |
| 3 | Baingan Bharta with Roti | lunch, dinner | Main | N | N | Y | Y | N (roti; Var) |
| 4 | Gajar Matar Sabzi with Roti | lunch, dinner | Main | N | N | Y | Y | N (roti; Var) |
| 5 | Mixed Seasonal Sabzi Thali | lunch, dinner | Main | Y | Y | Y | Y | Y (rice + sabzi + dal; no wheat) |
| 6 | Palak Dal with Roti | lunch, dinner | Main | N | N | Y | Y | N (roti; Var) |
| 7 | Turai Sabzi with Roti | lunch, dinner | Main | Y | Y | Y | Y | N (roti; Var) |
| 8 | Mixed Vegetable Soup with Roti | dinner, lunch | Main | N | N | Y | Y | N (roti; Var) |
| 9 | Gobi Matar Sabzi with Roti | lunch, dinner | Main | N | N | Y | Y | N (roti; Var) |
| 10 | French Beans Foogath with Rice | lunch, dinner | Main | Y | Y | Y | Y | Y |
| 11 | Seasonal Cut Fruit Bowl | breakfast, lunch, dinner, evening-snack, tea-time | Side | Y | Y | Y | Y | Y |
| 12 | Fruit Chaat | breakfast, evening-snack, tea-time, pre-workout | Snack | Y | Y | Y | Y | Y |
| 13 | Soy Curd Fruit Bowl | breakfast, post-workout, evening-snack | Light main | Y | Y | N | Y | Y |
| 14 | Classic Kachumber Salad | lunch, dinner, evening-snack | Side | N (onion) | N (onion) | Y | Y | Y |
| 15 | Corn Capsicum Chaat | evening-snack, tea-time | Snack | N | N | Y | Y | Y |

### Dinner eligibility (batch 1)

**Ten mains** are dinner-eligible (#1–#10). Together with existing Rajma Rice Bowl and Moong Khichdi, the catalog offers more than a week of distinct dinner mains without relying on sides alone. Generated-week variations preserve the selected role, so a dinner main rotates only among dinner mains.

### Lunch eligibility (batch 1)

The same ten mains are lunch-eligible. Fruit side and kachumber can be multi-selected on the master plan only.

### Cross-slot fruit / produce

| Dish | Why these slots |
|------|-----------------|
| Seasonal Cut Fruit Bowl | Explicit breakfast + lunch + dinner + evening-snack so catalog and builder both show it where a fruit course belongs |
| Fruit Chaat | Snack and pre-workout fuel without pretending to be dinner |
| Soy Curd Fruit Bowl | Breakfast and post-workout recovery; not soy-free |
| Classic Kachumber Salad | Lunch/dinner side and evening snack |
| Corn Capsicum Chaat | Produce-led tea-time or evening snack |

### Dietary coverage summary (batch 1)

| Constraint | Supported by (as written) | Gap / note |
|------------|---------------------------|------------|
| Jain | #1, #5, #7, #10, #11, #12, #13 | Onion-based kachumber and several North Indian sabzis are N; hing-based lauki/turai/thali/foogath cover Jain mains |
| No onion/no garlic | Same as Jain set above | #2–#4, #6, #8–#9, #14–#15 use onion/garlic in standard form |
| Soy-free | All except #13 | Recovery curd path requires soy; fruit bowl covers soy-free fruit course |
| Nut-free | All 15 (default) | Optional nuts on fruit bowl stay in variations only |
| Gluten-free | #1, #5, #10, #11, #12, #13, #14, #15 | Roti plates are N by default; rice/foogath/thali/fruit/salad paths remain for GF users |

The current builder only excludes free-text allergy/dislike terms found in a recipe’s title, description, ingredients, or tags; it does not use the specific dietary flags above as affirmative preferences. Approval names and future ingredient lists must not casually list peanut and soy together on the same “curd” dish.

---

## What this batch deliberately does not include

| Idea | Reason |
|------|--------|
| Vegetable-loaded Besan Chilla / Mixed Vegetable Upma / Light Vegetable Khichdi | Overlaps existing chilla, upma, poha, khichdi; better as variations on existing recipes later |
| “Tinda or Turai”, “Beans or Cluster Beans”, “Palak or Methi”, “Stuffed Capsicum or Tomato” | Multiple recipes disguised as one; canonical pick only (Turai; French beans) |
| Peanut Curd Fruit Bowl | Separate from soy path; deferred so nut-free and soy-free filters stay clean |
| Plant protein shake | Optional later; not the vegetable/fruit priority |
| Curated multi-recipe meal bundles | Out of scope; a user can still add sides manually |

### Deferred dish list (names only, not batch 1)

Useful after batch 1 if still needed:

- Methi Aloo with Salad  
- Drumstick Sambar with Vegetable Side  
- Stuffed Capsicum with Millet  
- Kaddu Sabzi with Dal  
- Vegetable Daliya  
- Peanut Curd Fruit Bowl  
- Cucumber–Carrot–Beet Sticks with Mint Chutney  
- Roasted Sweet Potato Chaat  
- Moong Dal Soup  
- Stewed Apple Cinnamon Bowl  

---

## Priority by meal type

| Priority | Meal type | Gap | Batch 1 direction |
|----------|-----------|-----|-------------------|
| P0 | Dinner | Only ~2 mains | **10** new dinner-eligible mains with role-aware week rotation |
| P0 | Lunch | Only ~3–4 mains | Same mains dual-tagged lunch + dinner |
| P0 | Fruit / veg sides | No fruit course; one sabzi | Cut fruit, fruit chaat, kachumber, corn chaat |
| P1 | Breakfast | Thin fruit | Cut fruit + soy curd fruit bowl |
| P1 | Post-workout | No dedicated set | Soy curd fruit bowl tagged post-workout |
| P2 | Pre-workout | Soft match only | Fruit chaat tagged pre-workout |
| P2 | Brunch | Soft match only | No dedicated brunch dish in batch 1 |
| P3 | Evening snack | Many options, few produce | Fruit + kachumber + corn chaat |
| P3 | Tea / travel / craving / festival | Adequate | No urgent expansion |

---

## Success criteria

After the approved batch exists in the catalog **with the mealTypes and dietary flags in the matrix**:

1. **Dinner:** At least **seven** distinct dinner-eligible **mains** in the first batch (this plan specifies ten), so users have a week of dinner choices beyond Rajma + Khichdi.
2. **Lunch:** The same veg-forward mains appear under lunch in both the recipe browser and the builder.  
3. **Fruit:** Users can select a fruit course at breakfast, lunch, dinner, and evening snack via **Seasonal Cut Fruit Bowl** (explicit tags, not soft match alone).  
4. **Produce-led snacks:** At least three evening-snack options that are fruit or vegetable based (#11, #12, #14, #15).  
5. **Recipe eligibility metadata:** Jain/no-onion-no-garlic, soy-free, nut-free, and gluten-free users can identify marked lunch and dinner paths from recipe metadata. Automatic affirmative filtering for these paths is not part of the current builder.  
6. **Week variations:** A selected main rotates among comparable mains, with up to seven candidates; sides and snacks remain in their own role group. Multi-item stacks remain a manual master-plan choice.
7. **Catalog tone:** Everyday Indian eating—seasonal sabzi and fruit first—while existing protein recipes remain available.

---

## Out of scope for this plan

- Writing full recipe bodies (ingredients, steps, nutrition, images)  
- Engineering changes for curated multi-recipe meal bundles or affirmative dietary-preference filtering
- Reworking existing recipe text or adding “loaded veg” variations to chilla/upma/khichdi  
- Creating recipes before this approval matrix is accepted  

---

## Decision requested

Please review and approve:

1. Vegetable/fruit-first principles, including the **complete-main** approach to weekly variety.  
2. The **first-batch matrix** (15 fixed names, mealTypes, roles, dietary flags).  
3. Explicit non-claims: no automated multi-item thali coherence or affirmative dietary-preference filtering; no duplicate “veggier” versions of existing breakfasts in batch 1.

Recipe creation begins only after this matrix is approved.
