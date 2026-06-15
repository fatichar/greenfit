import fs from "fs";
import path from "path";
import type { Recipe } from "@/lib/types";
import { RecipesClient } from "./client";

export const metadata = {
  title: "Recipes",
  description: "Easy and frugal plant-based recipes.",
};

function getRecipes(): Recipe[] {
  const recipesDir = path.join(process.cwd(), "data", "recipes");
  const fileNames = fs.readdirSync(recipesDir);
  return fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => {
      const fullPath = path.join(recipesDir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      return JSON.parse(fileContents) as Recipe;
    });
}

export default function RecipesPage() {
  const recipes = getRecipes();

  // Extract unique tags
  const allTags = Array.from(new Set(recipes.flatMap((recipe) => recipe.tags))).sort();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Recipes</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Easy, affordable, and nutritious plant-based recipes with readily available ingredients.
        </p>
      </div>

      <RecipesClient recipes={recipes} allTags={allTags} />
    </div>
  );
}
