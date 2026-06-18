import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-muted-foreground sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <Image
            src="/logos/greenfit-logo-header.png"
            alt="greenfit.in"
            width={260}
            height={64}
            className="h-9 w-auto object-contain"
          />
          <p className="mt-2 max-w-2xl">
            Practical nutrition guidance, transparent product checks, and useful resources for everyday eating.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/products">Products</Link>
          <Link href="/diet-plans">Diet Plans</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/supplements">Supplements</Link>
          <Link href="/tools">Tools</Link>
        </div>
      </div>
    </footer>
  );
}
