import { getBusinessBySlug } from "@/lib/public/get-business-by-slug";
import { CartProvider } from "@/components/public/cart/cart-provider";
import { BusinessProvider } from "@/lib/owner/business-context";
import { getCategoriesByBusinessId } from "@/lib/public/get-categories-by-id";
import { CategoryProvider } from "@/lib/public/categories-context";
import {
  cormorant,
  tenorSans,
} from "@/components/public/shared-components-public/fonts";
import "./boutique.css";

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

  const isBoutique = business.business_type === "boutique";

  return (
    <BusinessProvider business={business}>
      <CategoryProvider categories={categories}>
        <CartProvider slug={slug}>
          <style>{`
            :root { --theme-color: #C9897A; }
          `}</style>

          <main
            className={`
            min-h-screen flex flex-col bg-background
            ${isBoutique ? "boutique-site" : ""}
            ${cormorant.variable} ${tenorSans.variable}
          `}
            style={
              {
                "--theme-color": "#C9897A",
              } as React.CSSProperties
            }
          >
            {children}
          </main>
        </CartProvider>
      </CategoryProvider>
    </BusinessProvider>
  );
}
