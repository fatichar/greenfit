import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  HeartHandshake,
  Leaf,
  Scale,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { DisclaimerBox } from "@/components/disclaimer-box";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "GreenFit helps people adopt practical plant-based nutrition using evidence, accessible Indian foods, and transparent planning tools.",
  keywords: [
    "about GreenFit",
    "plant based nutrition mission",
    "vegan education",
    "WFPB evidence",
    "vegan diet planning",
  ],
};

const pillars = [
  {
    title: "Evidence with context",
    description:
      "Guides cite sources and note limits. We prefer practical ranges and caveats over absolute claims.",
    icon: Scale,
  },
  {
    title: "Accessible Indian foods",
    description:
      "Plans centre dals, chana, soy foods, millets, grains, vegetables, nuts, and realistic dairy swaps.",
    icon: Leaf,
  },
  {
    title: "Decisions, not noise",
    description:
      "Each section exists to help you choose meals, targets, or supplements—not to sell a lifestyle brand.",
    icon: HeartHandshake,
  },
];

const offerings = [
  {
    href: "/diet-plans",
    title: "Diet plans",
    description: "Example day structures for common goals, budgets, and regional preferences.",
    icon: ClipboardList,
  },
  {
    href: "/diet-plans/build",
    title: "Build my diet plan",
    description: "A personal planner that suggests targets and lets you fill meals with recipes.",
    icon: Sparkles,
  },
  {
    href: "/guides",
    title: "Guides",
    description: "Nutrient and food explainers: protein, B12, iron, zinc, omega-3, bone health, dairy swaps.",
    icon: BookOpen,
  },
  {
    href: "/recipes",
    title: "Recipes",
    description: "Simple plant-based Indian meals you can rotate into a weekly routine.",
    icon: UtensilsCrossed,
  },
  {
    href: "/supplements",
    title: "Supplements",
    description: "Type-level notes on when a supplement is commonly considered, dosage context, and cautions.",
    icon: FlaskConical,
  },
  {
    href: "/tools#protein",
    title: "Tools",
    description: "Protein, calorie, macro, fiber, BMI, and plate estimators for rough planning.",
    icon: Calculator,
  },
];

const principles = [
  "Lead with short, usable recommendations before long explanations.",
  "Prefer food patterns people can cook with Indian staples and markets.",
  "State when evidence is mixed, limited, or highly individual.",
  "Treat supplements as tools for specific gaps—not as the foundation of a diet.",
  "Keep calculators and plans as estimates; they are not personalised medical care.",
  "Avoid fear-based messaging and miracle claims.",
];

const whoFor = [
  "People exploring or refining a vegetarian or vegan diet in India",
  "Anyone who wants higher protein or clearer structure without fad protocols",
  "Home cooks who prefer dals, tofu, chana, millets, and familiar recipes",
  "Readers who want sources and nuance, not influencer certainty",
];

const whoNot = [
  "Medical diagnosis, disease treatment, or meal plans for clinical conditions",
  "Eating disorder care or highly restrictive therapeutic diets",
  "One-size prescriptions for children, pregnancy, or complex medication needs",
  "A replacement for a doctor or registered dietitian when you need individual care",
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="border-b bg-[linear-gradient(180deg,#ffffff_0%,#f4fbef_100%)]">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-medium tracking-wide text-primary">About GreenFit</p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold leading-tight sm:text-5xl">
            Practical plant-based nutrition, without the extremes
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            GreenFit exists to make everyday plant-based eating clearer: realistic diet plans, evidence-aware guides,
            useful tools, and Indian foods you can actually cook. We focus on decisions you face this week—not abstract
            ideology.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/diet-plans/build" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
              Build my diet plan
              <ArrowRight data-icon="inline-end" />
            </Link>
            <Link
              href="/guides"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto")}
            >
              Browse guides
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-semibold">What we stand for</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          Three commitments shape the site. Everything else is in service of them.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex size-11 items-center justify-center rounded-lg bg-mint-100 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 font-heading text-xl font-semibold">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y bg-white">
        <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-semibold">What you will find here</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            GreenFit is a small set of focused tools and references—not a social feed.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {offerings.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex gap-4 rounded-xl border bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-olive-50 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading text-lg font-semibold group-hover:text-primary">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl font-semibold">How we work</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Editorial habits matter as much as topics. These rules keep the content useful and restrained.
            </p>
            <ul className="mt-6 grid gap-3">
              {principles.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="font-heading text-xl font-semibold">Who it is for</h3>
              <ul className="mt-4 grid gap-3">
                {whoFor.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="font-heading text-xl font-semibold">What it is not</h3>
              <ul className="mt-4 grid gap-3">
                {whoNot.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-olive-50/40">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="font-heading text-3xl font-semibold">A note on trust</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Nutrition is personal. Formulas, example plans, and product notes cannot replace clinical judgement.
              GreenFit is general education for adults interested in plant-forward eating. If you have a medical
              condition, take medication, are pregnant, feeding a child, or recovering from disordered eating, work with
              a qualified professional.
            </p>
          </div>
          <DisclaimerBox />
          <div className="flex flex-col gap-4 rounded-xl border border-olive-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-heading text-xl font-semibold">Start with something useful</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Build a plan, read a guide, or open a calculator—whatever matches your next decision.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/diet-plans" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
                Diet plans
                <ArrowRight data-icon="inline-end" />
              </Link>
              <Link
                href="/tools"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto")}
              >
                Tools
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
