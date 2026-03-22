import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { PublicAuthButton } from "../auth/public-auth-buttons";

type Business = {
  name: string;
  slug: string;
  logo_url: string | null;
  theme_color: string | null;
};

export function PublicHeader({ business }: { business: Business }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {business.logo_url ? (
            <img
              src={business.logo_url}
              alt={business.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: "var(--theme-color)" }}
            >
              {business.name?.[0]?.toUpperCase()}
            </div>
          )}
          <span className="font-semibold text-sm">{business.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <PublicAuthButton slug={business.slug} />
        </div>
      </div>
    </header>
  );
}
