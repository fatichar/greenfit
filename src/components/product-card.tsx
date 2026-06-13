import Link from "next/link";
import Image from "next/image";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductImage } from "@/lib/images";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
        <Image
          src={getProductImage(product.slug)}
          alt=""
          width={900}
          height={675}
          className="aspect-[16/9] w-full object-cover"
        />
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={product.status} />
            <ConfidenceBadge confidence={product.confidence} />
          </div>
          <CardTitle>{product.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {product.brand} - {product.category}
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">{product.notes}</p>
          <p className="text-xs text-muted-foreground">
            Concern: {product.ingredientsOfConcern.length ? product.ingredientsOfConcern.join(", ") : "None listed"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
