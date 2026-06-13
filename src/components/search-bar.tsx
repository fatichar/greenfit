import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value?: string;
  onChange?: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-xl border-olive-200 bg-white pl-11 shadow-sm"
      />
    </label>
  );
}
