import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { DisclaimerBox } from "@/components/disclaimer-box";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupplement, supplements } from "@/lib/data";
import { getSupplementImage } from "@/lib/images";

export function generateStaticParams() {
  return supplements.map((supplement) => ({ slug: supplement.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supplement = getSupplement(slug);

  return {
    title: supplement ? `${supplement.name} supplement review` : "Supplement review",
    description: supplement?.notes,
  };
}

export default async function SupplementDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supplement = getSupplement(slug);

  if (!supplement) notFound();

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={supplement.status} />
          <ConfidenceBadge confidence={supplement.confidence} />
        </div>
        <h1 className="font-heading text-4xl font-semibold">{supplement.name}</h1>
        <p className="text-muted-foreground">{supplement.brand} - {supplement.category}</p>
      </div>
      <Image
        src={getSupplementImage(supplement.slug)}
        alt=""
        width={1200}
        height={900}
        className="aspect-[16/7] w-full rounded-xl border border-olive-200 object-cover shadow-sm"
        priority
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Nutrient form", supplement.form],
          ["Dose", supplement.dose],
          ["Cost per serving", supplement.costPerServing],
          ["Last reviewed", supplement.lastReviewed],
        ].map(([label, value]) => (
          <Card key={label} size="sm">
            <CardContent>
              <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
              <p className="mt-1 font-medium">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product overview</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-7 text-muted-foreground">{supplement.notes}</CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pros / cons</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-muted-foreground">
            <p>Pro: Clear nutrient form and dose listed.</p>
            <p>Con: Confirm testing and source-dependent capsule details where relevant.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lab report section</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-muted-foreground">
            <p>Third-party tested: {supplement.thirdPartyTested}</p>
            <p>Batch/test report placeholder: Add batch-specific PDF or image later.</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Heavy metal analysis</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Heavy metal report: {supplement.heavyMetalReport}. Prefer products with batch-level reports for higher trust.
        </CardContent>
      </Card>
      <DisclaimerBox />
    </section>
  );
}
