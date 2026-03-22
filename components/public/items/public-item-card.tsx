"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useCart } from "../cart/cart-provider";

type ItemCardProps = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
};

export function ItemCard({
  id,
  name,
  description,
  price,
  image_url,
}: ItemCardProps) {
  const { items, addItem, updateQuantity, mounted } = useCart();
  const cartEntry = items.find((i) => i.id === id);
  const quantity = cartEntry?.quantity ?? 0;

  return (
    <Card className="overflow-hidden">
      {image_url && (
        <img src={image_url} alt={name} className="w-full h-40 object-cover" />
      )}

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{name}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {description}
              </p>
            )}
            <p className="text-sm font-bold mt-2">₹{price}</p>
          </div>

          <div className="shrink-0 mt-1">
            {!mounted || quantity === 0 ? (
              <Button
                size="sm"
                variant="outline"
                style={{
                  borderColor: "var(--theme-color)",
                  color: "var(--theme-color)",
                }}
                onClick={() => addItem({ id, name, price, image_url })}
              >
                ADD
              </Button>
            ) : (
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => updateQuantity(id, quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span
                  className="text-sm font-bold w-5 text-center"
                  style={{ color: "var(--theme-color)" }}
                >
                  {quantity}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => addItem({ id, name, price, image_url })}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
