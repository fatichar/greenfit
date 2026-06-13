import type { Metadata } from "next";
import { ProductDirectory } from "@/components/product-directory";
import { products } from "@/lib/data";

export const metadata: Metadata = {
  title: "Product Checker",
  description: "Search static product checks with suitability status, confidence, notes, and ingredient concerns.",
};

export default function ProductsPage() {
  return (
    <PageShell
      title="Product checker"
      description="Review product suitability using label notes, confidence levels, and source-dependent ingredient flags."
    >
      <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
        Barcode scan coming later. This MVP uses static label reviews and local sample data.
      </p>
      <ProductDirectory products={products} />
    </PageShell>
  );
}

function PageShell({ title, description, children }: React.PropsWithChildren<{ title: string; description: string }>) {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="font-heading text-4xl font-semibold">{title}</h1>
        <p className="mt-3 text-lg leading-8 text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}
