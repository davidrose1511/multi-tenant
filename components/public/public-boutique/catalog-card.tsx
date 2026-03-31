"use client";
import { ShoppingBag, Check, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCart } from "../cart/cart-provider";
import { CatalogCardItem } from "@/components/items/shared/item-types";

interface CatalogCardProps {
  item: CatalogCardItem;
  slug: string; // needed to build the detail link
}

export function CatalogCard({ item, slug }: CatalogCardProps) {
  const { addItem, items } = useCart();

  const isInCart = items.some((i) => i.id === item.id);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault(); // don't navigate if card is wrapped in a link
    if (isInCart) return;
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
    });
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-0 shadow-none bg-transparent cursor-pointer",
      )}
    >
      {/* ── Image / Color block ── */}
      <a href={`/${slug}/product/${item.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl aspect-[3/4]">
          {/* Main color / image */}
          <div
            className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
            style={{ backgroundColor: item.color ?? "#e5e7eb" }}
          >
            {/* TODO: swap div for <Image> once you have real image_url */}
            {/* <Image src={item.image_url} alt={item.name} fill className="object-cover" /> */}
          </div>

          {/* Hover color / image — scales up slightly like the original */}
          <div
            className="absolute inset-0 opacity-0 scale-105 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
            style={{ backgroundColor: item.hover_color ?? "#d1d5db" }}
          >
            {/* TODO: swap for hover image if you have one */}
          </div>

          {/* ── Badges (top-left) ── */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {item.is_new && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-white/90 text-neutral-800 shadow-sm">
                <Sparkles className="w-2.5 h-2.5" />
                New
              </span>
            )}
            {item.is_featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-black/80 text-white shadow-sm">
                Featured
              </span>
            )}
          </div>

          {/* ── Sizes — slide up on hover ── */}
          {item.sizes && item.sizes.length > 0 && (
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 z-10",
                "translate-y-full group-hover:translate-y-0",
                "transition-transform duration-300 ease-out",
              )}
            >
              <div className="mx-3 mb-3 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center gap-2 flex-wrap">
                {item.sizes.map((size) => (
                  <span
                    key={size}
                    className="text-[10px] font-bold tracking-widest uppercase text-neutral-700"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </a>

      {/* ── Info row ── */}
      <div className="pt-3 px-0.5 flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <a
            href={`/${slug}/product/${item.id}`}
            className="text-sm font-medium text-foreground truncate"
          >
            {item.name}
          </a>
          <span className="text-sm font-semibold text-foreground">
            ₹{item.price.toLocaleString("en-IN")}
          </span>
        </div>

        {/* ── Add to cart button ── */}
        <button
          onClick={handleAddToCart}
          aria-label={isInCart ? "Added to cart" : "Add to cart"}
          className={cn(
            "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            "border transition-all duration-200",
            isInCart
              ? "bg-neutral-900 border-neutral-900 text-white"
              : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-900 hover:border-neutral-900 hover:text-white",
          )}
        >
          {isInCart ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <ShoppingBag className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </Card>
  );
}
