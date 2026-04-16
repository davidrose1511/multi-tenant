"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Sparkles,
  Truck,
  Scissors,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/lib/contexts/cart-provider";
import { BoutiqueProductCarousel } from "./product-carousel";
import { SizeChartDialog } from "./size-chart-dialog";
import { SIZE_FIT_LABEL } from "@/lib/constants/size-measurements";
import { cn } from "@/lib/utils";
import { Container } from "../../shared-components-public/container";
import type { BoutiqueItemDetail } from "@/lib/public-fetches/get-boutique-item-by-id";
import { Separator } from "@/components/ui/separator";

interface BoutiqueProductDetailProps {
  item: BoutiqueItemDetail;
  slug: string;
  categoryName: string | null;
}

export function BoutiqueProductDetail({
  item,
  slug,
  categoryName,
}: BoutiqueProductDetailProps) {
  const { addItem, items: cartItems, setIsOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  const isInCart = cartItems.some((i) => i.id === item.id);

  function handleAddToCart() {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    setIsOpen(true);
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.images[0]?.url ?? null,
      size: selectedSize,
      color: item.color ?? null,
      fit: selectedSize ? (SIZE_FIT_LABEL[selectedSize] ?? null) : null,
      fabric: item.fabric ?? null,
    });
  }

  return (
    <Container className="py-6 md:py-12 mt-16 md:mt-20">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-2 text-xs text-foreground/50 mb-4 md:mb-6 flex-wrap">
        <Link
          href={`/${slug}`}
          className="hover:text-foreground transition-colors"
        >
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/${slug}/products`}
          className="hover:text-foreground transition-colors"
        >
          Shop
        </Link>
        {categoryName && (
          <>
            <span>/</span>
            <Link
              href={`/${slug}/products?category=${item.category_id}`}
              className="hover:text-foreground transition-colors"
            >
              {categoryName}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground">{item.name}</span>
      </nav>

      {/* ── Main grid ── */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
        {/* ── Left — carousel ── */}
        <div className="w-full md:w-2/3">
          <BoutiqueProductCarousel
            images={item.images}
            name={item.name}
            color={item.color}
          />
        </div>

        {/* ── Right — info ── */}
        <div className="w-full md:w-1/3 flex flex-col md:gap-6 gap-4  rounded-2xl">
          {/* ── Badges ── */}
          {(item.is_new || item.is_featured) && (
            <div className="flex items-center gap-2">
              {item.is_new && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-secondary text-foreground">
                  <Sparkles className="w-2.5 h-2.5" />
                  New
                </span>
              )}
              {item.is_featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-foreground text-background">
                  Featured
                </span>
              )}
            </div>
          )}

          {/* ── Name + price ── */}
          <div className="flex flex-col gap-2">
            <h1 className="heading-editorial text-3xl md:text-5xl text-foreground leading-tight tracking-tightest">
              {item.name}
            </h1>
            <p className="md:text-3xl  text-2xl font-medium text-foreground ">
              ₹{item.price.toLocaleString("en-IN")}
            </p>
          </div>
          <Separator />
          {/* ── Size selector ── */}
          {item.sizes.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium  text-foreground">
                  Sizes
                </span>
                <SizeChartDialog sizes={item.sizes} />
              </div>

              {/* Size buttons */}
              <div className="flex flex-wrap gap-2">
                {item.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    className={cn(
                      "px-4 py-2.5 rounded-md text-xs font-semibold tracking-widest uppercase border transition-all",
                      selectedSize === size
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background text-foreground border-border hover:border-foreground",
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* To fit label — appears when size selected */}
              <div
                className={cn(
                  "text-xs text-foreground/70 transition-all duration-300",
                  selectedSize
                    ? "opacity-100"
                    : "opacity-0 h-0 overflow-hidden",
                )}
              >
                {selectedSize && SIZE_FIT_LABEL[selectedSize]}
              </div>

              {/* Size error */}
              {sizeError && (
                <p className="text-xs text-destructive">
                  Please select a size to continue.
                </p>
              )}
            </div>
          )}

          {/* ── Add to cart ── */}
          <Button
            onClick={handleAddToCart}
            disabled={isInCart}
            size="lg"
            className="w-full  h-12 font-semibold"
          >
            <ShoppingBag className="w-5 h-5 mr-1" />
            {isInCart ? "Added to Cart" : "Add to Cart"}
          </Button>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Truck className="w-5 h-5 shrink-0" />
              <span>Ready to ship</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Scissors className="w-5 h-5 shrink-0" />
              <span>Customisation available</span>
            </div>
          </div>

          {/* ── Tabs ── */}
          <Tabs
            defaultValue="details"
            className="w-full bg-white rounded-2xl p-4"
          >
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              {item.fabric && (
                <TabsTrigger value="fabric">Fabric & Fit</TabsTrigger>
              )}
              {item.care && <TabsTrigger value="care">Care</TabsTrigger>}
            </TabsList>

            <TabsContent value="details" className="pt-4 flex flex-col gap-3">
              {item.description ? (
                <p className="text-sm text-foreground leading-relaxed">
                  {item.description}
                </p>
              ) : (
                <p className="text-sm text-foreground/50">
                  No details available.
                </p>
              )}
              {item.color && (
                <p className="text-sm text-foreground">
                  <span className="font-medium">Color:</span> {item.color}
                </p>
              )}
            </TabsContent>

            {item.fabric && (
              <TabsContent value="fabric" className="pt-4">
                <div className="flex-row flex gap-2 text-sm text-foreground leading-relaxed">
                  <p className="text-muted-foreground">Fabric: </p>
                  <p>{item.fabric}</p>
                </div>
              </TabsContent>
            )}

            {item.care && (
              <TabsContent value="care" className="pt-4">
                <p className="text-sm text-foreground leading-relaxed ">
                  {item.care}
                </p>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
      <Separator className="mt-8" />

      <div className="flex items-center w-full justify-center md:py-12 py-8 ">
        <div className="md:flex-row flex flex-col flex-wrap md:gap-6 gap-4">
          <Button variant="default" size="lg" asChild>
            <Link href={`/${slug}/products?category=${item.category_id}`}>
              More from {categoryName ?? "this category"}
              <ChevronRight className="w-5 h-5 " />
            </Link>
          </Button>
          <Button variant="default" size="lg" asChild>
            <Link href={`/${slug}/products`}>
              Explore all <ChevronRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button variant="default" size="lg" asChild>
            <Link href={`/${slug}/products?isNew=true`}>
              Shop New arrivals <ChevronRight className="w-5 h-5 " />
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
