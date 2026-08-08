"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  Dumbbell,
  FlaskConical,
  Pause,
  Play,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { withAmazonAssociatesTag } from "@/lib/affiliate";
import type { ShopProduct } from "@/lib/shop-products";
import { cn } from "@/lib/utils";

const visualIcons: Record<ShopProduct["visual"], LucideIcon> = {
  supplement: FlaskConical,
  exercise: Dumbbell,
  kitchen: CookingPot,
  beauty: Sparkles,
  book: BookOpen,
};

const AUTO_MS = 5000;

export function ShopProductCarousel({
  products,
  featuredProducts,
  tags,
  sourcePage,
  itemSingular = "product",
  itemPlural = "products",
  title,
  description = "Useful picks to help you make a more informed choice.",
  showTags = true,
  showThumbnails = true,
}: {
  products: ShopProduct[];
  featuredProducts: ShopProduct[];
  tags: string[];
  sourcePage: string;
  /** Singular noun for UI copy, e.g. "book" or "supplement". */
  itemSingular?: string;
  /** Plural noun for UI copy, e.g. "books" or "supplements". */
  itemPlural?: string;
  title?: string;
  description?: string;
  showTags?: boolean;
  showThumbnails?: boolean;
}) {
  const itemSingularLabel = itemSingular.charAt(0).toUpperCase() + itemSingular.slice(1);
  const allLabel = `All ${itemPlural}`;
  const headingTitle = title ?? `Featured ${itemPlural}`;

  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedTag, setSelectedTag] = useState(allLabel);

  const availableTags = tags.length ? tags : [...new Set(products.flatMap((product) => product.tags))];
  const filteredProducts = useMemo(
    () => selectedTag === allLabel
      ? products
      : products.filter((product) => product.category === selectedTag || product.tags.includes(selectedTag)),
    [allLabel, products, selectedTag],
  );
  const carouselProducts = useMemo(() => {
    const featured = featuredProducts.filter((product) =>
      selectedTag === allLabel || product.category === selectedTag || product.tags.includes(selectedTag),
    );

    return featured.length ? featured : filteredProducts.slice(0, Math.min(3, filteredProducts.length));
  }, [allLabel, featuredProducts, filteredProducts, selectedTag]);
  const activeIndex = Math.min(index, Math.max(carouselProducts.length - 1, 0));
  const activeProduct = carouselProducts[activeIndex];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (carouselProducts.length <= 1 || userPaused || hoverPaused) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % carouselProducts.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [carouselProducts.length, hoverPaused, userPaused]);

  if (!products.length || !activeProduct) return null;

  const goTo = (nextIndex: number) => {
    setIndex((nextIndex + carouselProducts.length) % carouselProducts.length);
  };

  return (
    <section
      className="flex flex-col gap-5"
      aria-labelledby={`${sourcePage.replace(/\W/g, "-")}-products-heading`}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      aria-roledescription="carousel"
      aria-label={`${headingTitle} carousel`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id={`${sourcePage.replace(/\W/g, "-")}-products-heading`} className="font-heading text-2xl font-semibold">
            {headingTitle}
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <p className="text-xs text-muted-foreground">As an Amazon Associate, we may earn from qualifying purchases.</p>
      </div>

      {showTags && (
        <div className="flex flex-wrap gap-2" aria-label={`${headingTitle} tags`}>
          <TagChip label={allLabel} selected={selectedTag === allLabel} onClick={() => { setSelectedTag(allLabel); setIndex(0); }} />
          {availableTags.map((tag) => (
            <TagChip key={tag} label={tag} selected={selectedTag === tag} onClick={() => { setSelectedTag(tag); setIndex(0); }} />
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-olive-200 bg-card p-4 shadow-sm sm:p-6">
        <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <ProductArtwork product={activeProduct} reducedMotion={reducedMotion} />
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary">{activeProduct.category}</Badge>
              {activeProduct.tags.slice(0, 2).map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Featured {itemSingular}</p>
              <h3 className="mt-1 font-heading text-2xl font-semibold leading-tight">{activeProduct.name}</h3>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">{activeProduct.description}</p>
            <p className="border-t pt-3 text-xs leading-5 text-muted-foreground">{activeProduct.detail}</p>
            <a
              href={withAmazonAssociatesTag(activeProduct.href)}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              data-umami-event="Outbound Shop Product Click"
              data-umami-event-product-id={activeProduct.id}
              data-umami-event-product-category={activeProduct.category}
              data-umami-event-source-page={sourcePage}
              className={cn(buttonVariants(), "w-full sm:w-fit")}
            >
              View on Amazon
              <ArrowUpRight data-icon="inline-end" />
            </a>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t pt-4">
          <p className="text-xs font-medium tabular-nums text-muted-foreground" aria-live="polite">
            {itemSingularLabel} {activeIndex + 1} of {carouselProducts.length}
          </p>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => goTo(activeIndex - 1)} className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-olive-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Previous featured ${itemSingular}`}>
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => goTo(activeIndex + 1)} className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-olive-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Next featured ${itemSingular}`}>
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => setUserPaused((paused) => !paused)} className="ml-1 inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-olive-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={userPaused ? `Resume automatic featured ${itemPlural}` : `Pause automatic featured ${itemPlural}`} aria-pressed={userPaused}>
              {userPaused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {showThumbnails && (
        <>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="font-heading text-lg font-semibold">{allLabel}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Open any {itemSingular} directly on Amazon.</p>
            </div>
            <p className="text-xs tabular-nums text-muted-foreground">{filteredProducts.length} shown</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" aria-label={allLabel}>
            {filteredProducts.map((product) => (
              <ProductThumbnail
                key={product.id}
                product={product}
                sourcePage={sourcePage}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function TagChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        selected ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/80" : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      )}
    >
      {label}
    </button>
  );
}

function ProductThumbnail({ product, sourcePage }: { product: ShopProduct; sourcePage: string }) {
  return (
    <a
      href={withAmazonAssociatesTag(product.href)}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      data-umami-event="Outbound Shop Product Click"
      data-umami-event-product-id={product.id}
      data-umami-event-product-category={product.category}
      data-umami-event-source-page={sourcePage}
      className="group overflow-hidden rounded-xl border bg-card text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b bg-[linear-gradient(135deg,#edf9df_0%,#f7fff3_100%)]">
        <ProductArtwork product={product} compact />
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-medium leading-5 transition-colors group-hover:text-primary">{product.name}</p>
      </div>
    </a>
  );
}

function ProductArtwork({ product, compact = false, reducedMotion = false }: { product: ShopProduct; compact?: boolean; reducedMotion?: boolean }) {
  const Icon = visualIcons[product.visual];
  const imageSrc = product.imagePath ?? product.imageUrl;

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-[linear-gradient(135deg,#edf9df_0%,#f7fff3_100%)]", compact ? "h-full w-full" : "aspect-[4/3] w-full", !reducedMotion && "transition-opacity duration-500") }>
      {imageSrc ? (
        imageSrc.startsWith("/") ? (
          <Image src={imageSrc} alt="" fill sizes={compact ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" : "(max-width: 767px) 100vw, 45vw"} className="object-contain p-5" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt="" className="h-full w-full object-contain p-5" loading="lazy" />
        )
      ) : (
        <div className="flex h-full items-center justify-center text-primary">
          <Icon className={cn(compact ? "size-9" : "size-14", "opacity-80")} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
