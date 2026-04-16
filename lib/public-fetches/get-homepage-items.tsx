import { createClient } from "@/lib/supabase/server";
import type { CatalogCardItem } from "@/components/dashboard-components/items/shared/item-types";
import { CollectionType } from "@/components/dashboard-components/items/shared/item-types";

function shapeItem(item: any, hoverImage = false): CatalogCardItem {
  const images = (item.item_images ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .slice(0, hoverImage ? 2 : 1);

  return {
    id: item.id,
    name: item.name,
    price: Number(item.price),
    color: item.color ?? undefined,
    hover_color: undefined,
    image_url: images[0]?.url ?? null,
    image_hover_url: hoverImage ? (images[1]?.url ?? null) : null,
    is_new: item.is_new ?? false,
    is_featured: item.is_featured ?? false,
    sizes: item.sizes ?? [],
  };
}

export async function getHomepageItems(
  businessId: string,
  collection: CollectionType | null,
  limit = 6,
): Promise<{
  featured: CatalogCardItem[];
  newArrivals: CatalogCardItem[];
  collection: CatalogCardItem[];
}> {
  const supabase = await createClient();

  // build the or filter dynamically
  const orFilter = [
    "is_featured.eq.true",
    "is_new.eq.true",
    collection ? `collection.eq.${collection}` : null,
  ]
    .filter(Boolean)
    .join(",");

  const { data, error } = await supabase
    .from("boutique_items")
    .select(
      `id, name, price, color, sizes, is_new, is_featured, collection, item_images ( url, sort_order )`,
    )
    .eq("business_id", businessId)
    .eq("is_available", true)
    .or(orFilter)
    .order("sort_order", { ascending: true })
    .limit(50);

  if (error || !data) return { featured: [], newArrivals: [], collection: [] };

  const featured = data
    .filter((i) => i.is_featured)
    .slice(0, limit)
    .map((i) => shapeItem(i, true));

  const newArrivals = data
    .filter((i) => i.is_new)
    .slice(0, limit)
    .map((i) => shapeItem(i, true));

  const collectionItems = collection
    ? data
        .filter((i) => i.collection === collection)
        .slice(0, 3)
        .map((i) => shapeItem(i, false)) // only 1 image needed
    : [];

  return { featured, newArrivals, collection: collectionItems };
}
