"use client";

import { useCategories } from "@/lib/public/categories-context"; // adjust path
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

export default function BoutiqueHero() {
  const categories = useCategories();

  // guard (important if data is async)
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full h-[55vh] lg:h-[80vh] mt-32 bg-background">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={4}
        centeredSlides={true}
        slidesPerView={1.2}
        loop={categories.length > 2} // only loop if enough slides
        autoplay={{
          delay: 6000,
          disableOnInteraction: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1.2,
          },
          768: {
            slidesPerView: 1.3,
          },
          1024: {
            slidesPerView: 1.5,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
        className="h-full px-4"
      >
        {categories.map((cat) => (
          <SwiperSlide key={cat.id}>
            <div className="relative w-full h-full overflow-hidden">
              {/* Image */}
              <img
                src={cat.cover_image_url || "/fallback.jpg"}
                alt={cat.name}
                className="w-full h-full object-cover"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-6 left-6 right-6 text-background">
                <h2 className="text-4xl font-semibold">{cat.name}</h2>

                {cat.tagline && (
                  <p className="text-sm opacity-90 mt-1">{cat.tagline}</p>
                )}

                <button className="mt-3 text-sm underline">Shop Now →</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
