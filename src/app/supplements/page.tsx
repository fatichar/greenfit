import type { Metadata } from "next";
import { SupplementDirectory } from "@/components/supplement-directory";
import { supplements } from "@/lib/data";

export const metadata: Metadata = {
  title: "Supplement Reviews",
  description: "Vegan supplement directory with status, form, dose, third-party testing, and heavy metal report fields for plant-based nutrition.",
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
          Compare B12, D3, omega-3, protein, creatine, and multivitamin products with transparent confidence.
        </p>
      </div>
      <SupplementDirectory supplements={supplements} />
    </section>
  );
}
