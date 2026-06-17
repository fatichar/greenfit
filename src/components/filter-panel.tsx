"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FilterPanel({
  category,
  status,
  categories,
  statuses,
  onCategoryChange,
  onStatusChange,
}: {
  category: string;
  status: string;
  categories: string[];
  statuses: string[];
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}) {
  return (
    <div className={`grid gap-3 rounded-xl border bg-card p-4 ${statuses.length ? "md:grid-cols-2" : ""}`}>
      <div className="flex flex-col gap-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={(value) => onCategoryChange(value ?? "All")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="All">All categories</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {statuses.length ? (
        <div className="flex flex-col gap-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(value) => onStatusChange(value ?? "All")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="All">All statuses</SelectItem>
                {statuses.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      ) : null}
    </div>
  );
}
