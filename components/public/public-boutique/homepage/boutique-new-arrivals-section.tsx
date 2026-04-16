"use client";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { CatalogCard } from "../catalog-card";
import type { CatalogCardItem } from "@/components/dashboard-components/items/shared/item-types";
import { Container } from "../../shared-components-public/container";
import { Button } from "@/components/ui/button";

interface BoutiqueNewArrivalsSectionProps {
  newItems: CatalogCardItem[];
  slug: string;
}

export function BoutiqueNewArrivalsSection({
  newItems,
  slug,
}: BoutiqueNewArrivalsSectionProps) {
  if (!newItems.length) return null;

  // Duplicate if needed for swiper loop
  const slides = newItems.length < 4 ? [...newItems, ...newItems] : newItems;

  return (
    <section className="pb-20 md:pb-32 overflow-hidden">
      {/* Heading inside Container */}
      <Container>
        <div className="mb-10 md:mb-14">
          <div className="text-muted-foreground mb-4 flex flex-row items-center">
            <Sparkles size={"20"} />
            <p className="md:text-sm text-xs font-semibold tracking-[0.25em] uppercase ml-2 ">
              Just In
            </p>
          </div>
          <h2 className="text-4xl lg:text-6xl font-light leading-tightest mb-1 text-rose-900">
            New Arrivals
          </h2>
          <p className="text-base text-muted-foreground ">
            The latest additions to our collection.
          </p>
        </div>
      </Container>

      {/*
        Mobile: Swiper carousel — full bleed so cards peek at edges
        Desktop: regular grid inside Container
      */}

      {/* Mobile carousel — md:hidden */}
      <div className="md:hidden pl-4">
        {/* NOTE: pl-4 gives left padding so first card aligns;
            no right padding so next card peeks */}
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1.5}
          spaceBetween={12}
          loop={slides.length >= 4}
          autoplay={{ delay: 5000, disableOnInteraction: true }}
          breakpoints={{
            480: { slidesPerView: 2.2 },
            640: { slidesPerView: 2.5 },
          }}
        >
          {slides.map((item, i) => (
            <SwiperSlide key={`${item.id}-${i}`}>
              <CatalogCard item={item} slug={slug} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop grid — hidden on mobile */}
      <Container className="hidden md:block">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {newItems.map((item) => (
            <CatalogCard key={item.id} item={item} slug={slug} />
          ))}
        </div>
      </Container>

      {/* CTA */}
      <Container>
        <div className="w-full flex justify-center mt-12">
          <Button size="lg" variant="default" asChild>
            <Link href={`/${slug}/products`}>
              See All New Arrivals
              <ArrowRight className=" transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
