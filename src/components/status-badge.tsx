import { Badge } from "@/components/ui/badge";
import type { Status } from "@/lib/types";

const statusTone: Record<Status, string> = {
  Suitable: "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Likely suitable": "border-lime-200 bg-lime-50 text-lime-800",
  Unclear: "border-amber-200 bg-amber-50 text-amber-800",
  "Likely unsuitable": "border-orange-200 bg-orange-50 text-orange-800",
  Unsuitable: "border-rose-200 bg-rose-50 text-rose-800",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge variant="outline" className={statusTone[status]}>
      {status}
    </Badge>
  );
}
