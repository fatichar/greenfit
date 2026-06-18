import type { Metadata } from "next";
import { GuideCard } from "@/components/guide-card";
import { getGuides } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nutrition Guides",
  description: "Evidence-based practical guides for plant-based nutrition, vegan protein, B12, calcium, dairy replacements, omega-3, iron, and zinc.",
  keywords: [
    "vegan nutrition guides",
    "plant based evidence",
    "vegetarian health",
    "vegan protein",
    "plant based B12",
    "WFPB nutrition",
    "vegan dairy replacements",
  ],
};

export default function GuidesPage() {
  const guides = getGuides();

  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="font-heading text-4xl font-semibold">Guides</h1>
        <p className="mt-3 text-lg leading-8 text-muted-foreground">
          Practical plant-based nutrition guides with references, review notes, and clear next steps.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {guides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </section>
  );
}
