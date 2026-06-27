import type { Metadata } from "next";
import { SupplementDirectory } from "@/components/supplement-directory";
import { supplements } from "@/lib/data";

export const metadata: Metadata = {
  title: "Supplement Guides",
  description: "Plant-based supplement type guides with dosage, timing, toxicity cautions, quality checks, and popular brands.",
  keywords: [
    "vegan supplements",
    "plant based protein",
    "vegan B12",
    "vegan omega 3",
    "plant based supplements",
    "vegan D3",
    "vegetarian supplements",
  ],
};

export default function SupplementsPage() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="font-heading text-4xl font-semibold">Supplements</h1>
        <p className="mt-3 text-lg leading-8 text-muted-foreground">
          Review supplement types such as B12, D3, algal omega-3, iron, zinc, and creatine with dosage, timing, toxicity, and brand examples.
        </p>
      </div>
      <SupplementDirectory supplements={supplements} />
    </section>
  );
}
