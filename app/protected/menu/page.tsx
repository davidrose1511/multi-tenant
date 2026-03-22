import { createClient } from "@/lib/supabase/server";
import { getBusiness } from "@/lib/get-business";
import MenuShell from "@/components/menu/menu-shell";

import {
  Category,
  CategoryWithItems,
  Item,
} from "@/components/menu/menu-types";

export default async function MenuPage() {
  const supabase = await createClient();

  const business = await getBusiness();

  const { data, error } = await supabase
    .from("categories")
    .select(`*, items(*, item_images(*))`)
    .eq("business_id", business.id)
    .order("sort_order");

  if (error) console.error("Failed to fetch menu:", error.message);

  const raw: CategoryWithItems[] = data ?? [];
  const categories: Category[] = raw.map(({ items: _, ...cat }) => cat);
  const items: Item[] = raw.flatMap((cat) =>
    cat.items.map(({ item_images, ...item }) => ({
      ...item,
      images: item_images ?? [],
    })),
  );

  return (
    <MenuShell
      businessId={business.id}
      initialCategories={categories}
      initialItems={items}
    />
  );
}
