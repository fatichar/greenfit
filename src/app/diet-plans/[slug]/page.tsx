import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { DisclaimerBox } from "@/components/disclaimer-box";
import { InfoDisclosureList } from "@/components/info-disclosure";
import { MacroSummary } from "@/components/macro-summary";
import { MealPlanTable } from "@/components/meal-plan-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dietPlans, getDietPlan, getRecipes } from "@/lib/data";
import { getDietPlanImage } from "@/lib/images";
import { buildMealItemRecipeMap } from "@/lib/recipe-match";

export function generateStaticParams() {
  return dietPlans.map((plan) => ({ slug: plan.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const plan = getDietPlan(slug);

  return {
    title: plan?.title ?? "Diet plan",
    description: plan?.goal,
  };
}

export default async function DietPlanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = getDietPlan(slug);

  if (!plan) notFound();

  const recipes = getRecipes();
  const mealItems = plan.meals.flatMap((meal) => meal.items);
  const recipeLinks = buildMealItemRecipeMap(mealItems, recipes);
  const linkedCount = Object.keys(recipeLinks).length;

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-4xl font-semibold">{plan.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{plan.goal}</p>
      </div>
      <Image
        src={getDietPlanImage(plan.slug)}
        alt=""
        width={1200}
        height={900}
        className="aspect-[16/7] w-full rounded-xl border border-olive-200 object-cover shadow-sm"
        loading="eager"
      />
      <MacroSummary calories={plan.calories} protein={plan.protein} />
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm leading-7 text-muted-foreground">
          <p>{plan.whoThisIsFor}</p>
          <p>
            Difficulty: {plan.difficulty}. Cuisine: {plan.cuisineStyle}. Affordability: {plan.affordability}.
          </p>
        </CardContent>
      </Card>
      {plan.explanation?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>How to read this plan</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm leading-7 text-muted-foreground">
            {plan.explanation.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </CardContent>
        </Card>
      ) : null}
      <div className="grid gap-2">
        <MealPlanTable meals={plan.meals} recipeLinks={recipeLinks} />
        {linkedCount > 0 ? (
          <p className="text-sm text-muted-foreground">
            Highlighted items link to recipes. {linkedCount} meal item
            {linkedCount === 1 ? "" : "s"} matched.
          </p>
        ) : null}
      </div>
      <TextList title="Protein sources" items={plan.proteinSources} />
      <TextList title="Substitutions" items={plan.substitutions} />
      {plan.detailSections?.map((section) => (
        <InfoDisclosureList key={section.title} title={section.title} items={section.items} />
      ))}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{plan.notes}</CardContent>
      </Card>
      <DisclaimerBox />
    </section>
  );
}

function TextList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
