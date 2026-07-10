import type { DietPlan, Recipe } from "./types";

/**
 * Normalize free-text meal labels for comparison:
 * "Besan cheela" → "besan cheela", "Peanut-butter oats!" → "peanut butter oats"
 */
export function normalizeMealLabel(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Common diet-plan phrasing → recipe slug.
 * Keep keys normalized (lowercase, single spaces).
 */
const MEAL_ITEM_ALIASES: Record<string, string> = {
  // Breakfast / griddle
  "besan chilla": "besan-chilla",
  "besan cheela": "besan-chilla",
  "moong dal chilla": "besan-chilla",
  "peanut butter oats": "peanut-butter-oats",
  "oats": "peanut-butter-oats",
  "poha": "vegetable-poha",
  "vegetable poha": "vegetable-poha",
  "upma": "savory-rava-upma",
  "rava upma": "savory-rava-upma",
  "chia pudding": "overnight-chia-pudding",
  "overnight chia pudding": "overnight-chia-pudding",
  "chia or peanuts": "overnight-chia-pudding",

  // Mains
  "dal": "simple-dal-tadka",
  "simple dal": "simple-dal-tadka",
  "dal tadka": "simple-dal-tadka",
  "moong dal soup": "simple-dal-tadka",
  "masoor dal": "simple-dal-tadka",
  "toor dal": "simple-dal-tadka",
  "khichdi": "moong-khichdi",
  "moong khichdi": "moong-khichdi",
  "rajma": "rajma-rice-bowl",
  "rajma rice": "rajma-rice-bowl",
  "rajma chawal": "rajma-rice-bowl",

  // Tofu / protein plates
  "tofu": "masala-tofu-scramble",
  "tofu sabzi": "masala-tofu-scramble",
  "tofu bhurji": "masala-tofu-scramble",
  "tofu scramble": "masala-tofu-scramble",
  "masala tofu scramble": "masala-tofu-scramble",
  "tofu tikka": "masala-tofu-scramble",
  "tofu curry": "masala-tofu-scramble",
  "tofu poriyal": "masala-tofu-scramble",
  "tofu wrap": "tofu-veggie-wrap",

  // Snacks
  "sprouts chaat": "sprouts-chaat",
  "sprouts sundal": "sprouts-chaat",
  "sprouts": "sprouts-chaat",
  "roasted chana": "roasted-chana-trail-mix",
  "roasted chana trail mix": "roasted-chana-trail-mix",
  "peanuts": "masala-peanuts",
  "roasted peanuts": "masala-peanuts",
  "masala peanuts": "masala-peanuts",
  "makhana": "masala-makhana",
  "masala makhana": "masala-makhana",
  "salad": "chickpea-salad",
  "chickpea salad": "chickpea-salad",
  "chana salad": "chickpea-salad",

  // Veg sides
  "cabbage sabzi": "jain-cabbage-peas",
  "cabbage and peas": "jain-cabbage-peas",
  "vegetable sabzi": "jain-cabbage-peas",
  "vegetables": "jain-cabbage-peas",

  // Sweets / extras
  "kheer": "plant-milk-kheer",
  "rice kheer": "plant-milk-kheer",
  "coconut ladoo": "coconut-ladoo",
  "ladoo": "coconut-ladoo",
  "thandai": "thandai-smoothie",
  "nice cream": "banana-nice-cream",
  "energy bites": "date-nut-energy-bites",
};

function slugToLabel(slug: string): string {
  return normalizeMealLabel(slug.replace(/-/g, " "));
}

/**
 * Resolve a diet-plan meal item string to a recipe slug, if we have one.
 */
export function findRecipeSlugForMealItem(
  item: string,
  recipes: Pick<Recipe, "slug" | "title">[]
): string | undefined {
  const key = normalizeMealLabel(item);
  if (!key) return undefined;

  const bySlug = new Map(recipes.map((r) => [r.slug, r]));

  const aliasSlug = MEAL_ITEM_ALIASES[key];
  if (aliasSlug && bySlug.has(aliasSlug)) return aliasSlug;

  // Exact title / slug-label match
  for (const recipe of recipes) {
    if (normalizeMealLabel(recipe.title) === key) return recipe.slug;
    if (slugToLabel(recipe.slug) === key) return recipe.slug;
  }

  // Single short tokens (rice, roti, fruit) are too generic for fuzzy match —
  // they only link via aliases or exact title/slug above.
  const itemTokens = key.split(" ").filter(Boolean);
  if (itemTokens.length === 1 && key.length < 8) {
    return undefined;
  }

  // Prefer longer, more specific title containment / multi-token overlap
  const ranked = [...recipes]
    .map((recipe) => {
      const title = normalizeMealLabel(recipe.title);
      const slugLabel = slugToLabel(recipe.slug);
      let score = 0;

      // Item contains full recipe name (e.g. "Peanut butter oats bowl")
      if (title.length >= 6 && key.includes(title)) score = Math.max(score, 20 + title.length);
      if (slugLabel.length >= 6 && key.includes(slugLabel)) score = Math.max(score, 18 + slugLabel.length);

      // Recipe title contains the full item only when the item is multi-word
      if (itemTokens.length >= 2 && title.includes(key)) score = Math.max(score, 16 + key.length);

      const significantItem = new Set(itemTokens.filter((t) => t.length > 2));
      const titleTokens = title.split(" ").filter((t) => t.length > 2);
      const overlap = titleTokens.filter((t) => significantItem.has(t)).length;
      if (overlap >= 2) score = Math.max(score, overlap * 5 + title.length / 10);

      return { slug: recipe.slug, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked[0] && ranked[0].score >= 12) return ranked[0].slug;
  return undefined;
}

export function buildMealItemRecipeMap(
  items: string[],
  recipes: Pick<Recipe, "slug" | "title">[]
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const item of items) {
    const slug = findRecipeSlugForMealItem(item, recipes);
    if (slug) map[item] = slug;
  }
  return map;
}

/** Diet plans that mention this recipe via a resolvable meal item. */
export function findDietPlansForRecipe(
  recipeSlug: string,
  plans: DietPlan[],
  recipes: Pick<Recipe, "slug" | "title">[]
): DietPlan[] {
  return plans.filter((plan) =>
    plan.meals.some((meal) =>
      meal.items.some((item) => findRecipeSlugForMealItem(item, recipes) === recipeSlug)
    )
  );
}
