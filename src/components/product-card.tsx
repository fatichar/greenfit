import Link from "next/link";
import Image from "next/image";
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
          <p className="text-xs font-medium uppercase tracking-wide text-primary">{product.category}</p>
          <CardTitle>{product.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{product.bestFor}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p>{product.nutrition}</p>
          <p className="text-xs">Popular brands: {product.popularBrands.slice(0, 3).join(", ")}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
