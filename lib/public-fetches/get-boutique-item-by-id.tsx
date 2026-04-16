import { createClient } from "@/lib/supabase/server";

export interface BoutiqueItemDetail {
  id: string;
  name: string;
  price: number;
  description: string | null;
  fabric: string | null;
  care: string | null;
  color: string | null;
  sizes: string[];
  is_new: boolean;
  is_featured: boolean;
  collection: string | null;
  category_id: string | null;
  images: { url: string; sort_order: number }[];
}

export async function getBoutiqueItemById(
  itemId: string,
): Promise<BoutiqueItemDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("boutique_items")
    .select(
      `id, name, price, description, fabric, care, color, sizes,
       is_new, is_featured, collection, category_id,
       item_images ( url, sort_order )`,
    )
    .eq("id", itemId)
    .single();

  if (error || !data) {
    console.error("getBoutiqueItemById error:", error);
    return null;
  }

  const images = (data.item_images ?? []).sort(
    (a: any, b: any) => a.sort_order - b.sort_order,
  );

  return {
    id: data.id,
    name: data.name,
    price: Number(data.price),
    description: data.description ?? null,
    fabric: data.fabric ?? null,
    care: data.care ?? null,
    color: data.color ?? null,
    sizes: data.sizes ?? [],
    is_new: data.is_new ?? false,
    is_featured: data.is_featured ?? false,
    collection: data.collection ?? null,
    category_id: data.category_id ?? null,
    images,
  };
}
