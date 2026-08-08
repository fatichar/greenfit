"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { FilterPanel } from "@/components/filter-panel";
import { SearchBar } from "@/components/search-bar";
import { DeviceCard } from "@/components/device-card";
import type { Device } from "@/lib/types";

export function DeviceDirectory({ devices }: { devices: Device[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = [...new Set(devices.map((device) => device.category))];

  const filteredDevices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return devices.filter((device) => {
      const matchesSearch =
        !normalizedQuery ||
        [
          device.name,
          device.category,
          device.bestFor,
          device.whyItHelps,
          device.careNote,
          ...device.lookFor,
          ...device.bestForRecipes,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory = category === "All" || device.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [category, devices, query]);

  return (
    <div className="flex flex-col gap-6">
      <SearchBar value={query} onChange={setQuery} placeholder="Search blenders, juicers, prep, or cooking tools" />
      <FilterPanel
        category={category}
        status="All"
        categories={categories}
        statuses={[]}
        onCategoryChange={setCategory}
        onStatusChange={() => undefined}
      />
      {filteredDevices.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDevices.map((device) => (
            <DeviceCard key={device.slug} device={device} />
          ))}
        </div>
      ) : (
        <EmptyState title="No devices found" description="Try another device, use case, or recipe." />
      )}
    </div>
  );
}
