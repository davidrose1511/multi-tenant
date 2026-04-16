"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, FreeMode, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useState } from "react";

import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/navigation";

interface BoutiqueProductCarouselProps {
  images: { url: string; sort_order: number }[];
  name: string;
  color: string | null;
}

export function BoutiqueProductCarousel({
  images,
  name,
  color,
}: BoutiqueProductCarouselProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  // if no images, create 2 dummy null slides so swiper still renders with color blocks
  const slides = images.length > 0 ? images : [null, null];
  const bgColor = color ?? "hsl(var(--muted))";

  return (
    <div className="w-full">
      {/* ── Desktop — 2 slides side by side, no thumbnails ── */}
      <div className="hidden md:block">
        <Swiper
          modules={[Navigation]}
          slidesPerView={2}
          spaceBetween={4}
          navigation={slides.length > 2}
          loop={slides.length > 2}
          className="w-full rounded-2xl"
        >
          {slides.map((img, i) => (
            <SwiperSlide key={i}>
              <div
                className="relative aspect-[3/4] rounded-xl overflow-hidden"
                style={{ backgroundColor: bgColor }}
              >
                {img && (
                  <Image
                    src={img.url}
                    alt={`${name} — image ${i + 1}`}
                    fill
                    className="object-cover"
                    priority={i === 0}
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ── Mobile — single slide + thumbnails ── */}
      <div className="md:hidden flex flex-col gap-2">
        <Swiper
          modules={[Thumbs, FreeMode]}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          loop={slides.length > 1}
          className="w-full rounded-2xl overflow-hidden aspect-[3/4]"
        >
          {slides.map((img, i) => (
            <SwiperSlide key={i}>
              <div
                className="relative w-full h-full"
                style={{ backgroundColor: bgColor }}
              >
                {img && (
                  <Image
                    src={img.url}
                    alt={`${name} — image ${i + 1}`}
                    fill
                    className="object-cover"
                    priority={i === 0}
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ── Thumbnails — mobile only, small ── */}
        {slides.length > 1 && (
          <Swiper
            modules={[Thumbs, FreeMode]}
            onSwiper={setThumbsSwiper}
            spaceBetween={4}
            slidesPerView={5}
            freeMode
            watchSlidesProgress
            className="w-full"
          >
            {slides.map((img, i) => (
              <SwiperSlide key={i} className="cursor-pointer">
                <div
                  className="relative aspect-[3/4] rounded-md overflow-hidden opacity-30 [.swiper-slide-thumb-active_&]:opacity-100 transition-opacity duration-200"
                  style={{ backgroundColor: bgColor }}
                >
                  {img && (
                    <Image
                      src={img.url}
                      alt={`${name} thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}
