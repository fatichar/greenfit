import { getRecipes } from "@/lib/data";
import { getAvailableRecipeFilterLabels } from "@/lib/recipe-filters";
import { RecipesClient } from "./client";

export const metadata = {
  title: "Recipes",
  description: "Easy and frugal plant-based recipes.",
};

export default function RecipesPage() {
  const recipes = getRecipes();
  const filterTags = getAvailableRecipeFilterLabels(recipes.flatMap((recipe) => recipe.tags));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Recipes</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Easy, affordable plant-based recipes for breakfast, snacks, travel, tea time, cravings,
          and festivals — tagged for search and ready for day-plan building.
        </p>
      </div>

      <RecipesClient recipes={recipes} filterTags={filterTags} />
    </div>
  );
}
