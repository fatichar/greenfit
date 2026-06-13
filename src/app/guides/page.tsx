import type { Metadata } from "next";
import { GuideCard } from "@/components/guide-card";
import { getGuides } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nutrition Guides",
  description: "Evidence-based practical guides for protein, B12, calcium, dairy replacements, omega-3, iron, and zinc.",
};

export default function GuidesPage() {
  const guides = getGuides();

  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="font-heading text-4xl font-semibold">Guides</h1>
        <p className="mt-3 text-lg leading-8 text-muted-foreground">
          Static nutrition guides with references, reviewer placeholders, and clear disclaimers.
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
