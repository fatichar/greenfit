"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  ["Products", "/products"],
  ["Diet Plans", "/diet-plans"],
  ["Guides", "/guides"],
  ["Recipes", "/recipes"],
  ["Supplements", "/supplements"],
  ["Tools", "/tools"],
  ["About", "/about"],
];

const SHRINK_SCROLL_Y = 96;
const EXPAND_SCROLL_Y = 8;

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => {
      setIsScrolled((current) => {
        if (current) {
          return window.scrollY > EXPAND_SCROLL_Y;
        }

        return window.scrollY > SHRINK_SCROLL_Y;
      });
    };

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrolled);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur transition-shadow duration-300 data-[scrolled=true]:shadow-sm" data-scrolled={isScrolled}>
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 transition-[padding] duration-300 ease-out sm:px-6 lg:px-8",
          isScrolled ? "py-3" : "py-4 sm:py-5"
        )}
      >
        <Link href="/" className="flex items-center" aria-label="GreenFit home">
          <Image
            src="/logos/greenfit-logo-header.png"
            alt="greenfit.in"
            width={260}
            height={64}
            loading="eager"
            className={cn(
              "w-auto object-contain transition-[height] duration-300 ease-out",
              isScrolled ? "h-9" : "h-14 sm:h-18"
            )}
          />
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-foreground">
              {label}
            </Link>
          ))}
        </nav>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "-mr-2")}
            >
              <Menu className="size-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader className="border-b pb-4">
                <SheetTitle>
                  <Link href="/" className="flex items-center" aria-label="GreenFit home">
                    <Image
                      src="/logos/greenfit-logo-header.png"
                      alt="greenfit.in"
                      width={260}
                      height={64}
                      className="h-10 w-auto object-contain"
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 pt-4">
                {navItems.map(([label, href]) => (
                  <SheetClose
                    key={href}
                    nativeButton={false}
                    render={
                      <Link
                        href={href}
                        className="px-2 py-1 text-lg font-medium transition hover:text-primary"
                      />
                    }
                  >
                    {label}
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
