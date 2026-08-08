/**
 * High-importance recipe filter chips shown on /recipes.
 * Keep this short. Meal type already covers breakfast/lunch/dinner/snacks.
 * `match` can include aliases so one chip covers similar tags in recipe data.
 */
export const recipeFilterGroups = [
  { label: "WFPB", match: ["WFPB"] },
  { label: "High protein", match: ["high-protein", "protein"] },
  { label: "High fiber", match: ["high fiber"] },
  { label: "Easy", match: ["easy", "quick"] },
  { label: "No-cook", match: ["no-cook"] },
  { label: "Make-ahead", match: ["make-ahead", "meal-prep", "batch-cook"] },
  { label: "Gluten-free", match: ["gluten-free"] },
  { label: "Jain", match: ["Jain", "no-onion-no-garlic"] },
  { label: "Budget", match: ["budget", "frugal"] },
  { label: "North Indian", match: ["North Indian"] },
  { label: "South Indian", match: ["South Indian"] },
] as const;

export type RecipeFilterLabel = (typeof recipeFilterGroups)[number]["label"];

export function getAvailableRecipeFilterLabels(recipeTags: Iterable<string>): RecipeFilterLabel[] {
  const present = new Set(recipeTags);
  return recipeFilterGroups
    .filter((group) => group.match.some((tag) => present.has(tag)))
    .map((group) => group.label);
}

export function recipeMatchesFilterLabels(recipeTags: string[], selectedLabels: string[]): boolean {
  if (selectedLabels.length === 0) return true;

  return selectedLabels.some((label) => {
    const group = recipeFilterGroups.find((item) => item.label === label);
    if (!group) return false;
    return group.match.some((tag) => recipeTags.includes(tag));
  });
}

/** Count how many selected filter groups a recipe matches (for ranking). */
export function recipeFilterScore(recipeTags: string[], selectedLabels: string[]): number {
  if (selectedLabels.length === 0) return 1;

  return selectedLabels.reduce((score, label) => {
    const group = recipeFilterGroups.find((item) => item.label === label);
    if (!group) return score;
    return group.match.some((tag) => recipeTags.includes(tag)) ? score + 1 : score;
  }, 0);
}
