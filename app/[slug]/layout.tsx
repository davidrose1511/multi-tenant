import { Button } from "@/components/ui/button";
import { getBusinessBySlug } from "@/lib/get-business-by-slug";
import { CartProvider } from "@/components/public/cart/cart-provider";

export default async function SlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  return (
    <CartProvider slug={slug}>
      <div
        style={
          {
            "--theme-color": business.theme_color ?? "#e63946",
          } as React.CSSProperties
        }
        className="min-h-screen flex flex-col"
      >
        {/* Page content */}
        <main className="flex-1 pb-24">{children}</main>

        {/* Footer */}
        <footer className="border-t py-6 text-center text-xs text-muted-foreground">
          <p>{business.name}</p>
          {business.address && <p className="mt-0.5">{business.address}</p>}
          {business.whatsapp_number && (
            <Button
              asChild
              variant="link"
              size="sm"
              className="mt-1"
              style={{ color: "var(--theme-color)" }}
            >
              <a href={`https://wa.me/${business.whatsapp_number}`}>
                WhatsApp us
              </a>
            </Button>
          )}
        </footer>
      </div>
    </CartProvider>
  );
}
