import Link from "next/link";
import { shopNavItems, type ShopNavHref } from "@/lib/shop-nav";
import { cn } from "@/lib/utils";

export function ShopNav({ activeHref }: { activeHref: ShopNavHref }) {
  return (
    <nav aria-label="Shop categories" className="flex flex-col gap-3">
      <div className="hidden lg:block">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shop</p>
        <ul className="mt-3 flex flex-col gap-1">
          {shopNavItems.map((item) => {
            const active = item.href === activeHref;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-olive-100",
                  )}
                >
                  <span className="block text-sm font-semibold">{item.title}</span>
                  <span className={cn("mt-0.5 block text-xs leading-4", active ? "text-primary-foreground/85" : "text-muted-foreground")}>
                    {item.description}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="lg:hidden">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Jump to category</p>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {shopNavItems.map((item) => {
            const active = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-olive-200 bg-card text-foreground hover:border-primary/40 hover:bg-olive-50",
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
