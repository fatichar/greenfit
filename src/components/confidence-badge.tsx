import { Badge } from "@/components/ui/badge";
import type { Confidence } from "@/lib/types";

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return <Badge variant="secondary">{confidence} confidence</Badge>;
}
