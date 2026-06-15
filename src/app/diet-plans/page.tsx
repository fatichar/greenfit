import type { Metadata } from "next";
import { DietPlanCard } from "@/components/diet-plan-card";
import { dietPlans } from "@/lib/data";

export const metadata: Metadata = {
  title: "Diet Plans",
  description: "Plant-based and vegan diet plan library with calories, protein targets, cuisine style, difficulty, and affordability for WFPB eating.",
  keywords: [
    "vegan diet plans",
    "plant based diet plans",
    "WFPB meal plans",
    "vegan meal planning",
    "vegetarian diet",
    "plant based protein targets",
    "vegan nutrition",
  ],
};

export default function DietPlansPage() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="font-heading text-4xl font-semibold">Diet plans</h1>
        <p className="mt-3 text-lg leading-8 text-muted-foreground">
          Practical sample plans for common goals. These are not medically personalized.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {dietPlans.map((plan) => (
          <DietPlanCard key={plan.slug} plan={plan} />
        ))}
      </div>
    </section>
  );
}
