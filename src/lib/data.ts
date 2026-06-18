import fs from "node:fs";
import path from "node:path";

import dietPlansData from "../../data/dietPlans.json";
import foodsData from "../../data/foods.json";
import ingredientsData from "../../data/ingredients.json";
import productsData from "../../data/products.json";
import supplementsData from "../../data/supplements.json";
import type { DietPlan, Food, Guide, Ingredient, Product, Recipe, Supplement } from "./types";

export const products = productsData as Product[];
export const supplements = supplementsData as Supplement[];
export const dietPlans = dietPlansData as DietPlan[];
export const foods = foodsData as Food[];
export const ingredients = ingredientsData as Ingredient[];

const guidesDirectory = path.join(process.cwd(), "content", "guides");
const recipesDirectory = path.join(process.cwd(), "data", "recipes");

function parseFrontmatter(file: string) {
  const match = file.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

  if (!match) {
    return { metadata: {}, body: file };
  }

  const metadata: Record<string, string | string[]> = {};
  const lines = match[1].split(/\r?\n/);
  let currentArrayKey: string | null = null;

  for (const line of lines) {
    if (line.startsWith("  - ") && currentArrayKey) {
      metadata[currentArrayKey] = [
        ...((metadata[currentArrayKey] as string[] | undefined) ?? []),
        line.replace("  - ", "").trim(),
      ];
      continue;
    }

    const [key, ...rest] = line.split(":");
    if (!key || rest.length === 0) continue;

    const value = rest.join(":").trim();
    if (value === "") {
      currentArrayKey = key.trim();
      metadata[currentArrayKey] = [];
    } else {
      currentArrayKey = null;
      metadata[key.trim()] = value.replace(/^"|"$/g, "");
    }
  }

  return { metadata, body: match[2].trim() };
}

export function getGuides(): Guide[] {
  return fs
    .readdirSync(guidesDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(guidesDirectory, file), "utf8");
      const { metadata, body } = parseFrontmatter(raw);

      return {
        slug,
        title: String(metadata.title),
        summary: String(metadata.summary),
        author: String(metadata.author),
        reviewer: String(metadata.reviewer),
        lastUpdated: String(metadata.lastUpdated),
        readingTime: String(metadata.readingTime),
        references: (metadata.references as string[]) ?? [],
        body,
      };
    });
}

export function getGuide(slug: string) {
  return getGuides().find((guide) => guide.slug === slug);
}

export function getRecipes(): Recipe[] {
  if (!fs.existsSync(recipesDirectory)) return [];

  return fs
    .readdirSync(recipesDirectory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(recipesDirectory, file), "utf8");
      return JSON.parse(raw) as Recipe;
    });
}

export function getRecipe(slug: string) {
  return getRecipes().find((recipe) => recipe.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getSupplement(slug: string) {
  return supplements.find((supplement) => supplement.slug === slug);
}

export function getDietPlan(slug: string) {
  return dietPlans.find((plan) => plan.slug === slug);
}
