import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Banknote, Flame, Leaf, Tag } from "lucide-react";
import { dietPlans, getRecipe, getRecipes } from "@/lib/data";
import { findDietPlansForRecipe } from "@/lib/recipe-match";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { InfoDisclosureList } from "@/components/info-disclosure";
import { SITE_NAME, siteUrl } from "@/lib/site";

export async function generateStaticParams() {
  return getRecipes().map((recipe) => ({
    slug: recipe.slug,
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

function durationToIsoDuration(duration: string) {
  const minutes = Number(duration.match(/\d+/)?.[0]);
  return Number.isFinite(minutes) ? `PT${minutes}M` : undefined;
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const recipe = getRecipe(resolvedParams.slug);

  if (!recipe) {
    notFound();
  }

  const recipeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: siteUrl(recipe.image),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    prepTime: durationToIsoDuration(recipe.prepTime),
    cookTime: durationToIsoDuration(recipe.cookTime),
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((instruction) => ({
      "@type": "HowToStep",
      text: instruction,
    })),
    keywords: recipe.tags.join(", "),
    nutrition: {
      "@type": "NutritionInformation",
      servingSize: recipe.nutrition.servingSize,
      calories: `${recipe.nutrition.calories} calories`,
      proteinContent: `${recipe.nutrition.proteinG} g`,
      carbohydrateContent: `${recipe.nutrition.carbsG} g`,
      fatContent: `${recipe.nutrition.fatG} g`,
      fiberContent: `${recipe.nutrition.fiberG} g`,
    },
    mainEntityOfPage: siteUrl(`/recipes/${recipe.slug}`),
  };

  const relatedPlans = findDietPlansForRecipe(recipe.slug, dietPlans, getRecipes());

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd data={recipeJsonLd} />
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
        {recipe.explanation?.length ? (
          <div className="mt-5 grid gap-3 text-base leading-7 text-muted-foreground">
            {recipe.explanation.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ) : null}

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
            <span className="font-medium">Nutrition:</span>{" "}
            <span className="ml-1">
              {recipe.nutrition.calories} kcal · {recipe.nutrition.proteinG} g protein
            </span>
          </div>
          <div className="flex items-center">
            <Leaf className="mr-2 h-4 w-4" />
            <span className="font-medium">Servings:</span>{" "}
            <span className="ml-1">{recipe.servings}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
          {recipe.mealTypes.map((mealType) => (
            <Badge key={mealType} variant="outline" className="capitalize">
              {mealType.replace(/-/g, " ")}
            </Badge>
          ))}
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
          loading="eager"
          sizes="(max-width: 896px) 100vw, 896px"
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
                ["Protein", `${recipe.nutrition.proteinG} g`],
                ["Carbs", `${recipe.nutrition.carbsG} g`],
                ["Fat", `${recipe.nutrition.fatG} g`],
                ["Fiber", `${recipe.nutrition.fiberG} g`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-muted/60 p-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="mt-1 font-semibold text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
            {(recipe.dietary?.length > 0 || recipe.proteinSources?.length > 0) && (
              <div className="mt-4 space-y-3 text-sm">
                {recipe.dietary?.length > 0 && (
                  <div>
                    <p className="text-muted-foreground">Dietary</p>
                    <p className="mt-1 font-medium capitalize">
                      {recipe.dietary.map((d) => d.replace(/-/g, " ")).join(" · ")}
                    </p>
                  </div>
                )}
                {recipe.proteinSources?.length > 0 && (
                  <div>
                    <p className="text-muted-foreground">Protein sources</p>
                    <p className="mt-1 font-medium capitalize">
                      {recipe.proteinSources.join(" · ")}
                    </p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  {recipe.portable && (
                    <Badge variant="secondary" className="text-xs">
                      Portable
                    </Badge>
                  )}
                  {recipe.makeAhead && (
                    <Badge variant="secondary" className="text-xs">
                      Make-ahead
                    </Badge>
                  )}
                </div>
              </div>
            )}
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
                <div className="pt-1">
                  <p className="text-foreground leading-relaxed">{step}</p>
                  {recipe.stepNotes?.[i] ? (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{recipe.stepNotes[i]}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
          {recipe.variationSections?.length ? (
            <div className="mt-10 grid gap-4">
              {recipe.variationSections.map((section) => (
                <InfoDisclosureList key={section.title} title={section.title} items={section.items} />
              ))}
            </div>
          ) : null}
          {relatedPlans.length > 0 ? (
            <section className="mt-10 rounded-2xl border bg-card p-5 shadow-sm">
              <h2 className="text-xl font-bold tracking-tight">Used in diet plans</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This recipe can fill a meal slot in these day plans.
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {relatedPlans.map((plan) => (
                  <li key={plan.slug}>
                    <Link
                      href={`/diet-plans/${plan.slug}`}
                      className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                    >
                      {plan.title}
                    </Link>
                    <span className="text-sm text-muted-foreground"> — {plan.goal}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </article>
  );
}
