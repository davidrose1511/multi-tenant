"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { Category } from "@/components/dashboard-components/items/shared/item-types";
import type { ActiveFilters } from "./boutique-products-shell";
import { COLLECTIONS } from "@/lib/constants/collections";

type Collection = (typeof COLLECTIONS)[number];

interface BoutiqueFiltersProps {
  categories: Category[];
  colors: string[];
  sizes: string[];

  priceRange: { min: number; max: number };
  filters: ActiveFilters;
  collections: Collection[];
  updateFilter: <K extends keyof ActiveFilters>(
    key: K,
    value: ActiveFilters[K],
  ) => void;
  resetFilters: () => void;
}

function toggleArray(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export function BoutiqueFilters({
  categories,
  colors,
  sizes,
  collections,
  priceRange,
  filters,
  updateFilter,
  resetFilters,
}: BoutiqueFiltersProps) {
  const hasActiveFilters =
    filters.categoryId ||
    filters.collection ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.minPrice > priceRange.min ||
    filters.maxPrice < priceRange.max;

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <span className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
          Filters
        </span>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      <Accordion
        type="multiple"
        defaultValue={[
          "categories",
          "collections",
          "price",
          "sizes",
          "colors",
          "availability",
        ]}
        className="w-full"
      >
        {/* Categories */}
        <AccordionItem value="categories" className="border-border">
          <AccordionTrigger className="text-xs font-semibold tracking-widest uppercase py-3 hover:no-underline">
            Categories
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="flex flex-col gap-0.5">
              <CategoryButton
                label="All"
                active={!filters.categoryId}
                onClick={() => updateFilter("categoryId", null)}
              />
              {categories.map((cat) => (
                <CategoryButton
                  key={cat.id}
                  label={cat.name}
                  active={filters.categoryId === cat.id}
                  onClick={() => updateFilter("categoryId", cat.id)}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Collections */}
        {collections.length > 0 && (
          <AccordionItem value="collections" className="border-border">
            <AccordionTrigger className="text-xs font-semibold tracking-widest uppercase py-3 hover:no-underline">
              Collections
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex flex-col gap-0.5">
                <CategoryButton
                  label="All"
                  active={!filters.collection}
                  onClick={() => updateFilter("collection", null)}
                />
                {collections.map((col) => (
                  <CategoryButton
                    key={col.value}
                    label={col.label}
                    active={filters.collection === col.value}
                    onClick={() => updateFilter("collection", col.value)}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Price */}
        <AccordionItem value="price" className="border-border">
          <AccordionTrigger className="text-xs font-semibold tracking-widest uppercase py-3 hover:no-underline">
            Price
          </AccordionTrigger>
          <AccordionContent className="pb-4 px-2">
            <div className="px-1">
              <Slider
                min={priceRange.min}
                max={priceRange.max}
                step={100}
                value={[filters.minPrice, filters.maxPrice]}
                onValueChange={([min, max]) => {
                  updateFilter("minPrice", min);
                  updateFilter("maxPrice", max);
                }}
                className="w-full mt-4"
              />
              <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                <span>₹{filters.minPrice.toLocaleString("en-IN")}</span>
                <span>₹{filters.maxPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sizes */}
        {sizes.length > 0 && (
          <AccordionItem value="sizes" className="border-border">
            <AccordionTrigger className="text-xs font-semibold tracking-widest uppercase py-3 hover:no-underline">
              Size
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const isActive = filters.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() =>
                        updateFilter("sizes", toggleArray(filters.sizes, size))
                      }
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-semibold tracking-widest uppercase border transition-all",
                        isActive
                          ? "bg-foreground text-background border-foreground"
                          : "bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground",
                      )}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Colors */}
        {colors.length > 0 && (
          <AccordionItem value="colors" className="border-border">
            <AccordionTrigger className="text-xs font-semibold tracking-widest uppercase py-3 hover:no-underline">
              Color
            </AccordionTrigger>
            <AccordionContent className="p-2 mb-4">
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => {
                  const isActive = filters.colors.includes(color);
                  return (
                    <button
                      key={color}
                      title={color}
                      onClick={() =>
                        updateFilter(
                          "colors",
                          toggleArray(filters.colors, color),
                        )
                      }
                      className={cn(
                        "w-7 h-7 rounded-full border-2 transition-all",
                        isActive
                          ? "border-foreground scale-110"
                          : "border-transparent hover:border-muted-foreground",
                      )}
                      style={{ backgroundColor: color }}
                    />
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Availability */}
        <AccordionItem value="availability" className="border-b-0">
          <AccordionTrigger className="text-xs font-semibold tracking-widest uppercase py-3 hover:no-underline">
            Availability
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="show-all"
                checked={filters.showAll}
                onCheckedChange={(v) => updateFilter("showAll", !!v)}
              />
              <Label
                htmlFor="show-all"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Include sold out
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function CategoryButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-left text-sm py-1.5 px-2 rounded-md transition-colors w-full",
        active
          ? "bg-secondary font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent",
      )}
    >
      {label}
    </button>
  );
}
