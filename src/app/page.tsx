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
    title: "Choose a plan, or build your own",
    body: "Start with an example plan or build one around your goals, routine, and budget. You don’t need to spend thousands on a personalised diet plan.",
    image: "/images/homepage-hero-2.jpg",
    imageAlt: "High-protein plant-based meal prep with dal-rice, tofu stir-fry, chilla, and chickpea salad",
    primaryCta: { href: "/diet-plans", label: "Explore diet plans" },
    secondaryCta: { href: "/diet-plans/build", label: "Build my diet plan" },
  },
  {
    id: "nutrients",
    title: "Protein, B12, and the nutrients worth watching",
    body: "Get sensible protein ranges and clear notes on B12, iron, omega-3, calcium, and vitamin D. Start with food; add supplements when they solve a real gap.",
    image: "/images/greenfit-hero.jpg",
    imageAlt: "Plant protein foods with dal, chana, tofu, greens, plant milk, and supplements",
    primaryCta: { href: "/guides", label: "Read guides" },
  },
  {
    id: "recipes",
    title: "Recipes for a normal kitchen",
    body: "Plant-based Indian meals and snacks, including poha, dal, tofu, chilla, and more, that fit into a real week.",
    image: "/images/homepage-hero-3.jpg",
    imageAlt: "Plant-based breakfast spread with vegetable poha, tofu scramble, chia pudding, and plant milk",
    primaryCta: { href: "/recipes", label: "View recipes" },
  },
  {
    id: "shop",
    title: "Products worth a closer look",
    body: "Compare supplements, kitchen devices, fitness gear, and books with notes on what to check before you buy.",
    image: "/images/shop/kitchen-devices/plant-based-kitchen-devices.png",
    imageAlt: "Plant-based kitchen devices with blender, juicer, pressure cooker, and fresh produce",
    primaryCta: { href: "/shop", label: "Explore products" },
    secondaryCta: { href: "/shop/supplement", label: "Compare supplements" },
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
  "Plans you can use",
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
      "Example plans for different goals, budgets, and regional preferences.",
    icon: ClipboardList,
    cta: "Browse plans",
  },
  {
    href: "/diet-plans/build",
    title: "Build my diet plan",
    description:
      "Set targets from your details, then build meals from plant-based Indian recipes.",
    icon: Sparkles,
    cta: "Start building",
  },
  {
    href: "/guides",
    title: "Guides",
    description:
      "Short explainers on protein, B12, iron, omega-3, bone health, and dairy swaps.",
    icon: BookOpen,
    cta: "Read guides",
  },
  {
    href: "/recipes",
    title: "Recipes",
    description:
      "Meals and snacks built around dals, soy foods, grains, and familiar spices.",
    icon: UtensilsCrossed,
    cta: "View recipes",
  },
  {
    href: "/shop/supplement",
    title: "Supplements",
    description:
      "Notes on dosage, timing, cautions, and when food alone may not cover the need.",
    icon: FlaskConical,
    cta: "Compare types",
  },
  {
    href: "/tools#protein",
    title: "Tools",
    description:
      "Protein, calorie, macro, fiber, and plate estimators for rough planning, not prescriptions.",
    icon: Calculator,
    cta: "Open tools",
  },
];

const principles = [
  {
    title: "Start with the decision",
    body: "Each page begins with a question you can act on: what to eat this week, which nutrient to prioritise, or whether a supplement is worth considering.",
  },
  {
    title: "Food first, supplements in context",
    body: "Plans lean on dals, chana, soy foods, grains, and vegetables. Supplements come in where evidence or common shortfalls make them relevant.",
  },
  {
    title: "Honest about uncertainty",
    body: "When research is mixed or needs vary, we say so. Estimates and example plans are starting points, not medical advice.",
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
          <h2 className="font-heading text-3xl font-semibold leading-tight">A better way to plan meals</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Start with a full meal plan or answer one nutrition question. Choose whatever is useful today.
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
            <h2 className="font-heading text-3xl font-semibold leading-tight">Made for real decisions</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              GreenFit is organised around the decisions people make: choosing meals, checking nutrients, and deciding
              when supplements are worth considering.
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
            <p className="text-sm font-medium text-primary">Meal planning tool</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold leading-tight">Build a plan for your week</h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">
              Enter your height, weight, goal, and routine. Get calorie and protein targets, then fill your day with
              recipes that suit Indian kitchens and grocery budgets.
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-muted-foreground">
              {[
                "Targets based on your details, with room to adjust",
                "Meals from dals, tofu, chana, millets, and familiar recipes",
                "Saved on this device so you can come back and refine it",
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
            <h2 className="font-heading text-2xl font-semibold">Ready to plan your next meals?</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Build a plan, browse examples, or open a guide when you want the detail behind a nutrient.
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
