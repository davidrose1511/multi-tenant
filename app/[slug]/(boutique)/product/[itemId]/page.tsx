import { notFound } from "next/navigation";
import { getBoutiqueItemById } from "@/lib/public-fetches/get-boutique-item-by-id";
import { getBusinessBySlug } from "@/lib/public-fetches/get-business-by-slug";
import { getCategoriesByBusinessId } from "@/lib/public-fetches/get-categories-by-id";
import { BoutiqueHeaderServer } from "@/components/public/public-boutique/header/boutique-header-server";
import { BoutiqueProductDetail } from "@/components/public/public-boutique/productdetailpage/detail-page";

interface ProductPageProps {
  params: Promise<{ slug: string; itemId: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, itemId } = await params;

  const [business, item] = await Promise.all([
    getBusinessBySlug(slug),
    getBoutiqueItemById(itemId),
  ]);

  if (!item) notFound();

  const categories = await getCategoriesByBusinessId(business.id);
  const category = categories.find((c) => c.id === item.category_id);

  return (
    <>
      <BoutiqueHeaderServer slug={slug} />
      <div className="boutique-header-offset">
        <BoutiqueProductDetail
          item={item}
          slug={slug}
          categoryName={category?.name ?? null}
        />
      </div>
    </>
  );
}
