"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCategories } from "@/lib/contexts/categories-context";

type MobileMenuProps = {
  slug: string;
};

export function MobileMenu({ slug }: MobileMenuProps) {
  const categories = useCategories();
  const pathname = usePathname();

  const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="flex items-center justify-center w-8 h-8 text-foreground"
          aria-label="Open menu"
        >
          <Menu strokeWidth={1.5} size={20} />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[300px] p-0 border-r border-border bg-background flex flex-col [&>button]:hidden"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <SheetTitle className="text-sm font-semibold tracking-[0.25em] uppercase text-foreground">
            Menu
          </SheetTitle>
          <SheetClose asChild>
            <button
              className="flex items-center justify-center w-7 h-7 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close menu"
            >
              <X strokeWidth={1.25} size={18} />
            </button>
          </SheetClose>
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 overflow-y-auto px-6 py-6">
          <p className="text-xs font-semibold mb-4">Collections </p>
          <ul>
            {sorted.map((cat) => {
              const href = `/${slug}/products?category=${cat.id}`;
              const isActive = pathname === href;

              return (
                <li key={cat.id}>
                  <SheetClose asChild>
                    <Link
                      href={href}
                      className={`flex flex-col py-3.5 border-b border-border/40 transition-colors duration-200 ${
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`text-sm tracking-wide ${
                          isActive ? "font-semibold" : "font-medium"
                        }`}
                      >
                        {cat.name}
                      </span>
                      {cat.tagline && (
                        <span className="text-[11px] text-muted-foreground/70 mt-0.5 font-normal">
                          {cat.tagline}
                        </span>
                      )}
                    </Link>
                  </SheetClose>
                </li>
              );
            })}

            <li>
              <SheetClose asChild>
                <Link
                  href={`/${slug}/about`}
                  className="flex py-3.5 text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  About
                </Link>
              </SheetClose>
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
