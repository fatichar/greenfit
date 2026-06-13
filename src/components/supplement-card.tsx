import Link from "next/link";
import Image from "next/image";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupplementImage } from "@/lib/images";
import type { Supplement } from "@/lib/types";

export function SupplementCard({ supplement }: { supplement: Supplement }) {
  return (
    <Link href={`/supplements/${supplement.slug}`}>
      <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
        <Image
          src={getSupplementImage(supplement.slug)}
          alt=""
          width={900}
          height={675}
          className="aspect-[16/9] w-full object-cover"
        />
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={supplement.status} />
            <ConfidenceBadge confidence={supplement.confidence} />
          </div>
          <CardTitle>{supplement.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {supplement.brand} - {supplement.category}
          </p>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground">
          <p>Form: {supplement.form}</p>
          <p>Dose: {supplement.dose}</p>
          <p>Third-party tested: {supplement.thirdPartyTested}</p>
          <p>Heavy metal report: {supplement.heavyMetalReport}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
