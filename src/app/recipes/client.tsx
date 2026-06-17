"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Recipe } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function RecipesClient({ recipes, allTags }: { recipes: Recipe[]; allTags: string[] }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filter and sort recipes
  const filteredRecipes = recipes
    .map((recipe) => {
      if (selectedTags.length === 0) return { ...recipe, score: 1 }; // Default score when no tags selected

      const score = recipe.tags.filter((tag) => selectedTags.includes(tag)).length;
      return { ...recipe, score };
    })
    .filter((recipe) => recipe.score > 0)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <div className="w-full md:w-64 flex-shrink-0">
        <h2 className="mb-4 text-lg font-semibold">Filter by Tags</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
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

      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredRecipes.length} {filteredRecipes.length === 1 ? "recipe" : "recipes"}
          </p>
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className="group relative flex flex-col overflow-hidden rounded-xl border bg-background shadow-sm transition-all hover:shadow-md">
                <div className="aspect-[4/3] w-full bg-muted relative">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
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
                      {recipe.nutrition.calories} kcal · {recipe.nutrition.protein} protein
                    </p>
                  </div>
                  <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
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
              Try adjusting your selected tags.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
