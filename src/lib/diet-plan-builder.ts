import type {
  DietBuilderGoal,
  DietBuilderInputs,
  DietBuilderTargets,
  MealType,
  Recipe,
  SelectedPlanItem,
  ServingMode,
} from "./types";

export const DIET_BUILDER_STORAGE_KEY = "greenfit:diet-plan-builder:v1";

export const MEAL_SLOTS: Array<{ id: MealType; label: string; icon: string; helper: string }> = [
  { id: "pre-workout", label: "Pre-workout", icon: "◒", helper: "Light fuel before training" },
  { id: "post-workout", label: "Post-workout", icon: "◓", helper: "Recovery-focused option" },
  { id: "breakfast", label: "Breakfast", icon: "◉", helper: "Start your day well" },
  { id: "brunch", label: "Brunch", icon: "◌", helper: "A flexible mid-morning meal" },
  { id: "lunch", label: "Lunch", icon: "◍", helper: "Your main midday meal" },
  { id: "evening-snack", label: "Evening snack", icon: "◒", helper: "A simple bridge to dinner" },
  { id: "dinner", label: "Dinner", icon: "◉", helper: "A satisfying final meal" },
];

export const DEFAULT_INPUTS: DietBuilderInputs = {
  heightCm: 170,
  weightKg: 70,
  gender: "other",
  age: 30,
  goal: "maintain",
  targetWeightKg: null,
  durationWeeks: null,
  diet: "plant-based",
  allergies: "",
  dislikes: "",
  workout: false,
  workoutTime: "",
  dailyBudgetInr: 250,
};

export const DEFAULT_TARGETS: DietBuilderTargets = { calories: 2200, protein: 70, fiber: 31 };

export function calculateSuggestedTargets(inputs: DietBuilderInputs): DietBuilderTargets {
  const genderAdjustment = inputs.gender === "male" ? 5 : inputs.gender === "female" ? -161 : -78;
  const bmr = 10 * inputs.weightKg + 6.25 * inputs.heightCm - 5 * inputs.age + genderAdjustment;
  const activity = inputs.workout ? 1.45 : 1.2;
  const goalAdjustment: Record<DietBuilderGoal, number> = { lose: 0.85, maintain: 1, gain: 1.1, fitness: 1.03, muscle: 1.12 };
  const calories = Math.round(Math.min(4000, Math.max(1400, bmr * activity * goalAdjustment[inputs.goal])) / 50) * 50;
  const proteinMultiplier: Record<DietBuilderGoal, number> = { lose: 1.2, maintain: 1, gain: 1.3, fitness: 1.25, muscle: 1.5 };
  const protein = Math.round(Math.max(55, inputs.weightKg * proteinMultiplier[inputs.goal]) / 5) * 5;
  const fiber = Math.round(Math.max(25, (calories / 1000) * 14));
  return { calories, protein, fiber };
}

export function parseTerms(value: string): string[] {
  return value.split(",").map((term) => term.trim().toLowerCase()).filter(Boolean);
}

function recipeText(recipe: Recipe) {
  return [recipe.title, recipe.description, ...recipe.ingredients, ...recipe.tags].join(" ").toLowerCase();
}

export function recipeFitsPreferences(recipe: Recipe, inputs: DietBuilderInputs) {
  const text = recipeText(recipe);
  const terms = [...parseTerms(inputs.allergies), ...parseTerms(inputs.dislikes)];
  return recipe.dietary.includes("plant-based") && !terms.some((term) => text.includes(term));
}

export function mealTypeMatches(recipe: Recipe, mealType: MealType) {
  if (recipe.mealTypes.includes(mealType)) return true;
  if (mealType === "brunch") return recipe.mealTypes.some((type) => ["breakfast", "lunch", "tea-time"].includes(type));
  if (mealType === "pre-workout") return recipe.mealTypes.some((type) => ["breakfast", "evening-snack", "tea-time", "travel-snack"].includes(type));
  if (mealType === "post-workout") return recipe.mealTypes.some((type) => ["breakfast", "lunch", "evening-snack", "travel-snack"].includes(type));
  return false;
}

export function getMealSuggestions(mealType: MealType, recipes: Recipe[], inputs: DietBuilderInputs): Recipe[] {
  const matches = recipes.filter((recipe) => recipeFitsPreferences(recipe, inputs) && mealTypeMatches(recipe, mealType));
  const affordable = matches.filter((recipe) => (recipe.costInr ?? 0) <= inputs.dailyBudgetInr);
  return [...(affordable.length ? affordable : matches)]
    .toSorted((a, b) => (a.costInr ?? 0) - (b.costInr ?? 0) || b.nutrition.proteinG - a.nutrition.proteinG)
    .slice(0, 6);
}

export function metricServingLabel(recipe: Recipe): string {
  const source = recipe.nutrition.servingSize.toLowerCase();
  if (/\d+\s*g/.test(source) || /\d+\s*ml/.test(source)) return recipe.nutrition.servingSize;
  if (source.includes("glass") || source.includes("smoothie")) return "Approx. 250 ml";
  if (source.includes("bowl") || source.includes("plate") || source.includes("wrap")) return "Approx. 200 g";
  if (source.includes("sandwich")) return "Approx. 120 g";
  if (source.includes("ladoo") || source.includes("bite")) return "Approx. 35 g";
  if (source.includes("chilla")) return "Approx. 150 g";
  return "Approx. 100 g";
}

export function servingLabel(recipe: Recipe, mode: ServingMode, multiplier = 1): string {
  const label = mode === "metric" ? metricServingLabel(recipe) : recipe.nutrition.servingSize;
  return multiplier === 1 ? label : `${label} × ${multiplier.toFixed(1)}`;
}

export function scaleRecipeNutrition(recipe: Recipe, multiplier: number) {
  return {
    calories: Math.round(recipe.nutrition.calories * multiplier),
    protein: Math.round(recipe.nutrition.proteinG * multiplier * 10) / 10,
    fiber: Math.round(recipe.nutrition.fiberG * multiplier * 10) / 10,
    costInr: Math.round((recipe.costInr ?? 0) * multiplier),
  };
}

export function calculateTotals(selections: Record<string, SelectedPlanItem[]>, recipes: Recipe[]) {
  return Object.values(selections).flat().reduce(
    (total, item) => {
      const recipe = recipes.find((candidate) => candidate.slug === item.recipeSlug);
      if (!recipe) return total;
      const nutrition = scaleRecipeNutrition(recipe, item.portionMultiplier);
      return { calories: total.calories + nutrition.calories, protein: total.protein + nutrition.protein, fiber: total.fiber + nutrition.fiber, costInr: total.costInr + nutrition.costInr };
    },
    { calories: 0, protein: 0, fiber: 0, costInr: 0 },
  );
}

export function targetRatio(value: number, target: number) {
  return target ? Math.round((value / target) * 100) : 0;
}

export function targetWarning(totals: ReturnType<typeof calculateTotals>, targets: DietBuilderTargets) {
  const ratios = [totals.calories / targets.calories, totals.protein / targets.protein, totals.fiber / targets.fiber];
  return { hasWarning: ratios.some((ratio) => ratio < 0.9 || ratio > 1.1), ratios };
}

export function portionGuidance(totals: ReturnType<typeof calculateTotals>, targets: DietBuilderTargets) {
  const calorieRatio = totals.calories / targets.calories;
  const proteinRatio = totals.protein / targets.protein;
  const fiberRatio = totals.fiber / targets.fiber;
  if (!totals.calories && !totals.protein && !totals.fiber) return null;
  if (calorieRatio < 0.9 && proteinRatio >= 0.9 && fiberRatio >= 0.9) return "Your balance is close, but total calories are low. Increase the portion of a main meal or add a second serving.";
  if (calorieRatio > 1.1 && proteinRatio >= 0.9 && fiberRatio >= 0.9) return "Your balance is close, but total calories are high. Reduce an energy-dense portion such as nuts, oil, or nut butter.";
  if (proteinRatio < 0.9) return "Protein is below target. Increase the portion of tofu, dal, soy, or another protein-rich option.";
  if (fiberRatio < 0.9) return "Fiber is below target. Increase a pulse, vegetable, fruit, or whole-grain portion.";
  return null;
}

export function generateWeekVariations(master: Record<string, SelectedPlanItem[]>, recipes: Recipe[], inputs: DietBuilderInputs) {
  return Array.from({ length: 7 }, (_, dayIndex) => {
    const selections: Record<string, SelectedPlanItem[]> = {};
    Object.entries(master).forEach(([mealType, items]) => {
      selections[mealType] = items.map((item, itemIndex) => {
        const options = getMealSuggestions(item.mealType, recipes, inputs);
        const replacement = options[(dayIndex + itemIndex + 1) % Math.max(1, options.length)];
        return { ...item, id: `${dayIndex}-${mealType}-${itemIndex}`, recipeSlug: replacement?.slug ?? item.recipeSlug };
      });
    });
    return { day: dayIndex, selections };
  });
}

export function safeLoadBuilderState<T>(fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(DIET_BUILDER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
