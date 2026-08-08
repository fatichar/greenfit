import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CookingPot,
  Dumbbell,
  FlaskConical,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { ShopProductCarousel } from "@/components/shop-product-carousel";
import { ShopShell } from "@/components/shop-shell";
import { allShopProducts, shopFeaturedProducts } from "@/lib/shop-products";

export const metadata: Metadata = {
  title: "Shop plant-based products",
  description: "Browse GreenFit's recommendations for supplements, exercise, kitchen devices, personal care, beauty, and books.",
};

const shopCategories: Array<{
  title: string;
  href: string;
  description: string;
  detail: string;
  cta: string;
  icon: LucideIcon;
}> = [
  {
    title: "Supplements",
    href: "/shop/supplement",
    description: "Compare products by nutrient before deciding what belongs in your routine.",
    detail: "Includes third-party test ratings and verified, untested, and failed-status groupings.",
    cta: "Compare supplements",
    icon: FlaskConical,
  },
  {
    title: "Exercise & Fitness",
    href: "/shop/exercise-fitness",
    description: "Find compact equipment organised around how you want to move.",
    detail: "Explore strength, bodyweight, small-space training, mobility, and recovery picks.",
    cta: "Explore fitness products",
    icon: Dumbbell,
  },
  {
    title: "Kitchen",
    href: "/shop/kitchen",
    description: "Choose appliances that make healthy cooking easier to repeat during a busy week.",
    detail: "Compare prep, juicing, batch-cooking, and small-space kitchen tools.",
    cta: "Explore kitchen products",
    icon: CookingPot,
  },
  {
    title: "Personal Care & Beauty",
    href: "/shop/personal-care-beauty",
    description: "Discover less-obvious products for everyday care.",
    detail: "Browse scalp care, oral care, skin tools, recovery, and low-waste alternatives.",
    cta: "Explore personal care",
    icon: Sparkles,
  },
  {
    title: "Books",
    href: "/shop/books",
    description: "Find reading on nutrition, movement, recovery, and sustainable habits.",
        detail: "Start with books chosen for useful ideas rather than trend-driven promises.",
    cta: "Explore books",
    icon: BookOpen,
  },
];

export default function ShopPage() {
  return (
    <ShopShell activeHref="/shop">
      <div className="max-w-3xl">
        <p className="text-sm font-medium tracking-wide text-primary">GreenFit shop</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight sm:text-5xl">Shop with a little more clarity</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Start with the decision you are making. Each category has its own guidance and comparison tools.
        </p>
      </div>

      <section aria-labelledby="shop-categories-heading">
        <div className="max-w-2xl">
          <h2 id="shop-categories-heading" className="font-heading text-3xl font-semibold">Choose a category</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Open a dedicated guide to see the full selection and category-specific comparison tools.</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {shopCategories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.href}
                href={category.href}
                className="group flex min-h-64 flex-col rounded-2xl border border-olive-200 bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-mint-100 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-heading text-xl font-semibold transition-colors group-hover:text-primary">{category.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description}</p>
                <p className="mt-3 flex-1 border-t border-olive-100 pt-3 text-xs leading-5 text-muted-foreground">{category.detail}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {category.cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <ShopProductCarousel
        products={allShopProducts}
        featuredProducts={shopFeaturedProducts}
        tags={[]}
        sourcePage="Shop overview"
        itemSingular="pick"
        itemPlural="picks"
        title="Interesting discoveries"
        description="A rotating handful of less-obvious products from across the GreenFit shop. Visit a category for the full guide."
        showTags={false}
        showThumbnails={false}
      />

      <div className="rounded-xl border border-olive-200 bg-olive-50/70 px-5 py-4 text-sm leading-6 text-olive-800">
        Buying note: prices, availability, ingredients, certifications, warranties, and specifications can change. Always verify the current listing and your own requirements before buying. GreenFit may earn from qualifying purchases.
      </div>
    </ShopShell>
  );
}
