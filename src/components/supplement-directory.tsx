"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";
import { ExternalLink, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { withAmazonAssociatesTag } from "@/lib/affiliate";
import type { AffiliateSupplement, ThirdPartyTestResult } from "@/lib/types";
import { cn } from "@/lib/utils";

const nutrientOptions = [
  {
    value: "vitamin-b12",
    label: "Vitamin B12",
    shortLabel: "B12",
    nutrients: ["vitamin-b12"],
    guideSlug: "vitamin-b12",
  },
  {
    value: "vitamin-d3",
    label: "Vitamin D3 & Calcium",
    shortLabel: "D3 & Ca",
    nutrients: ["vitamin-d3", "calcium"],
    guideSlug: "vitamin-d3",
  },
  {
    value: "algal-omega-3",
    label: "Omega-3",
    shortLabel: "Omega-3",
    nutrients: ["algal-omega-3"],
    guideSlug: "algal-omega-3",
  },
  {
    value: "iron",
    label: "Iron",
    shortLabel: "Iron",
    nutrients: ["iron"],
    guideSlug: "iron",
  },
  {
    value: "zinc",
    label: "Zinc",
    shortLabel: "Zinc",
    nutrients: ["zinc"],
    guideSlug: "zinc",
  },
  {
    value: "plant-protein",
    label: "Protein",
    shortLabel: "Protein",
    nutrients: ["plant-protein"],
    guideSlug: null,
  },
  {
    value: "creatine-monohydrate",
    label: "Creatine",
    shortLabel: "Creatine",
    nutrients: ["creatine-monohydrate"],
    guideSlug: "creatine-monohydrate",
  },
] as const;

type NutrientTabValue = (typeof nutrientOptions)[number]["value"];

const affiliateDisclosure = "As an Amazon Associate, we may earn from qualifying purchases.";
const failedResults = new Set(["Failed", "D"]);
const TAB_QUERY_KEY = "tab";

const productGroups = [
  {
    id: "verified",
    title: "Verified products",
    description: "Products with a matched third-party result that is not marked as failed.",
  },
  {
    id: "untested",
    title: "Untested products",
    description: "Products with no matching Trustified or Unbox Health result.",
  },
  {
    id: "failed",
    title: "Failed products",
    description: "Products with a failed Trustified result or a D rating from Unbox Health.",
  },
] as const;

type ProductGroupId = (typeof productGroups)[number]["id"];

function isNutrientTabValue(value: string | null): value is NutrientTabValue {
  return nutrientOptions.some((option) => option.value === value);
}

export function SupplementDirectory({ products }: { products: AffiliateSupplement[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const activeTab = useMemo(() => {
    const fromQuery = searchParams.get(TAB_QUERY_KEY);
    return isNutrientTabValue(fromQuery) ? fromQuery : nutrientOptions[0].value;
  }, [searchParams]);

  const setActiveTab = useCallback(
    (value: string | number | null) => {
      if (typeof value !== "string" || !isNutrientTabValue(value)) return;

      const params = new URLSearchParams(searchParams.toString());
      if (value === nutrientOptions[0].value) {
        params.delete(TAB_QUERY_KEY);
      } else {
        params.set(TAB_QUERY_KEY, value);
      }

      const query = params.toString();
      const href = query ? `${pathname}?${query}` : pathname;
      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-6">
      <div className="sticky top-16 z-20 -mx-1 rounded-2xl border border-olive-800 bg-olive-700 p-2 shadow-md sm:p-3">
        <p
          id="supplement-nutrient-label"
          className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-white"
        >
          Choose a nutrient
        </p>
        <div className="overflow-x-auto pb-0.5">
          <TabsList
            variant="line"
            aria-labelledby="supplement-nutrient-label"
            className="h-auto min-w-max gap-1.5 bg-transparent p-0 text-white group-data-horizontal/tabs:h-auto"
          >
            {nutrientOptions.map((nutrient) => (
              <TabsTrigger
                key={nutrient.value}
                value={nutrient.value}
                className={cn(
                  "h-auto rounded-xl border-2 border-white/30 !bg-white px-3.5 py-2.5 text-sm font-semibold !text-olive-800 shadow-none transition-colors",
                  "hover:!bg-olive-50 hover:!text-olive-800",
                  "data-active:!border-white/70 data-active:!bg-olive-800 data-active:!text-white data-active:shadow-sm",
                  "after:hidden",
                )}
              >
                <span className="sm:hidden">{nutrient.shortLabel}</span>
                <span className="hidden sm:inline">{nutrient.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>
      {nutrientOptions.map((nutrient) => {
        const nutrientKeys = nutrient.nutrients as readonly string[];
        const nutrientProducts = products.filter((product) =>
          nutrientKeys.includes(product.nutrient),
        );

        return (
          <TabsContent key={nutrient.value} value={nutrient.value}>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-1">
                  <h2 className="font-heading text-2xl font-semibold">{nutrient.label} supplements</h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Vegan or plant-based products found on Amazon India and checked against public
                    third-party test results.
                  </p>
                </div>
                {nutrient.guideSlug ? (
                  <Link
                    href={`/supplements/${nutrient.guideSlug}`}
                    className="shrink-0 text-sm font-medium text-primary underline decoration-primary/40 underline-offset-4 transition hover:decoration-primary"
                  >
                    Read the {nutrient.label} guide
                  </Link>
                ) : null}
              </div>
              <div className="rounded-lg border border-olive-200 bg-olive-50 px-4 py-3 text-sm leading-6">
                <p className="font-medium text-foreground">{affiliateDisclosure}</p>
                <p className="text-muted-foreground">
                  Testing may apply to a specific batch or formulation. Open the linked result before
                  relying on it.
                </p>
              </div>
              <div className="flex flex-col gap-8">
                {productGroups.map((group) => {
                  const groupedProducts = nutrientProducts.filter(
                    (product) => getProductGroup(product) === group.id,
                  );

                  return (
                    <section key={group.id} aria-labelledby={`${nutrient.value}-${group.id}`}>
                      <div className="mb-3">
                        <h3
                          id={`${nutrient.value}-${group.id}`}
                          className="font-heading text-lg font-semibold"
                        >
                          {group.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
                      </div>
                      {groupedProducts.length ? (
                        <SupplementProductList products={groupedProducts} />
                      ) : (
                        <p className="rounded-lg border border-dashed px-4 py-5 text-sm text-muted-foreground">
                          No {group.title.toLowerCase()} with a current exact Amazon India product
                          listing.
                        </p>
                      )}
                    </section>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

function SupplementProductList({ products }: { products: AffiliateSupplement[] }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border border-olive-200 bg-card md:block">
        <Table>
          <TableHeader className="bg-muted/60">
            <TableRow>
              <TableHead className="w-[34%] px-4">Product</TableHead>
              <TableHead className="w-[22%] px-4">Form and labelled dose</TableHead>
              <TableHead className="w-[15%] px-4">Trustified</TableHead>
              <TableHead className="w-[15%] px-4">Unbox Health</TableHead>
              <TableHead className="w-[14%] px-4 text-right">Buy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="px-4 py-4 whitespace-normal">
                  <ProductIdentity product={product} />
                </TableCell>
                <TableCell className="px-4 py-4 whitespace-normal">
                  <p className="font-medium text-foreground">{product.form}</p>
                  <p className="mt-1 leading-5 text-muted-foreground">{product.doseText}</p>
                </TableCell>
                <TableCell className="px-4 py-4 whitespace-normal">
                  <TestResult source="Trustified" result={product.trustified} />
                </TableCell>
                <TableCell className="px-4 py-4 whitespace-normal">
                  <TestResult source="Unbox Health" result={product.unboxHealth} />
                </TableCell>
                <TableCell className="px-4 py-4 text-right">
                  <AmazonButton product={product} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="grid gap-4 md:hidden">
        {products.map((product) => (
          <article
            key={product.id}
            className="flex flex-col gap-4 rounded-lg border border-olive-200 bg-card p-4"
          >
            <ProductIdentity product={product} />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-medium text-foreground">{product.form}</p>
                <p className="mt-1 leading-5 text-muted-foreground">{product.doseText}</p>
              </div>
              <div className="flex justify-end">
                <AmazonButton product={product} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t pt-4">
              <TestResult source="Trustified" result={product.trustified} />
              <TestResult source="Unbox Health" result={product.unboxHealth} />
            </div>
          </article>
        ))}
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        Product availability and formulations can change. The vegan evidence and marketplace source
        were last checked on the date stored with each product.
      </p>
    </>
  );
}

function ProductIdentity({ product }: { product: AffiliateSupplement }) {
  return (
    <div className="flex items-start gap-3">
      {product.imageUrl || product.imagePath ? (
        <div className="relative size-16 shrink-0 overflow-hidden rounded-md border bg-white">
          <Image
            src={product.imageUrl ?? product.imagePath ?? ""}
            alt={product.title}
            fill
            sizes="64px"
            className="object-contain p-1"
          />
        </div>
      ) : null}
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-xs font-medium uppercase text-primary">{product.brand}</p>
        <p className="font-heading text-base font-medium leading-6 text-foreground">
          {product.title}
        </p>
        <p className="text-xs leading-5 text-muted-foreground">{product.veganEvidence}</p>
      </div>
    </div>
  );
}

function getProductGroup(product: AffiliateSupplement): ProductGroupId {
  const results = [product.trustified, product.unboxHealth].filter(
    (result): result is ThirdPartyTestResult => Boolean(result),
  );

  if (results.some((result) => failedResults.has(result.result))) {
    return "failed";
  }

  return results.some((result) => result.status !== "pending") ? "verified" : "untested";
}

function TestResult({ source, result }: { source: string; result?: ThirdPartyTestResult }) {
  if (!result) {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-muted-foreground">{source}</p>
        <span className="text-sm text-muted-foreground">Not tested</span>
      </div>
    );
  }

  const statusLabel =
    result.status === "pending"
      ? "Listed, not rated"
      : result.status === "expired"
      ? "Previous result"
      : result.status === "historical"
        ? "Batch result"
        : "Current result";

  return (
    <div className="flex flex-col items-start gap-1.5">
      <p className="text-xs font-medium text-muted-foreground">{source}</p>
      <Badge variant={failedResults.has(result.result) ? "destructive" : "secondary"}>
        {result.result}
      </Badge>
      <a
        href={result.resultUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs font-medium text-primary underline decoration-primary/40 underline-offset-4"
      >
        <FlaskConical aria-hidden="true" />
        {statusLabel}
      </a>
      {result.expiresAt ? (
        <span className="text-[11px] leading-4 text-muted-foreground">Expired {result.expiresAt}</span>
      ) : null}
    </div>
  );
}

function AmazonButton({ product }: { product: AffiliateSupplement }) {
  return (
    <a
      href={withAmazonAssociatesTag(product.amazonUrl)}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      data-umami-event="Outbound Product Click"
      data-umami-event-product-id={product.id}
      data-umami-event-product-category={product.nutrient}
      data-umami-event-source-page="/shop/supplement"
      className={buttonVariants({ size: "sm" })}
    >
      Amazon
      <ExternalLink data-icon="inline-end" />
    </a>
  );
}
