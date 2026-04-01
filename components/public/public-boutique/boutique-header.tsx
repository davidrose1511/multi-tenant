import Link from "next/link";
import { PublicAuthButton } from "../auth/public-auth-buttons";
import { getCategoriesByBusinessId } from "@/lib/public/get-categories-by-id";
import { getBusinessBySlug } from "@/lib/public/get-business-by-slug";
import { Container } from "../shared-components-public/container";
import { CartIcon } from "../cart/cart-icon";

export default async function BoutiqueHeader({ slug }: { slug: string }) {
  const business = await getBusinessBySlug(slug);
  const categories = await getCategoriesByBusinessId(business.id);

  return (
    <header className="fixed w-full z-50 top-0 bg-background border-b border-border">
      {/* ── Row 1: Logo + Auth ── */}
      <Container>
        <div className="relative flex items-center justify-center py-4">
          {/* Logo — centered, light editorial weight */}
          <Link href={`/${slug}`}>
            <span className="text-sm font-medium tracking-[0.3em] uppercase text-foreground">
              {business.name}
            </span>
          </Link>

          {/* Auth — pinned right */}
          <div className="ml-16 absolute right-0 flex items-center gap-3">
            <CartIcon />
            <PublicAuthButton slug={slug} />
          </div>
        </div>
      </Container>

      {/* ── Row 2: Categories ── */}
      <nav className="border-t border-border overflow-x-auto scrollbar-none">
        <ul className="flex items-center justify-center gap-8 py-3 text-xs font-semibold tracking-wider uppercase whitespace-nowrap text-muted-foreground">
          {categories
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/${slug}/category/${cat.id}`}
                  className="hover:text-foreground transition-colors duration-200"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          <li>
            <Link
              href={`/${slug}/about`}
              className="hover:text-foreground transition-colors duration-200"
            >
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
