"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/contexts/cart-provider";

export function CartBar({ slug }: { slug: string }) {
  const { totalItems, total, mounted } = useCart();

  if (!mounted || totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-3xl mx-auto">
        <Button
          asChild
          className="w-full h-14 text-white shadow-lg rounded-2xl flex items-center justify-between px-5"
        >
          <Link href={`/${slug}/checkout`}>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-sm font-semibold">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
            <span className="text-sm font-bold">₹{total}</span>
            <span className="text-sm font-semibold">View Cart →</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
