export type Status =
  | "Suitable"
  | "Likely suitable"
  | "Unclear"
  | "Likely unsuitable"
  | "Unsuitable";

export type Confidence = "High" | "Medium" | "Low";

export type Product = {
  slug: string;
  name: string;
  category: string;
  bestFor: string;
  serving: string;
  nutrition: string;
  ingredients: string[];
  recipes: string[];
  popularBrands: string[];
  buyingTips: string;
  notes: string;
  lastReviewed: string;
};

export type Supplement = {
  slug: string;
  name: string;
  category: string;
  form: string;
  dose: string;
  whenToTake: string;
  toxicity: string;
  popularBrands: string[];
  testingNotes: string;
  notes: string;
  relatedGuide: string | null;
  lastReviewed: string;
};

export type DietMeal = {
  name: string;
  items: string[];
  protein: number;
};

export type DietPlan = {
  slug: string;
  title: string;
  goal: string;
  calories: number;
  protein: number;
  difficulty: string;
  cuisineStyle: string;
  mealCount: number;
  affordability: string;
  whoThisIsFor: string;
  meals: DietMeal[];
  proteinSources: string[];
  substitutions: string[];
  explanation?: string[];
  detailSections?: Array<{
    title: string;
    items: string[];
  }>;
  notes: string;
};

export type Food = {
  name: string;
  category: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  notes: string;
};

export type Ingredient = {
  name: string;
  category: string;
  concern: string;
  defaultStatus: Status;
  notes: string;
};

export type Guide = {
  slug: string;
  title: string;
  summary: string;
  priority: number;
  author: string;
  reviewer: string;
  lastUpdated: string;
  readingTime: string;
  references: string[];
  body: string;
};

/**
 * Nutrition per single serving. Numeric grams support diet-plan math;
 * UI formats them as display strings.
 */
export type NutritionInfo = {
  servingSize: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
};

/** Meal slots a recipe can fill in a day plan / picker. */
export type MealType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "evening-snack"
  | "travel-snack"
  | "tea-time"
  | "craving"
  | "festival";

export type Recipe = {
  slug: string;
  title: string;
  description: string;
  explanation?: string[];
  ingredients: string[];
  instructions: string[];
  stepNotes?: string[];
  variationSections?: Array<{
    title: string;
    items: string[];
  }>;
  /** Free-form searchable tags (cuisine, diet style, goals, texture, etc.). */
  tags: string[];
  /**
   * Structured meal slots for "build my diet plan" pickers.
   * A recipe may fit more than one slot (e.g. salad as lunch + evening-snack).
   */
  mealTypes: MealType[];
  /** Number of servings the ingredients list makes. */
  servings: number;
  prepTime: string;
  cookTime: string;
  /** Minutes for sorting/filtering in a plan builder. */
  prepMinutes: number;
  cookMinutes: number;
  cost: string;
  /** Approximate cost in INR for the whole batch (ingredients as listed). */
  costInr?: number;
  image: string;
  nutrition: NutritionInfo;
  /**
   * Dietary flags for plan filters (e.g. jain, no-onion-no-garlic,
   * gluten-free, nut-free, soy-free, oil-free).
   */
  dietary: string[];
  /** Main protein-contributing foods for plan matching. */
  proteinSources: string[];
  /** Safe to pack for travel / desk without reheating. */
  portable: boolean;
  /** Can be prepped ahead and stored. */
  makeAhead: boolean;
};
