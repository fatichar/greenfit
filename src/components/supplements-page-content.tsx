"use client";

import { Suspense } from "react";
import { ShopProductCarousel } from "@/components/shop-product-carousel";
import { SupplementDirectory } from "@/components/supplement-directory";
import type { AffiliateSupplement } from "@/lib/types";
import type { ShopProduct } from "@/lib/shop-products";

export function SupplementsPageContent({
  products,
  featuredProducts,
  affiliateSupplements,
  tags,
}: {
  products: ShopProduct[];
  featuredProducts: ShopProduct[];
  affiliateSupplements: AffiliateSupplement[];
  tags: string[];
}) {
  return (
    <div className="flex flex-col gap-10">
      <ShopProductCarousel
        products={products}
        featuredProducts={featuredProducts}
        tags={tags}
        sourcePage="/shop/supplement"
        itemSingular="supplement"
        itemPlural="supplements"
        description="A few less-obvious options to compare before you default to the most familiar supplement on the shelf."
        showTags={false}
        showThumbnails={false}
      />
      <section className="flex flex-col gap-5" aria-labelledby="supplement-comparison-heading">
        <div>
          <h2 id="supplement-comparison-heading" className="font-heading text-2xl font-semibold">Compare by nutrient and testing</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Choose a supplement type, then review verified, untested, and failed or low-rated product groups.</p>
        </div>
        <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl border border-olive-200 bg-muted/40" />}>
          <SupplementDirectory products={affiliateSupplements} />
        </Suspense>
      </section>
    </div>
  );
}
