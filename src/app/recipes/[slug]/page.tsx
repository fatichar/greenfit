import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Banknote, Flame, Leaf, Tag } from "lucide-react";
import type { Recipe } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export async function generateStaticParams() {
  const recipesDir = path.join(process.cwd(), "data", "recipes");
  const fileNames = fs.readdirSync(recipesDir);
  return fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => ({
      slug: fileName.replace(/\.json$/, ""),
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const recipe = getRecipe(resolvedParams.slug);
  if (!recipe) return {};

  return {
    title: recipe.title,
    description: recipe.description,
  };
}

function getRecipe(slug: string): Recipe | null {
  try {
    const filePath = path.join(process.cwd(), "data", "recipes", `${slug}.json`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents) as Recipe;
  } catch {
    return null;
  }
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const recipe = getRecipe(resolvedParams.slug);

  if (!recipe) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/recipes"
        className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to recipes
      </Link>

      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {recipe.title}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          {recipe.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span className="font-medium">Prep:</span> <span className="ml-1">{recipe.prepTime}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span className="font-medium">Cook:</span> <span className="ml-1">{recipe.cookTime}</span>
          </div>
          <div className="flex items-center">
            <Banknote className="mr-2 h-4 w-4" />
            <span className="font-medium">Cost:</span> <span className="ml-1">{recipe.cost}</span>
          </div>
          <div className="flex items-center">
            <Flame className="mr-2 h-4 w-4" />
            <span className="font-medium">Nutrition:</span> <span className="ml-1">{recipe.nutrition.calories} kcal · {recipe.nutrition.protein} protein</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl bg-muted mb-12 relative">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        <div className="md:col-span-1 space-y-8">
          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight">Nutrition</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">Per {recipe.nutrition.servingSize}</p>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Calories", `${recipe.nutrition.calories} kcal`],
                ["Protein", recipe.nutrition.protein],
                ["Carbs", recipe.nutrition.carbs],
                ["Fat", recipe.nutrition.fat],
                ["Fiber", recipe.nutrition.fiber],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-muted/60 p-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="mt-1 font-semibold text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">Ingredients</h2>
            <ul className="space-y-3">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {i + 1}
                </span>
                <span className="text-foreground pt-0.5">{ingredient}</span>
              </li>
            ))}
            </ul>
          </section>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Instructions</h2>
          <ol className="space-y-6">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-sm">
                  {i + 1}
                </span>
                <p className="text-foreground pt-1 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}
