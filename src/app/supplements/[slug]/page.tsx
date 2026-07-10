import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateProductsSection } from "@/components/affiliate-products";
import { DisclaimerBox } from "@/components/disclaimer-box";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAffiliateProductsByTags } from "@/lib/affiliate";
import { getSupplement, supplements } from "@/lib/data";
import { getSupplementImage } from "@/lib/images";

export function generateStaticParams() { return supplements.map((supplement) => ({ slug: supplement.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supplement = getSupplement(slug);
  return { title: supplement ? `${supplement.name} supplement guide` : "Supplement guide", description: supplement?.notes };
}

export default async function SupplementDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supplement = getSupplement(slug);
  if (!supplement) notFound();
  const affiliateProducts = getAffiliateProductsByTags([supplement.slug, supplement.category]);

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">{supplement.category}</p>
        <h1 className="font-heading text-4xl font-semibold">{supplement.name}</h1>
        <p className="text-muted-foreground">{supplement.notes}</p>
      </div>
      <Image src={getSupplementImage(supplement.slug)} alt="" width={1200} height={900} className="aspect-[16/7] w-full rounded-xl border border-olive-200 object-cover shadow-sm" loading="eager" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[["Form", supplement.form], ["Dose", supplement.dose], ["When to take", supplement.whenToTake], ["Last reviewed", supplement.lastReviewed]].map(([label, value]) => (
          <Card key={label} size="sm"><CardContent><p className="text-xs font-medium uppercase text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value}</p></CardContent></Card>
        ))}
      </div>
      <Card><CardHeader><CardTitle>Toxicity and cautions</CardTitle></CardHeader><CardContent className="text-sm leading-7 text-muted-foreground">{supplement.toxicity}</CardContent></Card>
      <Card><CardHeader><CardTitle>Quality checks</CardTitle></CardHeader><CardContent className="text-sm leading-7 text-muted-foreground">{supplement.testingNotes}</CardContent></Card>
      <Card><CardHeader><CardTitle>Popular brands</CardTitle></CardHeader><CardContent><ul className="ml-5 list-disc space-y-2 text-sm text-muted-foreground">{supplement.popularBrands.map((brand) => <li key={brand}>{brand}</li>)}</ul></CardContent></Card>
      <AffiliateProductsSection products={affiliateProducts} sourcePage={`/supplements/${supplement.slug}`} />
      {supplement.relatedGuide ? <p className="text-sm text-muted-foreground">Related guide: <Link href={supplement.relatedGuide} className="font-medium text-primary underline underline-offset-4">read the full nutrition guide</Link>.</p> : null}
      <DisclaimerBox />
    </section>
  );
}
