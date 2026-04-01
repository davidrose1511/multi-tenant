"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/public/cart/cart-provider";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { CartDrawerContent } from "./cart-drawer";

export function CartIcon() {
  const { totalItems, mounted } = useCart();

  return (
    <Sheet>
      {/* 1. Use SheetTrigger instead of onClick state mapping */}
      <SheetTrigger asChild>
        <button className="relative p-1" aria-label="Open cart">
          <ShoppingBag className="w-5 h-5 text-foreground" />
          {mounted && totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-foreground text-background text-[10px] font-medium flex items-center justify-center leading-none">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>

      {/* 2. Render the content right inside the Sheet context */}
      <CartDrawerContent />
    </Sheet>
  );
}
