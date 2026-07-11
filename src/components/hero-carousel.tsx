"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  id: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
};

const AUTO_MS = 3000;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const count = slides.length;
  const active = slides[index];

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  // Autoplay: only the explicit pause button or hover should stop it.
  // (Focus-based pause was freezing the carousel after any control click.)
  useEffect(() => {
    if (count <= 1 || userPaused || hoverPaused) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTO_MS);

    return () => window.clearInterval(id);
  }, [count, userPaused, hoverPaused]);

  if (!active) return null;

  const transitionClass = reducedMotion ? "transition-none" : "transition-opacity duration-500 ease-out";

  return (
    <div
      className="w-full"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      aria-roledescription="carousel"
      aria-label="What you can do on GreenFit"
    >
      <div className="relative mx-auto grid w-full min-w-0 max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-[0.95fr_1.05fr] md:gap-12 lg:gap-14 lg:px-8 lg:py-14">
        <div className="grid min-w-0">
          {slides.map((slide, slideIndex) => {
            const isActive = slideIndex === index;
            return (
              <div
                key={slide.id}
                className={cn(
                  "col-start-1 row-start-1 flex flex-col gap-6",
                  transitionClass,
                  isActive ? "z-10 opacity-100" : "pointer-events-none opacity-0"
                )}
                aria-hidden={!isActive}
                id={`hero-slide-${slide.id}`}
                role="tabpanel"
                aria-labelledby={`hero-tab-${slide.id}`}
              >
                <div className="flex flex-col gap-4">
                  <h2 className="max-w-xl font-heading text-2xl font-semibold leading-snug text-foreground sm:text-3xl lg:text-[2rem] lg:leading-tight">
                    {slide.title}
                  </h2>
                  <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                    {slide.body}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={slide.primaryCta.href}
                    className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
                    tabIndex={isActive ? 0 : -1}
                    data-umami-event="CTA Click"
                    data-umami-event-cta={`${slide.primaryCta.label} (Hero carousel)`}
                  >
                    {slide.primaryCta.label}
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                  {slide.secondaryCta ? (
                    <Link
                      href={slide.secondaryCta.href}
                      className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto")}
                      tabIndex={isActive ? 0 : -1}
                      data-umami-event="CTA Click"
                      data-umami-event-cta={`${slide.secondaryCta.label} (Hero carousel)`}
                    >
                      {slide.secondaryCta.label}
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <div className="min-w-0">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-olive-200 bg-white shadow-sm">
            {slides.map((slide, slideIndex) => (
              <div
                key={slide.id}
                className={cn(
                  "absolute inset-0",
                  transitionClass,
                  slideIndex === index ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                aria-hidden={slideIndex !== index}
              >
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  width={1600}
                  height={900}
                  loading={slideIndex === 0 ? "eager" : "lazy"}
                  priority={slideIndex === 0}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="h-full w-full object-cover object-[center_45%]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Carousel slides">
          {slides.map((slide, slideIndex) => {
            const selected = slideIndex === index;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                id={`hero-tab-${slide.id}`}
                aria-controls={`hero-slide-${slide.id}`}
                aria-selected={selected}
                aria-label={`Show slide ${slideIndex + 1}: ${slide.title}`}
                onClick={() => goTo(slideIndex)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  selected ? "w-7 bg-primary" : "w-2 bg-olive-200 hover:bg-olive-700/40"
                )}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-olive-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-olive-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Next slide"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setUserPaused((current) => !current)}
            className="ml-1 inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-olive-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={userPaused ? "Resume automatic slides" : "Pause automatic slides"}
            aria-pressed={userPaused}
          >
            {userPaused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
          </button>
          <p className="ml-1 text-xs font-medium tabular-nums text-muted-foreground" aria-live="polite">
            {index + 1} / {count}
          </p>
        </div>
      </div>
    </div>
  );
}
