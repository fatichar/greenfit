import type { ReactNode } from "react";
import { ShopNav } from "@/components/shop-nav";
import type { ShopNavHref } from "@/lib/shop-nav";

export function ShopShell({
  activeHref,
  children,
  className,
}: {
  activeHref: ShopNavHref;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className ?? "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"}>
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-start lg:gap-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ShopNav activeHref={activeHref} />
        </aside>
        <div className="min-w-0 flex flex-col gap-8 lg:gap-10">{children}</div>
      </div>
    </div>
  );
}
