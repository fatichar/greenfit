import Link from "next/link";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { HeroCarousel, type HeroSlide } from "@/components/hero-carousel";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const heroSlides: HeroSlide[] = [
  {
    id: "plans",
    title: "Choose a diet plan—or build your own",
    body: "Browse ready-made plans for common goals, or build one around your targets and routine. You don’t need to spend thousands on a personalised diet plan.",
    image: "/images/homepage-hero-2.jpg",
    imageAlt: "High-protein plant-based meal prep with dal-rice, tofu stir-fry, chilla, and chickpea salad",
    primaryCta: { href: "/diet-plans", label: "Explore diet plans" },
    secondaryCta: { href: "/diet-plans/build", label: "Build my diet plan" },
  },
  {
    id: "nutrients",
    title: "Protein—and the nutrients worth watching",
    body: "Clear protein ranges from everyday plant foods, plus practical notes on B12, iron, omega-3, calcium, and vitamin D. Food first; supplements only where they help.",
    image: "/images/greenfit-hero.jpg",
    imageAlt: "Plant protein foods with dal, chana, tofu, greens, plant milk, and supplements",
    primaryCta: { href: "/guides", label: "Read guides" },
  },
  {
    id: "recipes",
    title: "Recipes that fit a normal kitchen",
    body: "Simple plant-based Indian meals and snacks—poha, dal, tofu, chilla, and more—you can rotate into a real week.",
    image: "/images/homepage-hero-3.jpg",
    imageAlt: "Plant-based breakfast spread with vegetable poha, tofu scramble, chia pudding, and plant milk",
    primaryCta: { href: "/recipes", label: "View recipes" },
  },
  {
    id: "affordable",
    title: "Good planning doesn’t need a big budget",
    body: "GreenFit is free to use. Plans lean on dals, chana, soy foods, and market staples—not boutique products or paid coaching packages.",
    image: "/images/items/diet-plans/budget-diet.jpg",
    imageAlt: "Affordable plant-based Indian meals built from everyday staples",
    primaryCta: { href: "/diet-plans/build", label: "Start with a free plan" },
    secondaryCta: { href: "/diet-plans", label: "Browse free plans" },
  },
];

export const metadata: Metadata = {
  title: "GreenFit | Nutrition, made practical",
  description:
    "Plant-based diet plans, evidence-based guides, recipes, and nutrition tools for everyday Indian eating.",
  keywords: [
    "practical nutrition",
    "vegan diet plans",
    "WFPB",
    "plant based diet",
    "vegan products",
    "nutrition guides",
    "veganism",
    "build diet plan",
  ],
  openGraph: {
    title: "GreenFit | Nutrition, made practical",
    description:
      "Plant-based diet plans, evidence-based guides, recipes, and nutrition tools for everyday Indian eating.",
    url: "https://greenfit.in",
    siteName: "GreenFit",
    type: "website",
  },
};

const trustItems = [
  "Evidence-based guides",
  "Indian everyday foods",
  "Clear, practical plans",
];

const features: Array<{
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  cta: string;
}> = [
  {
    href: "/diet-plans",
    title: "Diet plans",
    description:
      "Ready-made example plans for protein, weight goals, budgets, and regional styles.",
    icon: ClipboardList,
    cta: "Browse plans",
  },
  {
    href: "/diet-plans/build",
    title: "Build my diet plan",
    description:
      "Set targets from your details, then assemble meals from plant-based Indian recipes.",
    icon: Sparkles,
    cta: "Start building",
  },
  {
    href: "/guides",
    title: "Guides",
    description:
      "Concise explainers on protein, B12, iron, omega-3, bone health, and dairy swaps.",
    icon: BookOpen,
    cta: "Read guides",
  },
  {
    href: "/recipes",
    title: "Recipes",
    description:
      "Simple meals and snacks you can cook from dals, soy foods, grains, and spices you already know.",
    icon: UtensilsCrossed,
    cta: "View recipes",
  },
  {
    href: "/supplements",
    title: "Supplements",
    description:
      "Type-by-type notes on dosage, timing, cautions, and when food alone may not be enough.",
    icon: FlaskConical,
    cta: "Compare types",
  },
  {
    href: "/tools#protein",
    title: "Tools",
    description:
      "Protein, calorie, macro, fiber, and plate estimators to support planning—not prescriptions.",
    icon: Calculator,
    cta: "Open tools",
  },
];

const principles = [
  {
    title: "Decide first, then dig deeper",
    body: "Each page answers a practical question: what to eat this week, which nutrient to prioritise, or whether a supplement is worth considering.",
  },
  {
    title: "Food first, supplements in context",
    body: "Plans lean on dals, chana, soy foods, grains, and vegetables. Supplements are explained where evidence or common shortfalls matter.",
  },
  {
    title: "Honest about uncertainty",
    body: "When research is mixed or individual needs vary, we say so. Estimates and example plans are starting points, not medical advice.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="border-b bg-[linear-gradient(180deg,#ffffff_0%,#f4fbef_100%)]">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pt-16">
          <p className="hidden text-sm font-medium tracking-wide text-primary sm:block">
            Plant-based nutrition for everyday Indian eating
          </p>
          <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-tight text-foreground sm:mt-3 sm:text-5xl lg:text-6xl">
            Nutrition, made practical
          </h1>
        </div>
        <HeroCarousel slides={heroSlides} />
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-olive-200/70 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CheckCircle2 className="size-4 text-primary" />
                {item}
              </div>
            ))}
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            data-umami-event="CTA Click"
            data-umami-event-cta="About GreenFit (Trust Banner)"
          >
            Why GreenFit
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-semibold leading-tight">Everything you need to plan meals well</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            From a full custom plan to a single nutrient question—pick the path that matches what you need today.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((item) => (
            <FeatureCard key={item.href} {...item} />
          ))}
        </div>
      </section>

      <section className="border-y bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
          <div className="max-w-md">
            <h2 className="font-heading text-3xl font-semibold leading-tight">Built for real decisions</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              GreenFit is organised around what people actually do: choose meals, check nutrients, and decide when
              supplements matter. Less catalog clutter, more clarity.
            </p>
          </div>
          <div className="grid gap-6">
            {principles.map((item, index) => (
              <div key={item.title} className="flex gap-4 border-t border-border pt-5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mint-100 text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#f4fbef_0%,#ffffff_100%)]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-medium text-primary">Personal planning tool</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold leading-tight">Build a plan around your week</h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">
              Enter height, weight, goal, and routine. Get calorie and protein targets, then fill breakfast through
              dinner with recipes that fit Indian kitchens and grocery budgets.
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-muted-foreground">
              {[
                "Targets suggested from your details—adjustable if you prefer",
                "Meals from dals, tofu, chana, millets, and familiar recipes",
                "Saved on this device so you can refine over time",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/diet-plans/build"
              className={cn(buttonVariants({ size: "lg" }), "mt-8 w-full sm:w-auto")}
              data-umami-event="CTA Click"
              data-umami-event-cta="Build My Diet Plan (Feature)"
            >
              Build my diet plan
              <ArrowRight data-icon="inline-end" />
            </Link>
          </div>
          <div className="rounded-xl border border-olive-200 bg-card p-6 shadow-sm sm:p-8">
            <div className="grid gap-4">
              {[
                ["Step 1", "Your details and goal"],
                ["Step 2", "Calorie, protein, and fiber targets"],
                ["Step 3", "Build meals recipe by recipe"],
                ["Step 4", "Review, refine, and print"],
              ].map(([step, label]) => (
                <div key={step} className="flex items-center gap-4 rounded-lg border bg-muted/40 px-4 py-3">
                  <span className="text-xs font-semibold tracking-wide text-primary uppercase">{step}</span>
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-4 rounded-xl border border-olive-200 bg-olive-50/50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="font-heading text-2xl font-semibold">Ready to plan better meals?</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Start with a custom plan, browse ready examples, or open a guide when you need the detail behind a nutrient.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/diet-plans/build"
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
              data-umami-event="CTA Click"
              data-umami-event-cta="Build My Diet Plan (Footer)"
            >
              Build my diet plan
              <ArrowRight data-icon="inline-end" />
            </Link>
            <Link
              href="/guides"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto")}
              data-umami-event="CTA Click"
              data-umami-event-cta="Read Guides (Footer)"
            >
              Read guides
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  href,
  title,
  description,
  icon: Icon,
  cta,
}: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-xl border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
      data-umami-event="CTA Click"
      data-umami-event-cta={title}
    >
      <div className="flex size-11 items-center justify-center rounded-lg bg-mint-100 text-primary">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-5 font-heading text-xl font-semibold leading-snug group-hover:text-primary">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{description}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        {cta}
        <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
