"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { FilterPanel } from "@/components/filter-panel";
import { ProductCard } from "@/components/product-card";
import { SearchBar } from "@/components/search-bar";
import type { Product } from "@/lib/types";

export function ProductDirectory({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = [...new Set(products.map((product) => product.category))];

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedQuery ||
        [
          product.name,
          product.category,
          product.bestFor,
          product.nutrition,
          product.notes,
          ...product.ingredients,
          ...product.recipes,
          ...product.popularBrands,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory = category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [category, products, query]);

  return (
    <div className="flex flex-col gap-6">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search foods, recipes, nutrition notes, or brands"
      />
      <FilterPanel
        category={category}
        status="All"
        categories={categories}
        statuses={[]}
        onCategoryChange={setCategory}
        onStatusChange={() => undefined}
      />
      {filteredProducts.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState title="No products found" description="Try a different food, recipe, category, or brand." />
      )}
    </div>
  );
}
