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
  brand: string;
  category: string;
  status: Status;
  confidence: Confidence;
  ingredients: string[];
  ingredientsOfConcern: string[];
  notes: string;
  verificationSource: string;
  lastReviewed: string;
};

export type Supplement = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  status: Status;
  confidence: Confidence;
  form: string;
  dose: string;
  thirdPartyTested: "Yes" | "No" | "Unknown";
  heavyMetalReport: "Available" | "Not available";
  costPerServing: string;
  notes: string;
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
  ingredients: string[];
  instructions: string[];
  tags: string[];
  prepTime: string;
  cookTime: string;
  cost: string;
  image: string;
  nutrition: NutritionInfo;
};
