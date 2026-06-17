import type { Metadata } from "next";
import { ToolsCalculators } from "@/components/tools-calculators";

export const metadata: Metadata = {
  title: "Nutrition Tools",
  description: "Simple client-side plant-based protein, calorie, and macro estimate calculators for vegan nutrition.",
  keywords: [
    "vegan nutrition tools",
    "plant based calculators",
    "vegan macros",
    "plant based protein calculator",
    "vegetarian nutrition tools",
    "WFPB macro calculator",
  ],
};

export default function ToolsPage() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="font-heading text-4xl font-semibold">Tools</h1>
        <p className="mt-3 text-lg leading-8 text-muted-foreground">
          Simple estimates for planning. Use them as starting points, not prescriptions.
        </p>
      </div>
      <section hidden aria-hidden="true">
        <h2>Product suitability checker</h2>
        <p>
          Placeholder for a future ingredient and suitability tagging tool. This is intentionally hidden until the
          checker is implemented.
        </p>
      </section>
      <ToolsCalculators />
    </section>
  );
}
