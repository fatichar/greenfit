import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupplementImage } from "@/lib/images";
import type { Supplement } from "@/lib/types";

export function SupplementCard({ supplement }: { supplement: Supplement }) {
  return (
    <Link href={`/supplements/${supplement.slug}`}>
      <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
        <Image src={getSupplementImage(supplement.slug)} alt="" width={900} height={675} className="aspect-[16/9] w-full object-cover" />
        <CardHeader>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">{supplement.category}</p>
          <CardTitle>{supplement.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{supplement.form}</p>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground">
          <p>Dose: {supplement.dose}</p>
          <p>When: {supplement.whenToTake}</p>
          <p>Popular brands: {supplement.popularBrands.slice(0, 3).join(", ")}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
