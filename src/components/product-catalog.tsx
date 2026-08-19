import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { withAmazonAssociatesTag } from "@/lib/affiliate";
import { getVersionedImagePath } from "@/lib/images";
import type { CatalogProduct } from "@/lib/types";

const amazonDisclosure = "As an Amazon Associate, we may earn from qualifying purchases.";

type ProductsSectionProps = {
  products: CatalogProduct[];
  sourcePage: string;
  title?: string;
};

export function ProductsSection({
  products,
  sourcePage,
  title = "Related product options",
}: ProductsSectionProps) {
  if (!products.length) return null;

  return (
    <section className="flex flex-col gap-4" aria-labelledby="product-catalog-heading">
      <div className="flex flex-col gap-2">
        <h2 id="product-catalog-heading" className="font-heading text-2xl font-semibold">
          {title}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">{amazonDisclosure}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} sourcePage={sourcePage} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, sourcePage }: { product: CatalogProduct; sourcePage: string }) {
  const imageSrc = product.imagePath ?? product.imageUrl;
  const href = withAmazonAssociatesTag(product.amazonUrl);

  return (
    <Card className="h-full">
      {imageSrc ? <ProductImage src={imageSrc} title={product.title} /> : null}
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{product.category}</Badge>
          {product.priceText ? <span className="text-sm font-medium text-muted-foreground">{product.priceText}</span> : null}
        </div>
        <CardTitle>{product.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 text-sm leading-6 text-muted-foreground">
        <p>{product.shortDescription}</p>
        {product.notes ? <p>{product.notes}</p> : null}
      </CardContent>
      <CardFooter>
        <a
          href={href}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          data-umami-event="Outbound Product Click"
          data-umami-event-product-id={product.id}
          data-umami-event-product-category={product.category}
          data-umami-event-source-page={sourcePage}
          className={buttonVariants()}
        >
          See it on Amazon
          <ExternalLink data-icon="inline-end" />
        </a>
      </CardFooter>
    </Card>
  );
}

function ProductImage({ src, title }: { src: string; title: string }) {
  if (src.startsWith("/")) {
    return (
      <Image
        src={getVersionedImagePath(src)}
        alt=""
        width={900}
        height={675}
        className="aspect-[16/9] w-full object-cover"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="aspect-[16/9] w-full object-cover" loading="lazy" data-product-image={title} />
  );
}
