"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { MealType, Recipe } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  brunch: "Brunch",
  lunch: "Lunch",
  dinner: "Dinner",
  "pre-workout": "Pre-workout",
  "post-workout": "Post-workout",
  "evening-snack": "Evening snack",
  "travel-snack": "Travel snack",
  "tea-time": "Tea time",
  craving: "Craving",
  festival: "Festival",
};

const MEAL_TYPE_ORDER: MealType[] = [
  "breakfast",
  "brunch",
  "lunch",
  "dinner",
  "pre-workout",
  "post-workout",
  "evening-snack",
  "tea-time",
  "travel-snack",
  "craving",
  "festival",
];

function formatGrams(g: number) {
  return `${g} g`;
}

function recipeMatchesQuery(recipe: Recipe, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    recipe.title,
    recipe.description,
    ...recipe.tags,
    ...recipe.mealTypes,
    ...recipe.dietary,
    ...recipe.proteinSources,
    ...recipe.ingredients,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function RecipesClient({
  recipes,
  allTags,
}: {
  recipes: Recipe[];
  allTags: string[];
}) {
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const availableMealTypes = useMemo(() => {
    const present = new Set(recipes.flatMap((r) => r.mealTypes));
    return MEAL_TYPE_ORDER.filter((m) => present.has(m));
  }, [recipes]);

  const toggleMealType = (mealType: MealType) => {
    setSelectedMealTypes((prev) =>
      prev.includes(mealType) ? prev.filter((m) => m !== mealType) : [...prev, mealType]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredRecipes = recipes
    .map((recipe) => {
      if (!recipeMatchesQuery(recipe, query)) {
        return { ...recipe, score: 0 };
      }

      if (selectedMealTypes.length > 0) {
        const mealHit = recipe.mealTypes.some((m) => selectedMealTypes.includes(m));
        if (!mealHit) return { ...recipe, score: 0 };
      }

      if (selectedTags.length === 0) {
        return { ...recipe, score: 1 };
      }

      const score = recipe.tags.filter((tag) => selectedTags.includes(tag)).length;
      return { ...recipe, score };
    })
    .filter((recipe) => recipe.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const hasFilters =
    selectedTags.length > 0 || selectedMealTypes.length > 0 || query.trim().length > 0;

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <div className="w-full md:w-64 flex-shrink-0 space-y-8">
        <div>
          <h2 className="mb-3 text-lg font-semibold">Search</h2>
          <Input
            type="search"
            placeholder="Ingredient, tag, protein…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search recipes"
          />
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Meal type</h2>
          <div className="flex flex-wrap gap-2">
            {availableMealTypes.map((mealType) => {
              const isSelected = selectedMealTypes.includes(mealType);
              return (
                <button
                  key={mealType}
                  type="button"
                  onClick={() => toggleMealType(mealType)}
                  className={cn(
                    "inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    isSelected
                      ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
                      : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {MEAL_TYPE_LABELS[mealType]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    isSelected
                      ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
                      : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredRecipes.length}{" "}
            {filteredRecipes.length === 1 ? "recipe" : "recipes"}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSelectedTags([]);
                setSelectedMealTypes([]);
                setQuery("");
              }}
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe, index) => (
              <Link
                key={recipe.slug}
                href={`/recipes/${recipe.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border bg-background shadow-sm transition-all hover:shadow-md"
              >
                <div className="aspect-[4/3] w-full bg-muted relative">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    loading={index < 3 ? "eager" : "lazy"}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-lg font-bold transition-colors group-hover:text-primary">
                    {recipe.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {recipe.description}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <p className="rounded-lg bg-muted/70 px-2 py-1 font-medium text-foreground">
                      {recipe.cost}
                    </p>
                    <p className="rounded-lg bg-primary/10 px-2 py-1 font-medium text-primary">
                      {recipe.nutrition.calories} kcal · {formatGrams(recipe.nutrition.proteinG)}{" "}
                      protein
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {recipe.mealTypes.slice(0, 2).map((mealType) => (
                      <Badge key={mealType} variant="outline" className="text-xs capitalize">
                        {MEAL_TYPE_LABELS[mealType]}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {recipe.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{recipe.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed text-center">
            <h3 className="text-lg font-semibold">No recipes found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search or clear your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
