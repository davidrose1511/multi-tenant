"use client";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CatalogCardItem } from "@/components/dashboard-components/items/shared/item-types";
import Link from "next/link";
interface CatalogCardProps {
  item: CatalogCardItem;
  slug: string;
}

export function CatalogCard({ item, slug }: CatalogCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-0 shadow-none bg-transparent cursor-pointer",
      )}
    >
      {/* ── Image block ── */}
      <Link href={`/${slug}/product/${item.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl aspect-3/4">
          {/* ── Main image / color ── */}
          <div
            className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
            style={{ backgroundColor: item.color ?? "hsl(var(--muted))" }}
          >
            {/* TODO: uncomment once image_url is live
            <Image src={item.image_url} alt={item.name} fill className="object-cover" /> */}
          </div>

          {/* ── Hover image / color ── */}
          <div
            className="absolute inset-0 opacity-0 scale-105 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
            style={{
              backgroundColor: item.hover_color ?? "hsl(var(--accent))",
            }}
          >
            {/* TODO: uncomment once hover image is live
            <Image src={item.image_hover_url} alt={item.name} fill className="object-cover" /> */}
          </div>

          {/* ── Badges (top-left) ── */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {item.is_new && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-background/90 text-foreground shadow-sm">
                <Sparkles className="w-2.5 h-2.5" />
                New
              </span>
            )}
            {item.is_featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs  bg-foreground/80 text-background shadow-sm">
                Featured
              </span>
            )}
          </div>

          {/* ── View button — slides up on hover ── */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 z-10",
              "translate-y-full group-hover:translate-y-0",
              "transition-transform duration-300 ease-out",
            )}
          >
            <div className="mx-3 mb-3 px-4 py-2.5 rounded-xl bg-background/80 backdrop-blur-sm flex items-center justify-center gap-1.5">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-foreground">
                View
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-foreground" />
            </div>
          </div>
        </div>
      </Link>

      {/* ── Info row ── */}
      <div className="pt-3 px-0.5 flex flex-col gap-1 min-w-0">
        <Link
          href={`/${slug}/product/${item.id}`}
          className="text-sm font-medium text-foreground truncate"
        >
          {item.name}
        </Link>
        <span className="text-sm font-semibold text-foreground">
          ₹{item.price.toLocaleString("en-IN")}
        </span>
      </div>
    </Card>
  );
}
