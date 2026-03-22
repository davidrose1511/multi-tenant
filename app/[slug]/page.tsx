import { getBusinessBySlug } from "@/lib/get-business-by-slug";
import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/public/layout/hero";
import { MenuSection } from "@/components/public/items/menu-section";
import { Features } from "@/components/public/layout/features";
import { CategoryWithItems } from "@/components/menu/menu-types";
import { CartBar } from "@/components/public/cart/cart-bar";
import { PublicHeader } from "@/components/public/layout/public-header";
import { PublicFooter } from "@/components/public/layout/public-footer";
export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(`*, items(*, item_images(*))`)
    .eq("business_id", business.id)
    .order("sort_order");

  if (error) console.error("Failed to fetch menu:", error.message);

  const categories: CategoryWithItems[] = data ?? [];

  return (
    <div>
      <PublicHeader business={business} />
      <Hero business={business} />
      <MenuSection categories={categories} />
      <Features business={business} />
      <CartBar slug={slug} />
      <PublicFooter business={business} />
    </div>
  );
}
