import { getBusinessBySlug } from "@/lib/public-fetches/get-business-by-slug";
import { CartProvider } from "@/lib/contexts/cart-provider";
import { BusinessProvider } from "@/lib/contexts/business-context";
import { getCategoriesByBusinessId } from "@/lib/public-fetches/get-categories-by-id";
import { CategoryProvider } from "@/lib/contexts/categories-context";

export default async function SlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  const categories = await getCategoriesByBusinessId(business.id);

  return (
    <BusinessProvider business={business}>
      <CategoryProvider categories={categories}>
        <CartProvider slug={slug}>{children}</CartProvider>
      </CategoryProvider>
    </BusinessProvider>
  );
}
