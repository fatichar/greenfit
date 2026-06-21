import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AffiliateProductsSection } from "@/components/affiliate-products";
import { DisclaimerBox } from "@/components/disclaimer-box";
import { ReferenceList } from "@/components/reference-list";
import { Card, CardContent } from "@/components/ui/card";
import { getAffiliateProductsByTags } from "@/lib/affiliate";
import { getGuide, getGuides } from "@/lib/data";
import { getGuideImage } from "@/lib/images";
import { MarkdownContent } from "@/lib/markdown";

export function generateStaticParams() {
  return getGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);

  return {
    title: guide?.title ?? "Nutrition guide",
    description: guide?.summary,
  };
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) notFound();

  const affiliateProducts = getAffiliateProductsByTags([guide.slug]);

  return (
    <article className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-4xl font-semibold">{guide.title}</h1>
        <p className="mt-3 text-lg leading-8 text-muted-foreground">{guide.summary}</p>
      </div>
      <Image
        src={getGuideImage(guide.slug)}
        alt=""
        width={1200}
        height={900}
        className="aspect-[16/7] w-full rounded-xl border border-olive-200 object-cover shadow-sm"
        loading="eager"
      />
      <Card>
        <CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <p>Author: {guide.author}</p>
          <p>Reviewer: {guide.reviewer}</p>
          <p>Last updated: {guide.lastUpdated}</p>
          <p>Reading time: {guide.readingTime}</p>
        </CardContent>
      </Card>
      <MarkdownContent content={guide.body} />
      <AffiliateProductsSection products={affiliateProducts} sourcePage={`/guides/${guide.slug}`} />
      <ReferenceList references={guide.references} />
      <DisclaimerBox />
    </article>
  );
}
