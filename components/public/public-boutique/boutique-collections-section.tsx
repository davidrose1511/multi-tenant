"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { CatalogCardItem } from "@/components/items/shared/item-types";
import { COLLECTIONS } from "@/lib/constants/collections";
import { Container } from "../shared-components-public/container";

interface CollectionSectionProps {
  items: CatalogCardItem[];
  slug: string;
  collectionValue: string; // e.g. "festive"
}

export function BoutiqueCollectionSection({
  items,
  slug,
  collectionValue,
}: CollectionSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const collection = COLLECTIONS.find((c) => c.value === collectionValue);
  const activeItem = items[activeIndex];

  function handleSelect(index: number) {
    if (index === activeIndex) return;
    setAnimating(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveIndex(index);
      setAnimating(false);
    }, 220);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  console.log(items.length);
  console.log(items);
  console.log(activeItem, activeIndex);
  if (!items.length || !collection) return null;

  return (
    <section>
      <Container className="py-16 md:py-24">
        {/* ── Desktop layout ── */}
        <div className="hidden md:grid grid-cols-2 gap-40 items-center w-full mx-auto">
          {/* Left — text panel */}
          <div>
            {/* Collection label */}
            <p className="text-sm font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-4">
              {collection.label}
            </p>

            {/* Editorial heading */}
            <h2 className="text-4xl lg:text-6xl font-light leading-tight mb-3 text-rose-900 ">
              {collection.tagline}
            </h2>

            <p className="text-base text-muted-foreground mb-16">
              Handpicked pieces from our {collection.label.toLowerCase()}.
            </p>

            {/* Item list */}
            <ul className="space-y-0 mb-16">
              {items.map((item, i) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleSelect(i)}
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

            <Link
              href={`/${slug}?collection=${collectionValue}`}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase border-b border-foreground pb-0.5 hover:opacity-60 transition-opacity duration-200"
            >
              View All
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Right — product card */}
          <div className="relative max-w-136">
            {/* Card */}
            <div
              className={`relative rounded-2xl overflow-hidden aspect-3/4 transition-all duration-500 ${
                animating
                  ? "opacity-0 translate-y-3 scale-[0.98]"
                  : "opacity-100 translate-y-0 scale-100"
              }`}
              style={{ willChange: "transform, opacity" }}
            >
              {/* Image or color fallback */}
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

              {/* Bottom info strip */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/70 to-transparent">
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
                    View
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-1.5 mt-4">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === activeIndex
                      ? "w-4 h-1.5 bg-foreground"
                      : "w-1.5 h-1.5 bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="md:hidden px-6">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-2">
            {collection.label}
          </p>
          <h2
            className="text-3xl font-light mb-4 text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {collection.tagline}
          </h2>
          <p className="text-base text-muted-foreground mb-8">
            Handpicked pieces from our {collection.label.toLowerCase()}.
          </p>

          {/* Scrollable card row */}
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 -mx-6 px-6">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/${slug}/product/${item.id}`}
                className="snap-start shrink-0 w-[72vw] max-w-[280px] rounded-2xl overflow-hidden relative aspect-[3/4] block"
              >
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: item.color ?? "#e5e7eb" }}
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-primary-foreground text-sm font-medium">
                    {item.name}
                  </p>
                  <p className="text-white/70 text-xs">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href={`/${slug}?collection=${collectionValue}`}
            className="inline-flex items-center gap-2 mt-6 text-xs font-semibold tracking-widest uppercase border-b border-foreground pb-0.5"
          >
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
