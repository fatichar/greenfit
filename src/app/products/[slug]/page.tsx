import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AffiliateProductsSection } from "@/components/affiliate-products";
import { DisclaimerBox } from "@/components/disclaimer-box";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAffiliateProductsByTags } from "@/lib/affiliate";
import { getProduct, products } from "@/lib/data";
import { getProductImage } from "@/lib/images";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  return {
    title: product ? `${product.name} food guide` : "Food guide",
    description: product?.notes,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();
  const affiliateProducts = getAffiliateProductsByTags([product.slug, product.category]);

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">{product.category}</p>
        <h1 className="font-heading text-4xl font-semibold">{product.name}</h1>
        <p className="text-muted-foreground">{product.bestFor}</p>
      </div>
      <Image
        src={getProductImage(product.slug)}
        alt=""
        width={1200}
        height={900}
        className="aspect-[16/7] w-full rounded-xl border border-olive-200 object-cover shadow-sm"
        loading="eager"
      />
      <InfoGrid
        items={[
          ["Serving", product.serving],
          ["Last reviewed", product.lastReviewed],
        ]}
      />
      <Card>
        <CardHeader><CardTitle>Nutrition snapshot</CardTitle></CardHeader>
        <CardContent className="text-sm leading-7 text-muted-foreground">{product.nutrition}</CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <ListCard title="Common ingredients" items={product.ingredients} />
        <ListCard title="Recipe ideas" items={product.recipes} />
      </div>
      <ListCard title="Popular brands" items={product.popularBrands} />
      <Card>
        <CardHeader><CardTitle>Buying tips</CardTitle></CardHeader>
        <CardContent className="text-sm leading-7 text-muted-foreground">{product.buyingTips}</CardContent>
      </Card>
      <AffiliateProductsSection products={affiliateProducts} sourcePage={`/products/${product.slug}`} />
      <Card>
        <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
        <CardContent className="text-sm leading-7 text-muted-foreground">{product.notes}</CardContent>
      </Card>
      <DisclaimerBox />
    </section>
  );
}

function InfoGrid({ items }: { items: [string, string][] }) {
  return <div className="grid gap-3 sm:grid-cols-2">{items.map(([label, value]) => <Card key={label} size="sm"><CardContent><p className="text-xs font-medium uppercase text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value}</p></CardContent></Card>)}</div>;
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent><ul className="ml-5 list-disc space-y-2 text-sm text-muted-foreground">{items.map((item) => <li key={item}>{item}</li>)}</ul></CardContent></Card>;
}
