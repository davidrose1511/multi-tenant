"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CatalogCard } from "./catalog-card";
import type { CatalogCardItem } from "@/components/items/shared/item-types";
import { Container } from "../shared-components-public/container";

interface BoutiqueFeaturedSectionProps {
  featuredItems: CatalogCardItem[];
  newItems: CatalogCardItem[];
  slug: string;
}

export function BoutiqueFeaturedSection({
  featuredItems,
  newItems,
  slug,
}: BoutiqueFeaturedSectionProps) {
  if (!featuredItems.length && !newItems.length) return null;

  return (
    <section>
      <Container className="py-24 ">
        <Tabs defaultValue="featured">
          {/* ── Header row: title left, tabs center-ish, view all right ── */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <TabsList className="p-1 h-auto rounded-sm">
              <TabsTrigger
                value="featured"
                className=" px-4 py-1.5 text-xs font-semibold tracking-wide uppercase"
              >
                Featured
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className="rounded-xl px-4 py-1.5 text-xs font-semibold tracking-wide uppercase"
              >
                New Arrivals
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ── Featured tab ── */}
          <TabsContent value="featured" className="mt-0">
            {featuredItems.length ? (
              <ItemGrid items={featuredItems} slug={slug} />
            ) : (
              <EmptyState label="No featured items yet." />
            )}
          </TabsContent>

          {/* ── New Arrivals tab ── */}
          <TabsContent value="new" className="mt-0">
            {newItems.length ? (
              <ItemGrid items={newItems} slug={slug} />
            ) : (
              <EmptyState label="No new arrivals yet." />
            )}
          </TabsContent>
        </Tabs>
        <div className="w-full text-center mt-12">
          <Link
            href={`/${slug}/catalog`}
            className="group inline-flex items-center gap-1 text-2xl font-medium text-primary transition-colors duration-200 shrink-0"
          >
            View all
            <ArrowRight className="w-6 h-6 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

function ItemGrid({ items, slug }: { items: CatalogCardItem[]; slug: string }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6">
      {items.map((item) => (
        <CatalogCard key={item.id} item={item} slug={slug} />
      ))}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <p className="text-sm text-neutral-400 py-10 text-center">{label}</p>;
}
