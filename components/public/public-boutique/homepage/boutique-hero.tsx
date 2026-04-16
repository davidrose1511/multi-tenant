"use client";
import { useCategories } from "@/lib/contexts/categories-context";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
export default function BoutiqueHero() {
  const categories = useCategories();
  if (!categories || categories.length === 0) return null;

  // Duplicate slides until we have enough for loop mode (min 4)

  const slides = [...categories, ...categories];

  return (
    <div className="w-full h-[70vh] md:h-[60vh] lg:h-[80vh] mt-20 md:mt-32 pb-20 md:pb-24">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={4}
        centeredSlides={true}
        slidesPerView={1.3}
        loop={true}
        autoplay={{
          delay: 6000,
          disableOnInteraction: true,
        }}
        breakpoints={{
          640: { slidesPerView: 1.3 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 2.5 },
          1280: { slidesPerView: 4 },
        }}
        className="h-full px-4"
      >
        {slides.map((cat, i) => (
          <SwiperSlide key={`${cat.id}-${i}`}>
            <div className="relative w-full h-full overflow-hidden rounded-xl">
              <img
                src={cat.cover_image_url || "/fallback.jpg"}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-background">
                <h2 className="text-4xl font-semibold">{cat.name}</h2>
                {cat.tagline && (
                  <p className="text-sm opacity-90 mt-1">{cat.tagline}</p>
                )}
                <Button
                  variant="outline"
                  size={"sm"}
                  className="mt-3 rounded-lg bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-foreground"
                >
                  Shop Now
                  <ArrowRight />
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
