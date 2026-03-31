import { getBusinessBySlug } from "@/lib/public/get-business-by-slug";

import BoutiqueHeader from "@/components/public/public-boutique/boutique-header";
import BoutiqueHero from "@/components/public/public-boutique/boutique-hero";
import { BoutiqueFeaturedSection } from "@/components/public/public-boutique/boutique-featured-items";
import { getFeaturedAndNewItems } from "@/lib/public/get-featured-items";

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  const { featured, newArrivals } = await getFeaturedAndNewItems(
    business.id,
    8,
  );
  return (
    <div>
      <BoutiqueHeader slug={slug} />
      <BoutiqueHero />
      <BoutiqueFeaturedSection
        featuredItems={featured}
        newItems={newArrivals}
        slug={slug}
      />
      {/* pass categories where needed */}
    </div>
  );
}
