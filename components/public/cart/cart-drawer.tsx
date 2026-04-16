"use client";

import { Minus, Plus, X } from "lucide-react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose, // <-- Import SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/contexts/cart-provider";
import { useBusiness } from "@/lib/contexts/business-context";

export function CartDrawerContent() {
  const { items, removeItem, updateQuantity, total, totalItems } = useCart();
  const { slug } = useBusiness();

  return (
    <SheetContent
      side="right"
      className="w-[85vw] sm:max-w-md p-0 flex flex-col"
    >
      {/* ── Header ── */}
      <SheetHeader className="px-6 py-5 border-b border-border">
        <div className="flex items-center justify-between">
          <SheetTitle className="text-sm font-semibold tracking-[0.15em] uppercase">
            Cart
            {totalItems > 0 && (
              <span className="ml-2 text-muted-foreground font-normal">
                ({totalItems})
              </span>
            )}
          </SheetTitle>
        </div>
      </SheetHeader>

      {items.length === 0 ? (
        /* ── Empty state ── */
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          {/* Use SheetClose to automatically trigger close animations */}
          <SheetClose asChild>
            <Button size="default">Continue Shopping</Button>
          </SheetClose>
        </div>
      ) : (
        <>
          {/* ── Subtotal + checkout (top) ── */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-border">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest">
                Subtotal
              </p>
              <p className="text-base font-semibold mt-0.5">
                ₹{total.toLocaleString("en-IN")}
              </p>
            </div>
            {/* Wrap the checkout button in SheetClose */}
            <SheetClose asChild>
              <Button asChild className="px-6">
                <a href={`/${slug}/checkout`}>Checkout</a>
              </Button>
            </SheetClose>
          </div>

          {/* ── Cart items ── */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            {items.map((item) => (
              <div key={`${item.id}-${item.size ?? ""}`} className="flex gap-4">
                {/* Image */}
                <div className="w-20 h-24 rounded-sm overflow-hidden bg-muted shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-tight">
                      {item.name}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground mt-0.5">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>

                  {/* Size + color */}
                  <div className="flex gap-2 mt-1">
                    {item.size && (
                      <span className="text-[11px] text-muted-foreground">
                        Size: {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span className="text-[11px] text-muted-foreground">
                        · {item.color}
                      </span>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors ml-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* ── Sticky bottom checkout ── */}
          <div className="px-6 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Taxes and shipping calculated at checkout
            </p>
            {/* Wrap the bottom checkout button in SheetClose */}
            <SheetClose asChild>
              <Button asChild className="w-full   h-12">
                <a href={`/${slug}/checkout`}>
                  Checkout · ₹{total.toLocaleString("en-IN")}
                </a>
              </Button>
            </SheetClose>
          </div>
        </>
      )}
    </SheetContent>
  );
}
