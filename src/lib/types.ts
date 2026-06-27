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
  author: string;
  reviewer: string;
  lastUpdated: string;
  readingTime: string;
  references: string[];
  body: string;
};

export type NutritionInfo = {
  servingSize: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
};

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
  tags: string[];
  prepTime: string;
  cookTime: string;
  cost: string;
  image: string;
  nutrition: NutritionInfo;
};
