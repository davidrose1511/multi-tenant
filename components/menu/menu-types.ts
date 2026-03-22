export type ItemImage = {
  id: string;
  item_id: string;
  business_id: string;
  url: string;
  sort_order: number;
  created_at: string;
};

export type Item = {
  id: string;
  business_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  metadata: Record<string, unknown>;
  images: ItemImage[];
  created_at: string;
};

export type Category = {
  id: string;
  business_id: string;
  name: string;
  sort_order: number;
  created_at: string;
};

export type CategoryWithItems = Category & {
  items: (Omit<Item, "images"> & { item_images: ItemImage[] })[];
};
