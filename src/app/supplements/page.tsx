import type { Metadata } from "next";
import { Suspense } from "react";
import { SupplementDirectory } from "@/components/supplement-directory";
import { affiliateSupplements } from "@/lib/data";

export const metadata: Metadata = {
  title: "Vegan Supplement Products",
  description: "Compare vegan supplement products sold on Amazon India with available Trustified and Unbox Health test results.",
  keywords: [
    "vegan supplements",
    "plant based protein",
    "vegan B12",
    "vegan omega 3",
    "plant based supplements",
    "vegan D3",
    "vegetarian supplements",
    "vegan calcium",
    "plant protein powder",
  ],
};

export default function SupplementsPage() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="font-heading text-4xl font-semibold">Supplements</h1>
        <p className="mt-3 text-lg leading-8 text-muted-foreground">
          Choose a nutrient and compare vegan supplement products available from Amazon India, with independent testing results where available.
        </p>
      </div>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl border border-olive-200 bg-muted/40" />}>
        <SupplementDirectory products={affiliateSupplements} />
      </Suspense>
    </section>
  );
}
