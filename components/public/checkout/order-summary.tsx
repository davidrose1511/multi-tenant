"use client";
import Image from "next/image";
import { useCart } from "@/lib/contexts/cart-provider";
import { Separator } from "@/components/ui/separator";
import { Business } from "./checkout-shell";
import { Dot } from "lucide-react";

export function OrderSummary({ business }: { business: Business }) {
  const { items, total } = useCart();

  return (
    <div className="border border-border rounded-xl p-6 space-y-5 lg:sticky lg:top-24 max-w-full">
      {/* ── Header ── */}
      <div>
        <h2 className="font-semibold text-foreground text-xl">Order Summary</h2>
      </div>

      <Separator />

      {/* ── Items ── */}
      <div className="space-y-4">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No items in cart.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 w-full">
            {/* Image / color block */}
            <div className="aspect-3/4 md:w-32 w-28 rounded-lg overflow-hidden shrink-0 bg-muted">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  width={128}
                  height={160}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: item.color ?? "hsl(var(--muted))" }}
                />
              )}
            </div>

            {/* Info Container - Fixed for stacking and bleeding */}
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <div className="flex items-start justify-between gap-2 w-full mb-1">
                <p className="md:text-lg text-sm font-medium text-foreground leading-tight ">
                  {item.name}
                </p>
                <p className="text-sm md:text-lg font-semibold text-foreground shrink-0">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>

              {/* Stacked Details with locked dots */}
              {/* Details Stack */}
              <div className="flex flex-col gap-0.5">
                {/* Qty */}
                <div className="flex items-start text-foreground/80">
                  <Dot size={"20"} className="shrink-0 " />
                  <span className="text-xs leading-relaxed">
                    Qty: {item.quantity}
                  </span>
                </div>

                {item.size && (
                  <div className="flex items-start text-foreground/80">
                    <Dot size={"20"} className="shrink-0  " />
                    <span className="text-xs leading-relaxed">
                      Size: {item.size}
                    </span>
                  </div>
                )}

                {item.fit && (
                  <div className="flex items-start text-foreground/80">
                    <Dot size={"20"} className="shrink-0 " />
                    <span className="text-xs leading-relaxed">
                      Fit: {item.fit}
                    </span>
                  </div>
                )}

                {item.color && (
                  <div className="flex items-start text-foreground/80">
                    <Dot size={"20"} className="shrink-0 " />
                    <span className="text-xs leading-relaxed">
                      Color: {item.color}
                    </span>
                  </div>
                )}

                {item.fabric && (
                  <div className="flex items-start text-foreground/80">
                    <Dot size={"20"} className="shrink-0  " />
                    <span className="text-xs leading-relaxed">
                      Fabric: {item.fabric}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* ── Totals ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-muted-foreground">Calculated at next step</span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <p className="font-semibold text-foreground">Total</p>
        <p className="text-xl font-bold text-foreground">
          ₹{total.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}
