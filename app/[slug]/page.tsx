import { getBusinessBySlug } from "@/lib/public/get-business-by-slug";

import BoutiqueHeader from "@/components/public/public-boutique/boutique-header";
import BoutiqueHero from "@/components/public/public-boutique/boutique-hero";
import { BoutiqueFeaturedSection } from "@/components/public/public-boutique/boutique-featured-items";
import { getHomepageItems } from "@/lib/public/get-homepage-items";
import { BoutiqueCollectionSection } from "@/components/public/public-boutique/boutique-collections-section";

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  const { featured, newArrivals, collection } = await getHomepageItems(
    business.id,
    "summer",
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
      <BoutiqueCollectionSection
        items={collection}
        slug={slug}
        collectionValue="summer"
      />
      {/* pass categories where needed */}
    </div>
  );
}
