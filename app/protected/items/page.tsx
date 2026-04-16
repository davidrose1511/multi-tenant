import { createClient } from "@/lib/supabase/server";
import { getBusiness } from "@/lib/dashboard-fetches/get-business";
import MenuShell from "@/components/dashboard-components/items/menu/menu-shell";
import BoutiqueShell from "@/components/dashboard-components/items/boutique/boutique-shell";
import {
  Category,
  CategoryWithMenuItems,
  CategoryWithBoutiqueItems,
  MenuItem,
  BoutiqueItem,
} from "@/components/dashboard-components/items/shared/item-types";

export default async function MenuPage() {
  const supabase = await createClient();
  const business = await getBusiness();
  const isBoutique = business.business_type === "boutique";

  // ── boutique fetch ────────────────────────────────────────────
  if (isBoutique) {
    const { data, error } = await supabase
      .from("categories")
      .select(`*, boutique_items(*, item_images(*))`)
      .eq("business_id", business.id)
      .order("sort_order");

    if (error)
      console.error("Failed to fetch boutique catalogue:", error.message);

    const raw: CategoryWithBoutiqueItems[] = data ?? [];
    const categories: Category[] = raw.map(
      ({ boutique_items: _, ...cat }) => cat,
    );
    const items: BoutiqueItem[] = raw.flatMap((cat) =>
      cat.boutique_items.map(({ item_images, ...item }) => ({
        ...item,
        images: item_images ?? [],
      })),
    );

    return (
      <BoutiqueShell
        businessId={business.id}
        initialCategories={categories}
        initialItems={items}
      />
    );
  }

  // ── restaurant fetch ──────────────────────────────────────────
  const { data, error } = await supabase
    .from("categories")
    .select(`*, menu_items(*, item_images(*))`)
    .eq("business_id", business.id)
    .order("sort_order");

  if (error) console.error("Failed to fetch menu:", error.message);

  const raw: CategoryWithMenuItems[] = data ?? [];
  const categories: Category[] = raw.map(({ menu_items: _, ...cat }) => cat);
  const items: MenuItem[] = raw.flatMap((cat) =>
    cat.menu_items.map(({ item_images, ...item }) => ({
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
