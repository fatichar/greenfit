import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { withAmazonAssociatesTag } from "@/lib/affiliate";
import type { AffiliateProduct } from "@/lib/types";

const affiliateDisclosure = "As an Amazon Associate, we may earn from qualifying purchases.";

type AffiliateProductsSectionProps = {
  products: AffiliateProduct[];
  sourcePage: string;
  title?: string;
};

export function AffiliateProductsSection({
  products,
  sourcePage,
  title = "Related product options",
}: AffiliateProductsSectionProps) {
  if (!products.length) return null;

  return (
    <section className="flex flex-col gap-4" aria-labelledby="affiliate-products-heading">
      <div className="flex flex-col gap-2">
        <h2 id="affiliate-products-heading" className="font-heading text-2xl font-semibold">
          {title}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">{affiliateDisclosure}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <AffiliateProductCard key={product.id} product={product} sourcePage={sourcePage} />
        ))}
      </div>
    </section>
  );
}

function AffiliateProductCard({ product, sourcePage }: { product: AffiliateProduct; sourcePage: string }) {
  const imageSrc = product.imagePath ?? product.imageUrl;
  const href = withAmazonAssociatesTag(product.amazonUrl);

  return (
    <Card className="h-full">
      {imageSrc ? <AffiliateProductImage src={imageSrc} title={product.title} /> : null}
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
        <Button
          render={
            <a
              href={href}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              data-umami-event="Outbound Product Click"
              data-umami-event-product-id={product.id}
              data-umami-event-product-category={product.category}
              data-umami-event-source-page={sourcePage}
            />
          }
        >
          View on Amazon
          <ExternalLink data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function AffiliateProductImage({ src, title }: { src: string; title: string }) {
  if (src.startsWith("/")) {
    return (
      <Image
        src={src}
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
