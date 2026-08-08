import { ShopProductCarousel } from "@/components/shop-product-carousel";
import { ShopShell } from "@/components/shop-shell";
import type { ShopNavHref } from "@/lib/shop-nav";
import type { ShopProduct } from "@/lib/shop-products";

export function ShopCategoryPage({
  eyebrow = "GreenFit shop",
  title,
  description,
  note,
  tags,
  products,
  featuredProducts,
  itemSingular = "product",
  itemPlural = "products",
  activeHref,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  note?: string;
  tags: string[];
  products: ShopProduct[];
  featuredProducts: ShopProduct[];
  itemSingular?: string;
  itemPlural?: string;
  activeHref: ShopNavHref;
}) {
  return (
    <ShopShell activeHref={activeHref}>
      <div className="max-w-3xl">
        <p className="text-sm font-medium tracking-wide text-primary">{eyebrow}</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
      </div>

      <ShopProductCarousel
        products={products}
        featuredProducts={featuredProducts}
        sourcePage={title}
        tags={tags}
        itemSingular={itemSingular}
        itemPlural={itemPlural}
      />

      {note ? (
        <div className="rounded-xl border border-olive-200 bg-olive-50/70 px-5 py-4 text-sm leading-6 text-olive-800">
          {note}
        </div>
      ) : null}
    </ShopShell>
  );
}
