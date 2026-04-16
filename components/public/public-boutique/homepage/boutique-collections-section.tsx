"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, SunMedium, ArrowRight } from "lucide-react";
import type { CatalogCardItem } from "@/components/dashboard-components/items/shared/item-types";
import { COLLECTIONS } from "@/lib/constants/collections";
import { Container } from "../../shared-components-public/container";
// Bring Swiper back
import { Swiper as SwiperReact, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

interface CollectionSectionProps {
  items: CatalogCardItem[];
  slug: string;
  collectionValue: string;
}

export function BoutiqueCollectionSection({
  items,
  slug,
  collectionValue,
}: CollectionSectionProps) {
  // Shared state for which item is active
  const [activeIndex, setActiveIndex] = useState(0);

  // Desktop animation state
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile Swiper instance
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const collection = COLLECTIONS.find((c) => c.value === collectionValue);
  const activeItem = items[activeIndex];

  // Handler for Desktop tabs (keeps the beautiful fade)
  function handleDesktopSelect(index: number) {
    if (index === activeIndex) return;
    setAnimating(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveIndex(index);
      setAnimating(false);
    }, 220);
  }

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!items.length || !collection) return null;

  return (
    <section>
      <Container className="pb-20 md:pb-32">
        {/* ── DESKTOP LAYOUT (Unchanged) ── */}
        <div className="hidden md:grid grid-cols-2 gap-40 items-start w-full mx-auto">
          {/* Left — heading + item list */}
          <div>
            <div className="mb-8 md:mb-14">
              <div className="flex flex-row items-center text-muted-foreground mb-4">
                <SunMedium size={"24"} />
                <p className="text-sm font-semibold tracking-[0.25em] uppercase ml-2">
                  {collection.label}
                </p>
              </div>

              <h2 className="text-4xl lg:text-6xl font-light leading-tight mb-1 text-rose-900">
                {collection.tagline}
              </h2>
              <p className="text-base text-muted-foreground">
                Handpicked pieces from our {collection.label.toLowerCase()}.
              </p>
            </div>

            <ul className="space-y-0 mb-16">
              {items.map((item, i) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleDesktopSelect(i)}
                    className={`w-full flex items-center cursor-pointer justify-between py-4 border-b border-border text-left group transition-colors duration-500 ${
                      i === activeIndex
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`transition-all duration-500 font-medium ${
                        i === activeIndex
                          ? "text-xl text-foreground"
                          : "text-lg text-muted-foreground"
                      }`}
                    >
                      {item.name}
                    </span>
                    <ArrowUpRight
                      className={`w-4 h-4 shrink-0 transition-all duration-500 ${
                        i === activeIndex
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
            <div className="w-full flex justify-start mt-12">
              <Button size="lg" asChild>
                <Link
                  href={`/${slug}/products`}
                  className="group flex items-center gap-2"
                >
                  Shop The Summer Collection
                  <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right — product card */}
          <div className="relative max-w-136">
            <div
              className={`relative rounded-2xl overflow-hidden aspect-[3/4] transition-all duration-500 ${
                animating
                  ? "opacity-0 translate-y-3 scale-[0.98]"
                  : "opacity-100 translate-y-0 scale-100"
              }`}
              style={{ willChange: "transform, opacity" }}
            >
              {activeItem?.image_url ? (
                <Image
                  src={activeItem.image_url}
                  alt={activeItem.name}
                  className="object-cover"
                  fill
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: activeItem?.color ?? "#e5e7eb" }}
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white text-base font-medium leading-tight">
                      {activeItem?.name}
                    </p>
                    <p className="text-white/70 text-xs mt-0.5">
                      ₹{activeItem?.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <Link
                    href={`/${slug}/product/${activeItem?.id}`}
                    className="flex items-center gap-1.5 bg-white text-foreground text-[11px] font-semibold tracking-wider uppercase px-3 py-2 rounded-full hover:bg-white/90 transition-colors"
                  >
                    View <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-1.5 mt-4">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDesktopSelect(i)}
                  className={`rounded-full transition-all duration-500 ${
                    i === activeIndex
                      ? "w-4 h-1.5 bg-foreground"
                      : "w-1.5 h-1.5 bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── MOBILE LAYOUT (Swiper + Synced Tabs) ── */}
        <div className="md:hidden flex flex-col w-full mx-auto">
          {/* Mobile Heading */}
          <div className="mb-6">
            <div className="flex flex-row items-center text-muted-foreground mb-3">
              <SunMedium size={"20"} />
              <p className="text-xs font-semibold tracking-[0.25em] uppercase ml-2">
                {collection.label}
              </p>
            </div>
            <h2 className="text-4xl font-light leading-tight mb-1 text-rose-900">
              {collection.tagline}
            </h2>
            <p className="text-sm text-muted-foreground">
              Handpicked pieces from our {collection.label.toLowerCase()}.
            </p>
          </div>

          {/* Mobile Swiper */}
          <div className="w-full mb-6 relative">
            <SwiperReact
              onSwiper={setSwiperInstance}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              slidesPerView={1}
              spaceBetween={12}
              className="w-full rounded-2xl overflow-hidden aspect-[4/5] isolate z-0"
            >
              {items.map((item) => (
                <SwiperSlide
                  key={item.id}
                  className="relative w-full h-full rounded-2xl"
                >
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      className="object-cover rounded-2xl"
                      fill
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: item.color ?? "#e5e7eb" }}
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-primary-foreground text-base font-medium leading-tight">
                          {item.name}
                        </p>
                        <p className="text-primary-foreground/80 text-xs mt-0.5">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size={"sm"}
                        className="mt-3 rounded-lg bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-foreground"
                      >
                        View
                        <ArrowUpRight />
                      </Button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </SwiperReact>
          </div>

          {/* Mobile Item List (Synced Tabs) */}
          <ul className="space-y-0 mb-8">
            {items.map((item, i) => (
              <li key={item.id}>
                <button
                  // When a tab is clicked, tell the Swiper to slide to that index
                  onClick={() => swiperInstance?.slideTo(i)}
                  className={`w-full flex items-center cursor-pointer justify-between py-3 border-b border-border text-left transition-colors duration-300 ${
                    i === activeIndex
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`transition-all duration-300 font-medium ${
                      i === activeIndex
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </span>
                  <ArrowUpRight
                    className={`w-4 h-4 shrink-0 transition-all duration-300 ${
                      i === activeIndex
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile CTA */}
          <div className="w-full flex justify-center">
            <Button size="lg" className="w-full" asChild>
              <Link
                href={`/${slug}/products`}
                className="group flex items-center justify-center gap-2"
              >
                Shop The Summer Collection
                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
