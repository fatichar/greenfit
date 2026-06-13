"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { FilterPanel } from "@/components/filter-panel";
import { ProductCard } from "@/components/product-card";
import { SearchBar } from "@/components/search-bar";
import type { Product } from "@/lib/types";

const statuses = ["Suitable", "Likely suitable", "Unclear", "Likely unsuitable", "Unsuitable"];

export function ProductDirectory({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const categories = [...new Set(products.map((product) => product.category))];

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedQuery ||
        [product.name, product.brand, product.category, product.notes, ...product.ingredients]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory = category === "All" || product.category === category;
      const matchesStatus = status === "All" || product.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [category, products, query, status]);

  return (
    <div className="flex flex-col gap-6">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search products, ingredients, brands, or notes"
      />
      <FilterPanel
        category={category}
        status={status}
        categories={categories}
        statuses={statuses}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
      />
      {filteredProducts.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState title="No products found" description="Try a different ingredient, category, or status." />
      )}
    </div>
  );
}
