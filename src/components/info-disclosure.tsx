import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type InfoDisclosureProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function InfoDisclosure({ title, children, defaultOpen = false }: InfoDisclosureProps) {
  return (
    <details
      className="group rounded-xl border bg-card p-5 shadow-sm open:border-primary/30"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-lg font-semibold">
        <span>{title}</span>
        <ChevronDown className="size-5 shrink-0 text-muted-foreground transition group-open:rotate-180" />
      </summary>
      <div className="mt-4 text-sm leading-7 text-muted-foreground">{children}</div>
    </details>
  );
}

export function InfoDisclosureList({
  title,
  items,
  defaultOpen,
}: {
  title: string;
  items: string[];
  defaultOpen?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <InfoDisclosure title={title} defaultOpen={defaultOpen}>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </InfoDisclosure>
  );
}
