import { getBusinessBySlug } from "@/lib/public-fetches/get-business-by-slug";
import { getHomepageItems } from "@/lib/public-fetches/get-homepage-items";
import { BoutiqueHeaderServer } from "@/components/public/public-boutique/header/boutique-header-server";
import BoutiqueHero from "@/components/public/public-boutique/homepage/boutique-hero";
import { BoutiqueFeaturedSection } from "@/components/public/public-boutique/homepage/boutique-featured-section";
import { BoutiqueCollectionSection } from "@/components/public/public-boutique/homepage/boutique-collections-section";
import { BoutiqueNewArrivalsSection } from "@/components/public/public-boutique/homepage/boutique-new-arrivals-section";
import { BoutiqueVisitSection } from "@/components/public/public-boutique/homepage/boutiqie-visit-us-section";
import { redirect } from "next/navigation";

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "healthy-chef") redirect(`/${slug}/patel-nagar`);
  const business = await getBusinessBySlug(slug);
  const { featured, newArrivals, collection } = await getHomepageItems(
    business.id,
    "summer",
    8,
  );

  return (
    <div>
      <BoutiqueHeaderServer slug={slug} />
      <BoutiqueHero />
      <BoutiqueFeaturedSection featuredItems={featured} slug={slug} />
      <BoutiqueCollectionSection
        items={collection}
        slug={slug}
        collectionValue="summer"
      />
      <BoutiqueNewArrivalsSection newItems={newArrivals} slug={slug} />
      <BoutiqueVisitSection />
    </div>
  );
}
