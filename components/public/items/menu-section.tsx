"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ItemCard } from "./public-item-card";
import { CategoryWithItems } from "@/components/menu/menu-types";

export function MenuSection({
  categories,
}: {
  categories: CategoryWithItems[];
}) {
  const defaultOpen = categories.map((c) => c.id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-6">Menu</h2>

      {categories.length === 0 && (
        <p className="text-sm text-muted-foreground">No items available yet.</p>
      )}

      <Accordion type="multiple" defaultValue={defaultOpen}>
        {categories.map((category) => {
          const availableItems = category.items.filter((i) => i.is_available);
          if (availableItems.length === 0) return null;

          return (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="text-base font-semibold">
                <span>
                  {category.name}
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    ({availableItems.length})
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  {availableItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      description={item.description}
                      price={Number(item.price)}
                      image_url={item.item_images?.[0]?.url ?? null}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
