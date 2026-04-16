import { getBusinessBySlug } from "@/lib/public-fetches/get-business-by-slug";
import { getAllBoutiqueItems } from "@/lib/public-fetches/get-all-items";
import { getCategoriesByBusinessId } from "@/lib/public-fetches/get-categories-by-id";
import { BoutiqueProductsShell } from "@/components/public/public-boutique/catalogpage/boutique-products-shell";
import { BoutiqueHeaderServer } from "@/components/public/public-boutique/header/boutique-header-server";

interface ProductsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ collection?: string; category?: string }>;
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { slug } = await params;
  const { collection, category } = await searchParams;

  const business = await getBusinessBySlug(slug);
  const [items, categories] = await Promise.all([
    getAllBoutiqueItems(business.id),
    getCategoriesByBusinessId(business.id),
  ]);
  return (
    <>
      <BoutiqueHeaderServer slug={slug} />
      <BoutiqueProductsShell
        items={items}
        slug={slug}
        categories={categories}
        initialCollection={collection ?? null}
        initialCategory={category ?? null}
      />
    </>
  );
}
