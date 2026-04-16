"use client";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CatalogCard } from "../catalog-card";
import { BoutiqueFilters } from "./boutique-products-filters";
import type { CatalogCardItem } from "@/components/dashboard-components/items/shared/item-types";
import type { Category } from "@/components/dashboard-components/items/shared/item-types";
import { Container } from "../../shared-components-public/container";
import { COLLECTIONS } from "@/lib/constants/collections";

export type SortOption = "default" | "price_asc" | "price_desc" | "newest";

export interface ActiveFilters {
  categoryId: string | null;
  collection: string | null;
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  showAll: boolean; // false = available only (already filtered server side, but future-proof)
  sortBy: SortOption;
}

interface BoutiqueProductsShellProps {
  items: CatalogCardItem[];
  slug: string;
  categories: Category[];
  initialCollection?: string | null;
  initialCategory?: string | null;
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
];

export function BoutiqueProductsShell({
  items,
  slug,
  categories,
  initialCollection = null,
  initialCategory = null,
}: BoutiqueProductsShellProps) {
  // ── Derive filter meta from the full item list ──
  const filterMeta = useMemo(() => {
    const colors = [
      ...new Set(items.map((i) => i.color).filter(Boolean)),
    ] as string[];
    const sizes = [...new Set(items.flatMap((i) => i.sizes ?? []))] as string[];
    const prices = items.map((i) => i.price);
    const collections = COLLECTIONS.filter((c) =>
      items.some((i) => (i as any).collection === c.value),
    );
    return {
      colors,
      sizes,
      collections,
      priceRange: {
        min: Math.floor(Math.min(...prices, 0)),
        max: Math.ceil(Math.max(...prices, 10000)),
      },
    };
  }, [items]);

  // ── Filter state ──
  const [filters, setFilters] = useState<ActiveFilters>({
    categoryId: initialCategory ?? null,
    collection: initialCollection ?? null,
    minPrice: filterMeta.priceRange.min,
    maxPrice: filterMeta.priceRange.max,
    sizes: [],
    colors: [],
    showAll: false,
    sortBy: "default",
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categoryId: initialCategory ?? null,
      collection: initialCollection ?? null,
    }));
  }, [initialCategory, initialCollection]);

  const updateFilter = <K extends keyof ActiveFilters>(
    key: K,
    value: ActiveFilters[K],
  ) => setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () =>
    setFilters({
      categoryId: null,
      collection: null,
      minPrice: filterMeta.priceRange.min,
      maxPrice: filterMeta.priceRange.max,
      sizes: [],
      colors: [],
      showAll: false,
      sortBy: "default",
    });
  const currentSort = SORT_OPTIONS.find((o) => o.value === filters.sortBy);
  // ── Filtered + sorted items ──
  const displayItems = useMemo(() => {
    let result = [...items];

    if (filters.categoryId) {
      result = result.filter(
        (i) => (i as any).category_id === filters.categoryId,
      );
    }

    if (filters.collection) {
      result = result.filter(
        (i) => (i as any).collection === filters.collection,
      );
    }

    result = result.filter(
      (i) => i.price >= filters.minPrice && i.price <= filters.maxPrice,
    );

    if (filters.sizes.length > 0) {
      result = result.filter((i) =>
        filters.sizes.some((s) => (i.sizes ?? []).includes(s)),
      );
    }

    if (filters.colors.length > 0) {
      result = result.filter((i) => filters.colors.includes(i.color ?? ""));
    }

    switch (filters.sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // items already ordered by sort_order from server;
        // newest would need created_at on CatalogCardItem — add if needed
        break;
    }

    return result;
  }, [items, filters]);

  const filterProps = {
    categories,
    colors: filterMeta.colors,
    sizes: filterMeta.sizes,
    collections: filterMeta.collections,
    priceRange: filterMeta.priceRange,
    filters,
    updateFilter,
    resetFilters,
  };
  const heading = filters.categoryId
    ? (categories.find((c) => c.id === filters.categoryId)?.name ??
      "All Products")
    : filters.collection
      ? (COLLECTIONS.find((c) => c.value === filters.collection)?.label ??
        "All Products")
      : "All Products";

  return (
    <Container className="md:mt-32 mt-20">
      <h1 className="heading-editorial text-5xl md:text-6xl  mb-8 text-rose-900">
        {heading}
      </h1>
      <div className="flex gap-8 w-full">
        {/* ── Sidebar — desktop only ── */}
        <aside className="hidden lg:block max-w-60 w-full shrink-0 pt-1">
          <BoutiqueFilters {...filterProps} />
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {displayItems.length}
              </span>{" "}
              {displayItems.length === 1 ? "item" : "items"}
            </p>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5"
                  >
                    <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                    {currentSort?.label ?? "Featured"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {SORT_OPTIONS.map((opt) => (
                    <DropdownMenuItem
                      key={opt.value}
                      className={cn(
                        "text-xs",
                        filters.sortBy === opt.value && "font-medium",
                      )}
                      onSelect={() => updateFilter("sortBy", opt.value)}
                    >
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile sheet trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="default"
                    className="lg:hidden h-8 text-xs gap-1.5"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-72 overflow-y-auto boutique-site px-6"
                >
                  <SheetHeader>
                    <SheetTitle></SheetTitle>
                  </SheetHeader>
                  <BoutiqueFilters {...filterProps} />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Grid */}
          {displayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-2">
              <p className="text-sm text-muted-foreground">
                No items match your filters.
              </p>
              <button
                onClick={resetFilters}
                className="text-xs underline underline-offset-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-y-8 gap-y-6">
              {displayItems.map((item) => (
                <CatalogCard key={item.id} item={item} slug={slug} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
