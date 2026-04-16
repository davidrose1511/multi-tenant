import { createClient } from "@/lib/supabase/server";
import BoutiqueHeader from "@/components/public/public-boutique/header/boutique-header";
import { getCategoriesByBusinessId } from "@/lib/public-fetches/get-categories-by-id";
import { getBusinessBySlug } from "@/lib/public-fetches/get-business-by-slug";

export async function BoutiqueHeaderServer({ slug }: { slug: string }) {
  const [supabase, business] = await Promise.all([
    createClient(),
    getBusinessBySlug(slug),
  ]);

  const [{ data }, categories] = await Promise.all([
    supabase.auth.getClaims(),
    getCategoriesByBusinessId(business.id),
  ]);

  const user = data?.claims ? { email: data.claims.email as string } : null;

  return (
    <BoutiqueHeader
      slug={slug}
      business={business}
      categories={categories}
      user={user}
    />
  );
}
