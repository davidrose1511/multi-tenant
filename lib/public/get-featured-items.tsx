import { createClient } from "@/lib/supabase/server";
import type { CatalogCardItem } from "@/components/items/shared/item-types";

function shapeItem(item: any): CatalogCardItem {
  const images = (item.item_images ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .slice(0, 2);

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
  };
}

export async function getFeaturedAndNewItems(
  businessId: string,
  limit = 6,
): Promise<{ featured: CatalogCardItem[]; newArrivals: CatalogCardItem[] }> {
  const supabase = await createClient();

  // Single query — get all featured OR new items at once
  const { data, error } = await supabase
    .from("boutique_items")
    .select(
      `
      id, name, price, color, sizes, is_new, is_featured,
      item_images ( url, sort_order )
    `,
    )
    .eq("business_id", businessId)
    .eq("is_available", true)
    .or("is_featured.eq.true,is_new.eq.true")
    .order("sort_order", { ascending: true })
    .limit(50); // generous limit, we split client-side

  if (error || !data) return { featured: [], newArrivals: [] };

  const featured = data
    .filter((i) => i.is_featured)
    .slice(0, limit)
    .map(shapeItem);

  const newArrivals = data
    .filter((i) => i.is_new)
    .slice(0, limit)
    .map(shapeItem);

  return { featured, newArrivals };
}
