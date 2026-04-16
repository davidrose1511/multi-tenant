import Link from "next/link";
import { Container } from "../../shared-components-public/container";
import { CartIcon } from "../../cart/cart-icon";
import { MobileMenu } from "./boutique-mobile-menu";
import {
  Business,
  Category,
} from "@/components/dashboard-components/items/shared/item-types";
import { AuthPopover } from "../boutique-auth-popover";

type Props = {
  slug: string;
  business: Business;
  categories: Category[];
  user: { email: string } | null;
};

export default async function BoutiqueHeader({
  slug,
  business,
  categories,
  user,
}: Props) {
  return (
    <header className="fixed w-full z-50 top-0 bg-background border-b border-border">
      {/* ── Row 1: Logo + Auth ── */}
      <Container>
        <div className="relative flex items-center justify-center py-4">
          {/* Mobile hamburger — left, hidden md+ */}
          <div className="absolute left-0 flex md:hidden">
            <MobileMenu slug={slug} />
          </div>

          {/* Logo — centered */}
          <Link href={`/${slug}`}>
            <span className="text-sm font-medium tracking-[0.3em] uppercase text-foreground">
              {business.name}
            </span>
          </Link>

          {/* Cart + Auth — right, always visible */}
          <div className="absolute right-0 flex items-center gap-1">
            <AuthPopover slug={slug} user={user} />
            <CartIcon />
          </div>
        </div>
      </Container>

      {/* ── Row 2: Category nav — desktop only ── */}
      <nav className="hidden md:block border-t border-border overflow-x-auto scrollbar-none">
        <ul className="flex items-center justify-center gap-8 py-3 text-xs font-semibold tracking-wider uppercase whitespace-nowrap text-muted-foreground">
          {categories
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/${slug}/products?category=${cat.id}`}
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
