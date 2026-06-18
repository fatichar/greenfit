import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BookOpen, Calculator, CheckCircle2, ClipboardList, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "GreenFit | Nutrition, made practical",
  description:
    "Plant-based diet plans, vegan supplement reviews, product checks, and evidence-based WFPB guides for everyday eating.",
  keywords: [
    "practical nutrition",
    "vegan diet plans",
    "WFPB",
    "plant based diet",
    "vegan products",
    "nutrition guides",
    "veganism",
  ],
  openGraph: {
    title: "GreenFit | Nutrition, made practical",
    description:
      "Plant-based diet plans, vegan supplement reviews, product checks, and evidence-based WFPB guides for everyday eating.",
    url: "https://greenfit.in",
    siteName: "GreenFit",
    type: "website",
  },
};

const trustItems = ["Evidence-based", "Practical foods", "Clear product status"];

const pathways: Array<{
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    href: "/diet-plans",
    title: "Build a diet plan",
    description: "Start with real meals, macros, substitutions, and budget-friendly options.",
    icon: ClipboardList,
  },
  {
    href: "/products",
    title: "Check a product",
    description: "Review ingredient context and status notes without the noisy label guessing.",
    icon: Search,
  },
  {
    href: "/guides",
    title: "Read a practical guide",
    description: "Use concise explainers for nutrients, planning, and everyday food choices.",
    icon: BookOpen,
  },
];

const quietPrinciples = [
  "Short recommendations before long explanations.",
  "Clear caveats when evidence is incomplete.",
  "Food-first planning, with supplements kept in context.",
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="border-b bg-[linear-gradient(180deg,#ffffff_0%,#f4fbef_100%)]">
        <div className="mx-auto grid w-full min-w-0 max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-20">
          <div className="flex min-w-0 flex-col gap-8">
            <div className="flex flex-col gap-6">
              <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                <span className="block">Nutrition, made</span>
                <span className="block">practical</span>
              </h1>
              <p className="max-w-full break-words text-base leading-8 text-muted-foreground sm:max-w-xl sm:text-lg">
                Diet plans, supplement reviews, product checks, and evidence-based guides for everyday eating.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/diet-plans" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
                Explore Diet Plans
                <ArrowRight data-icon="inline-end" />
              </Link>
              <Link href="/products" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}>
                Check Products
              </Link>
            </div>
            <Link
              href="/products"
              className="flex min-h-14 w-full max-w-xl min-w-0 items-center gap-3 rounded-lg border border-olive-200 bg-white px-4 text-sm font-medium text-muted-foreground shadow-sm transition hover:border-primary/50 hover:text-foreground"
            >
              <Search className="size-4" />
              <span className="truncate">Search products, supplements, ingredients, or guides</span>
            </Link>
          </div>
          <div className="min-w-0 md:pl-2 lg:pl-6">
            <div className="w-full max-w-full overflow-hidden rounded-lg border border-olive-200 bg-white shadow-sm">
              <Image
                src="/images/diet-plans-preview.jpg"
                alt="Prepared practical meals with grains, dal, salad, and tofu"
                width={1200}
                height={900}
                loading="eager"
                className="aspect-[16/11] w-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 pb-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CheckCircle2 className="size-4 text-primary" />
                {item}
              </div>
            ))}
          </div>
          <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <Calculator className="size-4" />
            Try nutrition tools
          </Link>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.55fr_1fr] lg:px-8 lg:py-20">
        <div className="max-w-md">
          <h2 className="font-heading text-3xl font-semibold leading-tight">Start with one job.</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Choose the task you came for, then go deeper only when the details matter.
          </p>
        </div>
        <div className="divide-y divide-border border-y">
          {pathways.map((item) => (
            <PathwayLink key={item.href} {...item} />
          ))}
        </div>
      </section>

      <section className="border-y bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-semibold leading-tight">Less catalog, more clarity.</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              GreenFit is organized around decisions: what to eat, when a product looks reasonable, and where supplements
              may or may not help. Each section points to a real decision instead of filling space.
            </p>
          </div>
          <div className="grid gap-4">
            {quietPrinciples.map((item) => (
              <div key={item} className="flex gap-3 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-4 border-l-4 border-primary pl-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold">Ready to plan a meal?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Start with the diet plans, then use guides and product checks only when you need the detail.
            </p>
          </div>
          <Link href="/diet-plans" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
            Explore Diet Plans
            <ArrowRight data-icon="inline-end" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function PathwayLink({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Link href={href} className="group grid gap-4 py-6 transition hover:bg-muted/40 sm:grid-cols-[2.5rem_1fr_auto] sm:px-4">
      <div className="flex size-10 items-center justify-center rounded-lg bg-mint-100 text-primary">
        <Icon className="size-5" />
      </div>
      <div>
        <h3 className="font-heading text-xl font-semibold leading-snug group-hover:text-primary">{title}</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="hidden size-5 self-center text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary sm:block" />
    </Link>
  );
}
