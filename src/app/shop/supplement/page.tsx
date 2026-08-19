import type { Metadata } from "next";
import { ShopShell } from "@/components/shop-shell";
import { SupplementsPageContent } from "@/components/supplements-page-content";
import { catalogSupplements } from "@/lib/data";
import { supplementFeaturedProducts, supplementProducts, supplementTags } from "@/lib/shop-products";

export const metadata: Metadata = {
  title: "Vegan Supplements",
  description: "Compare vegan supplements sold on Amazon India with available Trustified and Unbox Health results.",
  keywords: [
    "vegan supplements",
    "plant based protein",
    "vegan B12",
    "vegan omega 3",
    "plant based supplements",
    "vegan D3",
    "vegetarian supplements",
    "vegan calcium",
    "plant protein powder",
  ],
};

export default function SupplementsPage() {
  return (
    <ShopShell activeHref="/shop/supplement">
      <div className="max-w-3xl">
        <p className="text-sm font-medium tracking-wide text-primary">GreenFit shop</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold">Supplements</h1>
        <p className="mt-3 text-lg leading-8 text-muted-foreground">
          Choose a nutrient and compare vegan supplement products available from Amazon India, with independent testing results where available.
        </p>
      </div>
      <SupplementsPageContent
        products={supplementProducts}
        featuredProducts={supplementFeaturedProducts}
        catalogSupplements={catalogSupplements}
        tags={supplementTags}
      />
    </ShopShell>
  );
}
