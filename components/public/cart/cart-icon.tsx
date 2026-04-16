"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/contexts/cart-provider";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { CartDrawerContent } from "./cart-drawer";

export function CartIcon() {
  const { totalItems, mounted, isOpen, setIsOpen } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* 1. Use SheetTrigger instead of onClick state mapping */}
      <SheetTrigger asChild>
        <button className="relative p-1" aria-label="Open cart">
          <ShoppingBag className="w-6 h-6 text-foreground" strokeWidth={1.5} />
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
