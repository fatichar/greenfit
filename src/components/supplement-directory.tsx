"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { FilterPanel } from "@/components/filter-panel";
import { SearchBar } from "@/components/search-bar";
import { SupplementCard } from "@/components/supplement-card";
import type { Supplement } from "@/lib/types";

const statuses = ["Suitable", "Likely suitable", "Unclear", "Likely unsuitable", "Unsuitable"];

export function SupplementDirectory({ supplements }: { supplements: Supplement[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const categories = [...new Set(supplements.map((supplement) => supplement.category))];

  const filteredSupplements = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return supplements.filter((supplement) => {
      const matchesSearch =
        !normalizedQuery ||
        [supplement.name, supplement.brand, supplement.category, supplement.form, supplement.notes]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory = category === "All" || supplement.category === category;
      const matchesStatus = status === "All" || supplement.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [category, query, status, supplements]);

  return (
    <div className="flex flex-col gap-6">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search supplements, nutrients, forms, or brands"
      />
      <FilterPanel
        category={category}
        status={status}
        categories={categories}
        statuses={statuses}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
      />
      {filteredSupplements.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredSupplements.map((supplement) => (
            <SupplementCard key={supplement.slug} supplement={supplement} />
          ))}
        </div>
      ) : (
        <EmptyState title="No supplements found" description="Try another nutrient, category, or status." />
      )}
    </div>
  );
}
