import { createClient } from "@/lib/supabase/server";
import type { CatalogCardItem } from "@/components/dashboard-components/items/shared/item-types";

function shapeItem(item: any): CatalogCardItem {
  const images = (item.item_images ?? []).sort(
    (a: any, b: any) => a.sort_order - b.sort_order,
  );
  return {
    id: item.id,
    name: item.name,
    price: Number(item.price),
    color: item.color ?? undefined,
    hover_color: undefined,
    image_url: images[0]?.url ?? null,
    image_hover_url: images[1]?.url ?? null,
    is_new: item.is_new ?? false,
    is_featured: item.is_featured ?? false,
    sizes: item.sizes ?? [],
    collection: item.collection ?? null,
    category_id: item.category_id ?? null,
  };
}

export async function getAllBoutiqueItems(
  businessId: string,
): Promise<CatalogCardItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("boutique_items")
    .select(
      `id, name, price, color, sizes, is_new, is_featured, collection,
       category_id, created_at,
       item_images ( url, sort_order )`,
    )
    .eq("business_id", businessId)
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.error("getAllBoutiqueItems error:", error);
    return [];
  }

  return data.map(shapeItem);
}
