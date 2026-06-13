import Link from "next/link";
import { Leaf } from "lucide-react";

const navItems = [
  ["Products", "/products"],
  ["Diet Plans", "/diet-plans"],
  ["Guides", "/guides"],
  ["Supplements", "/supplements"],
  ["Tools", "/tools"],
  ["About", "/about"],
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-semibold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-4" />
          </span>
          GreenFit
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-foreground">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
