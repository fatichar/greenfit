import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { DisclaimerBox } from "@/components/disclaimer-box";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProduct, products } from "@/lib/data";
import { getProductImage } from "@/lib/images";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  return {
    title: product ? `${product.name} product check` : "Product check",
    description: product?.notes,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={product.status} />
          <ConfidenceBadge confidence={product.confidence} />
        </div>
        <h1 className="font-heading text-4xl font-semibold">{product.name}</h1>
        <p className="text-muted-foreground">{product.brand} - {product.category}</p>
      </div>
      <Image
        src={getProductImage(product.slug)}
        alt=""
        width={1200}
        height={900}
        className="aspect-[16/7] w-full rounded-xl border border-olive-200 object-cover shadow-sm"
        priority
      />
      <InfoGrid
        items={[
          ["Verification source", product.verificationSource],
          ["Last reviewed", product.lastReviewed],
          ["Confidence level", product.confidence],
          ["Status", product.status],
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>Ingredient analysis</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground">
          <p>Ingredients: {product.ingredients.join(", ")}</p>
          <p>
            Ingredients of concern:{" "}
            {product.ingredientsOfConcern.length ? product.ingredientsOfConcern.join(", ") : "None listed"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Reasoning</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-7 text-muted-foreground">{product.notes}</CardContent>
      </Card>
      <DisclaimerBox />
    </section>
  );
}

function InfoGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <Card key={label} size="sm">
          <CardContent>
            <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
            <p className="mt-1 font-medium">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
