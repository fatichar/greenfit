import type { Metadata } from "next";
import { ToolsCalculators } from "@/components/tools-calculators";

export const metadata: Metadata = {
  title: "Nutrition Tools",
  description:
    "Plant-based nutrition calculators for protein, calories, macros, fiber, BMI, hydration, and plate protein estimates.",
  keywords: [
    "vegan nutrition tools",
    "plant based calculators",
    "vegan macros",
    "plant based protein calculator",
    "vegetarian nutrition tools",
    "WFPB macro calculator",
    "fiber calculator",
    "BMI calculator",
  ],
};

export default function ToolsPage() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="font-heading text-4xl font-semibold">Tools</h1>
        <p className="mt-3 text-lg leading-8 text-muted-foreground">
          Expand a calculator, adjust the inputs, and use the result as a starting point for planning. These are
          estimates—not prescriptions or medical advice. Jump links open the matching tool and can be shared.
        </p>
      </div>
      <ToolsCalculators />
    </section>
  );
}
