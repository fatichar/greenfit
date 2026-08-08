"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
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

const navItemsBeforeShop = [
  ["Diet Plans", "/diet-plans"],
  ["Guides", "/guides"],
  ["Recipes", "/recipes"],
] as const;

const navItemsAfterShop = [
  ["Tools", "/tools"],
  ["About", "/about"],
] as const;

const shopItems = [
  {
    label: "Supplements",
    href: "/shop/supplement",
    description: "Compare nutrients, forms, and quality checks.",
  },
  {
    label: "Exercise & Fitness",
    href: "/shop/exercise-fitness",
    description: "Practical picks for strength, cardio, and mobility.",
  },
  {
    label: "Kitchen",
    href: "/shop/kitchen",
    description: "Devices that make plant-based cooking easier.",
  },
  {
    label: "Personal Care & Beauty",
    href: "/shop/personal-care-beauty",
    description: "Simple checks for everyday care and beauty buys.",
  },
  {
    label: "Books",
    href: "/shop/books",
    description: "Reading lists for nutrition, movement, and habits.",
  },
] as const;

const SHRINK_SCROLL_Y = 96;
const EXPAND_SCROLL_Y = 8;

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const shopMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const closeShopMenu = (event: MouseEvent) => {
      if (shopMenuRef.current && !shopMenuRef.current.contains(event.target as Node)) {
        setIsShopOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsShopOpen(false);
    };

    document.addEventListener("mousedown", closeShopMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeShopMenu);
      document.removeEventListener("keydown", closeOnEscape);
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
          {navItemsBeforeShop.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-foreground">
              {label}
            </Link>
          ))}
          <div ref={shopMenuRef} className="relative">
            <button
              type="button"
              aria-expanded={isShopOpen}
              aria-haspopup="menu"
              onClick={() => setIsShopOpen((open) => !open)}
              className="inline-flex items-center gap-1 transition hover:text-foreground aria-expanded:text-foreground"
            >
              Shop
              <ChevronDown className={cn("size-4 transition-transform", isShopOpen && "rotate-180")} aria-hidden="true" />
            </button>
            {isShopOpen ? (
              <div
                id="shop-menu"
                role="menu"
                className="absolute right-0 top-full z-50 mt-3 w-80 rounded-xl border bg-popover p-2 text-popover-foreground shadow-lg"
              >
                <Link
                  href="/shop"
                  role="menuitem"
                  onClick={() => setIsShopOpen(false)}
                  className="block rounded-lg px-3 py-2.5 transition hover:bg-muted"
                >
                  <span className="font-medium">Shop overview</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">Browse every GreenFit category.</span>
                </Link>
                <div className="my-1 border-t" />
                {shopItems.map(({ label, href, description }) => (
                  <Link
                    key={href}
                    href={href}
                    role="menuitem"
                    onClick={() => setIsShopOpen(false)}
                    className="block rounded-lg px-3 py-2.5 transition hover:bg-muted"
                  >
                    <span className="font-medium">{label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          {navItemsAfterShop.map(([label, href]) => (
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
                {navItemsBeforeShop.map(([label, href]) => (
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
                <div className="border-t pt-4">
                  <button
                    type="button"
                    aria-expanded={isMobileShopOpen}
                    aria-controls="mobile-shop-menu"
                    onClick={() => setIsMobileShopOpen((open) => !open)}
                    className="flex w-full items-center justify-between px-2 py-1 text-left text-lg font-medium transition hover:text-primary"
                  >
                    Shop
                    <ChevronDown className={cn("size-5 transition-transform", isMobileShopOpen && "rotate-180")} aria-hidden="true" />
                  </button>
                  {isMobileShopOpen ? (
                    <div id="mobile-shop-menu" className="mt-2 grid gap-1 border-l border-olive-200 pl-3">
                      <MobileShopLink href="/shop" label="Shop overview" />
                      {shopItems.map(({ label, href }) => (
                        <MobileShopLink key={href} href={href} label={label} />
                      ))}
                    </div>
                  ) : null}
                </div>
                {navItemsAfterShop.map(([label, href]) => (
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

function MobileShopLink({ href, label }: { href: string; label: string }) {
  return (
    <SheetClose
      nativeButton={false}
      render={<Link href={href} className="px-2 py-2 text-base text-muted-foreground transition hover:text-primary" />}
    >
      {label}
    </SheetClose>
  );
}
