"use client";

import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { FilterPanel } from "@/components/filter-panel";
import { SearchBar } from "@/components/search-bar";
import { SupplementCard } from "@/components/supplement-card";
import { trackEvent } from "@/lib/analytics";
import type { Supplement } from "@/lib/types";

export function SupplementDirectory({ supplements }: { supplements: Supplement[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = [...new Set(supplements.map((supplement) => supplement.category))];

  useEffect(() => {
    if (!query) return;

    const timeout = setTimeout(() => {
      trackEvent("Search Used", { type: "supplement" });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [query]);

  const filteredSupplements = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return supplements.filter((supplement) => {
      const matchesSearch =
        !normalizedQuery ||
        [supplement.name, supplement.category, supplement.form, supplement.dose, supplement.notes, ...supplement.popularBrands]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory = category === "All" || supplement.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [category, query, supplements]);

  return (
    <div className="flex flex-col gap-6">
      <SearchBar value={query} onChange={setQuery} placeholder="Search supplement types, dosage notes, forms, or brands" />
      <FilterPanel category={category} status="All" categories={categories} statuses={[]} onCategoryChange={setCategory} onStatusChange={() => undefined} />
      {filteredSupplements.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredSupplements.map((supplement) => <SupplementCard key={supplement.slug} supplement={supplement} />)}
        </div>
      ) : (
        <EmptyState title="No supplements found" description="Try another nutrient, category, form, or brand." />
      )}
    </div>
  );
}
