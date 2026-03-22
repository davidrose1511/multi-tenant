"use client";

import { useCart } from "@/components/public/cart/cart-provider";
import { Separator } from "@/components/ui/separator";
import { Business } from "./checkout-shell";

export function OrderSummary({ business }: { business: Business }) {
  const { items, total } = useCart();

  return (
    <div className="border rounded-xl p-5 space-y-4 lg:sticky lg:top-20">
      <h2 className="font-semibold">Order Summary</h2>
      <p className="text-xs text-muted-foreground">{business.name}</p>

      <Separator />

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No items in cart.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <span
                className="text-xs font-bold mt-0.5 shrink-0"
                style={{ color: "var(--theme-color)" }}
              >
                {item.quantity}x
              </span>
              <p className="text-sm">{item.name}</p>
            </div>
            <p className="text-sm font-medium shrink-0">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <p className="font-semibold">Total</p>
        <p className="font-bold text-lg">₹{total}</p>
      </div>
    </div>
  );
}
