import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Search } from "lucide-react";
import { DietPlanCard } from "@/components/diet-plan-card";
import { GuideCard } from "@/components/guide-card";
import { ProductCard } from "@/components/product-card";
import { SupplementCard } from "@/components/supplement-card";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dietPlans, getGuides, products, supplements } from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "GreenFit | Nutrition, made practical",
  description:
    "Diet plans, supplement reviews, product checks, and evidence-based guides for everyday eating.",
  openGraph: {
    title: "GreenFit | Nutrition, made practical",
    description:
      "Diet plans, supplement reviews, product checks, and evidence-based guides for everyday eating.",
    url: "https://greenfit.in",
    siteName: "GreenFit",
    type: "website",
  },
};

const trustItems = ["Evidence-based", "Practical foods", "Clear product status", "No medical advice"];

export default function Home() {
  const guides = getGuides();

  return (
    <div className="flex flex-col">
      <section className="border-b bg-[radial-gradient(circle_at_top_left,#d3fae7_0,#fcfff7_38%,#ffffff_72%)]">
        <div className="mx-auto grid w-full min-w-0 max-w-7xl items-start gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div className="flex min-w-0 flex-col gap-7 lg:pt-10">
            <div className="flex flex-col gap-5">
              <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
                <span className="block">Nutrition, made</span>
                <span className="block">practical</span>
              </h1>
              <p className="max-w-full break-words text-base leading-8 text-muted-foreground sm:max-w-2xl sm:text-lg">
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
              className="flex min-h-14 w-full max-w-2xl min-w-0 items-center gap-3 rounded-xl border border-olive-200 bg-white px-4 text-sm font-medium text-muted-foreground shadow-sm transition hover:border-primary/50 hover:text-foreground"
            >
              <Search className="size-4" />
              <span className="truncate">Search products, supplements, ingredients, or guides</span>
            </Link>
          </div>
          <div className="grid min-w-0 gap-4">
            <div className="w-full max-w-full overflow-hidden rounded-xl border border-olive-200 bg-white shadow-sm">
              <Image
                src="/images/greenfit-hero.png"
                alt="Practical nutrition foods and product label checking"
                width={1200}
                height={900}
                priority
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <Card className="w-full max-w-full border-olive-200 bg-white/95 shadow-sm">
              <CardHeader>
                <CardTitle>Product checker preview</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {products.slice(0, 2).map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        {trustItems.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-xl border border-olive-200 bg-white p-4 shadow-sm">
            <CheckCircle2 className="size-5 text-primary" />
            <span className="text-sm font-medium">{item}</span>
          </div>
        ))}
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        <VisualLink
          href="/diet-plans"
          image="/images/diet-plans-preview.png"
          title="Diet plans built around real meals"
          description="High-protein plates, budget options, substitutions, and simple macros."
        />
        <VisualLink
          href="/products"
          image="/images/product-checker-preview.png"
          title="Product checks with ingredient context"
          description="Status, confidence, source-dependent flags, and label review notes."
        />
        <VisualLink
          href="/supplements"
          image="/images/supplements-preview.png"
          title="Supplement comparisons with clear caveats"
          description="Dose, form, testing status, lab report placeholders, and practical notes."
        />
      </section>
      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeader title="Featured diet plans" href="/diet-plans" />
        <div className="grid gap-4 lg:grid-cols-3">
          {dietPlans.slice(0, 3).map((plan) => (
            <DietPlanCard key={plan.slug} plan={plan} />
          ))}
        </div>
      </section>
      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeader title="Featured supplement reviews" href="/supplements" />
        <div className="grid gap-4 lg:grid-cols-3">
          {supplements.slice(0, 3).map((supplement) => (
            <SupplementCard key={supplement.slug} supplement={supplement} />
          ))}
        </div>
      </section>
      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 pb-16 sm:px-6 lg:px-8">
        <SectionHeader title="Popular guides" href="/guides" />
        <div className="grid gap-4 md:grid-cols-3">
          {guides.slice(0, 3).map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="font-heading text-2xl font-semibold">{title}</h2>
      <Link href={href} className={cn(buttonVariants({ variant: "ghost" }), "shrink-0")}>
        View all
        <ArrowRight data-icon="inline-end" />
      </Link>
    </div>
  );
}

function VisualLink({
  href,
  image,
  title,
  description,
}: {
  href: string;
  image: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-xl border border-olive-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <Image src={image} alt="" width={900} height={675} className="aspect-[16/9] w-full object-cover" />
      <div className="grid gap-2 p-4">
        <h3 className="font-heading text-base font-semibold leading-snug group-hover:text-primary">{title}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
