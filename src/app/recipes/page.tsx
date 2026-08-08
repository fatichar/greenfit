import { getRecipes } from "@/lib/data";
import { getAvailableRecipeFilterLabels } from "@/lib/recipe-filters";
import { RecipesClient } from "./client";

export const metadata = {
  title: "Recipes",
  description: "Affordable plant-based recipes for everyday meals, snacks, and celebrations.",
};

export default function RecipesPage() {
  const recipes = getRecipes();
  const filterTags = getAvailableRecipeFilterLabels(recipes.flatMap((recipe) => recipe.tags));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Recipes</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Affordable plant-based recipes for breakfasts, snacks, travel, tea time, cravings, and festivals. Search by
          ingredient or meal type, then add ideas to a day plan.
        </p>
      </div>

      <RecipesClient recipes={recipes} filterTags={filterTags} />
    </div>
  );
}
