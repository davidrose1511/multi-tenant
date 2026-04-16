"use client";
import Link from "next/link";
import { ArrowRight, CircleStar } from "lucide-react";
import { CatalogCard } from "../catalog-card";
import type { CatalogCardItem } from "@/components/dashboard-components/items/shared/item-types";
import { Container } from "../../shared-components-public/container";
import { Button } from "@/components/ui/button";

interface BoutiqueFeaturedSectionProps {
  featuredItems: CatalogCardItem[];
  slug: string;
}

export function BoutiqueFeaturedSection({
  featuredItems,
  slug,
}: BoutiqueFeaturedSectionProps) {
  if (!featuredItems.length) return null;

  return (
    <section>
      <Container className="pb-20 md:pb-32">
        {/* Heading */}
        <div className="mb-8 md:mb-14">
          <div className="flex flex-row items-center mb-4">
            <CircleStar size={"20"} className="text-muted-foreground mr-3" />
            <p className="md:text-sm text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground ">
              Hand Picked
            </p>
          </div>
          <h2 className="text-4xl lg:text-6xl font-light leading-tightest mb-1 text-rose-900">
            The Edit
          </h2>
          <p className="text-base text-muted-foreground">
            Pieces we love, curated just for you.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {featuredItems.map((item) => (
            <CatalogCard key={item.id} item={item} slug={slug} />
          ))}
        </div>

        {/* CTA */}
        <div className="w-full flex justify-center mt-12">
          <Button size="lg" asChild>
            <Link href={`/${slug}/products`}>
              See All Products
              <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
