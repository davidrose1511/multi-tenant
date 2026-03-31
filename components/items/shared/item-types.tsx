// ─────────────────────────────────────────────
// Shared
// ─────────────────────────────────────────────

export type ItemImage = {
  id: string;
  business_id: string;
  menu_item_id?: string | null;
  boutique_item_id?: string | null;
  url: string;
  sort_order: number;
  created_at: string;
};

export type Category = {
  id: string;
  business_id: string;
  name: string;
  sort_order: number;
  created_at: string;
  tagline: string | null; // add this
  cover_image_url: string | null; // add this
};

// ─────────────────────────────────────────────
// Restaurant
// ─────────────────────────────────────────────

export type MenuItem = {
  id: string;
  business_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  images: ItemImage[];
  created_at: string;
  metadata: Record<string, unknown>;
};

// Raw shape from supabase nested select before flattening
export type CategoryWithMenuItems = Category & {
  menu_items: (Omit<MenuItem, "images"> & { item_images: ItemImage[] })[];
};

// ─────────────────────────────────────────────
// Boutique
// ─────────────────────────────────────────────

export type BoutiqueItem = {
  id: string;
  business_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  sizes: string[];
  fabric: string | null;
  care: string | null;
  color: string | null;
  is_new: boolean;
  images: ItemImage[];
  created_at: string;
  collection: CollectionType | null;
};
export interface CatalogCardItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  image_hover_url?: string | null; // second image, for hover swap
  color?: string;
  hover_color?: string;
  is_new?: boolean;
  is_featured?: boolean;
  sizes?: string[];
}

export type CollectionType =
  | "summer"
  | "winter"
  | "spring"
  | "festive"
  | "bridal"
  | "everyday";

// Raw shape from supabase nested select before flattening
export type CategoryWithBoutiqueItems = Category & {
  boutique_items: (Omit<BoutiqueItem, "images"> & {
    item_images: ItemImage[];
  })[];
};

// ─────────────────────────────────────────────
// Form types (what dialogs submit)
// ─────────────────────────────────────────────

export type MenuItemForm = {
  name: string;
  description: string;
  price: string;
  category_id: string;
  image_url: string; // single image, pasted URL
};

export type BoutiqueItemForm = {
  name: string;
  description: string;
  price: string;
  category_id: string;
  sizes: string[];
  fabric: string;
  care: string;
  color: string;
  is_new: boolean;
  is_featured: boolean;
  collection: CollectionType | null;
  newImageFiles: File[]; // freshly picked files to upload
  existingImageUrls: string[]; // already saved urls (edit mode — keep these)
};
