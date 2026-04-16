import { createClient } from "@/lib/supabase/server";
import { Category } from "@/components/dashboard-components/items/shared/item-types";

export async function getCategoriesByBusinessId(
  businessId: string,
): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("business_id", businessId)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  return data;
}
