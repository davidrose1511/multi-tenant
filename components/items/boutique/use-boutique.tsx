"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  BoutiqueItem,
  BoutiqueItemForm,
  ItemImage,
} from "../shared/item-types";

async function uploadImage(
  supabase: ReturnType<typeof createClient>,
  businessId: string,
  file: File,
): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const path = `${businessId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("item-images")
    .upload(path, file, { upsert: false });

  if (error) {
    console.error("Image upload failed:", error.message);
    return null;
  }

  const { data } = supabase.storage.from("item-images").getPublicUrl(path);
  return data.publicUrl;
}

export function useBoutique(businessId: string, initialItems: BoutiqueItem[]) {
  const [items, setItems] = useState<BoutiqueItem[]>(initialItems);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  // ── ADD ────────────────────────────────────────────────────────

  async function handleAddItem(form: BoutiqueItemForm) {
    setUploading(true);

    const { data: inserted, error } = await supabase
      .from("boutique_items")
      .insert({
        business_id: businessId,
        category_id: form.category_id || null,
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: parseFloat(form.price),
        sizes: form.sizes,
        fabric: form.fabric.trim() || null,
        care: form.care.trim() || null,
        color: form.color.trim() || null,
        is_new: form.is_new,
        is_featured: form.is_featured,
        collection: form.collection,
      })
      .select()
      .single();

    if (error || !inserted) {
      setUploading(false);
      toast.error("Failed to add item");
      return;
    }

    const uploadedImages = await uploadAndInsertImages(
      inserted.id,
      form.newImageFiles,
    );

    const newItem: BoutiqueItem = {
      id: inserted.id,
      business_id: businessId,
      category_id: form.category_id || null,
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      is_available: true,
      is_featured: form.is_featured,
      sort_order: 0,
      sizes: form.sizes,
      fabric: form.fabric.trim() || null,
      care: form.care.trim() || null,
      color: form.color.trim() || null,
      is_new: form.is_new,
      images: uploadedImages,
      collection: form.collection,
      created_at: inserted.created_at,
    };

    setItems((prev) => [...prev, newItem]);
    setUploading(false);
    toast.success("Item added");
  }

  // ── EDIT ───────────────────────────────────────────────────────

  async function handleEditItem(
    form: BoutiqueItemForm,
    existing: BoutiqueItem,
  ) {
    setUploading(true);

    const { error } = await supabase
      .from("boutique_items")
      .update({
        category_id: form.category_id || null,
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: parseFloat(form.price),
        sizes: form.sizes,
        fabric: form.fabric.trim() || null,
        care: form.care.trim() || null,
        color: form.color.trim() || null,
        is_new: form.is_new,
        is_featured: form.is_featured,
        collection: form.collection,
      })
      .eq("id", existing.id);

    if (error) {
      setUploading(false);
      toast.error("Failed to update item");
      return;
    }

    // delete removed images
    const keptUrls = new Set(form.existingImageUrls);
    const toDelete = existing.images.filter((img) => !keptUrls.has(img.url));

    if (toDelete.length > 0) {
      await supabase
        .from("item_images")
        .delete()
        .in(
          "id",
          toDelete.map((img) => img.id),
        );

      const paths = toDelete
        .map((img) => {
          const marker = "/item-images/";
          const idx = img.url.indexOf(marker);
          return idx !== -1 ? img.url.slice(idx + marker.length) : null;
        })
        .filter(Boolean) as string[];

      if (paths.length > 0) {
        await supabase.storage.from("item-images").remove(paths);
      }
    }

    const newImages = await uploadAndInsertImages(
      existing.id,
      form.newImageFiles,
    );
    const keptImages = existing.images.filter((img) => keptUrls.has(img.url));

    setItems((prev) =>
      prev.map((item) =>
        item.id === existing.id
          ? {
              ...item,
              category_id: form.category_id || null,
              name: form.name.trim(),
              description: form.description.trim() || null,
              price: parseFloat(form.price),
              sizes: form.sizes,
              fabric: form.fabric.trim() || null,
              care: form.care.trim() || null,
              color: form.color.trim() || null,
              is_new: form.is_new,
              is_featured: form.is_featured,
              collection: form.collection,
              images: [...keptImages, ...newImages],
            }
          : item,
      ),
    );

    setUploading(false);
    toast.success("Item updated");
  }

  // ── DELETE ─────────────────────────────────────────────────────

  async function handleDeleteItem(id: string) {
    const previous = items;
    setItems((prev) => prev.filter((i) => i.id !== id));

    const { error } = await supabase
      .from("boutique_items")
      .delete()
      .eq("id", id);

    if (error) {
      setItems(previous);
      toast.error("Failed to delete item");
      return;
    }

    toast.success("Item deleted");
  }

  // ── TOGGLE ─────────────────────────────────────────────────────

  async function handleToggleItem(id: string) {
    const previous = items;
    const item = items.find((i) => i.id === id);
    if (!item) return;

    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, is_available: !i.is_available } : i,
      ),
    );

    const { error } = await supabase
      .from("boutique_items")
      .update({ is_available: !item.is_available })
      .eq("id", id);

    if (error) {
      setItems(previous);
      toast.error("Failed to update availability");
      return;
    }

    toast.success(
      item.is_available ? "Item marked unavailable" : "Item marked available",
    );
  }

  // ── INTERNAL ───────────────────────────────────────────────────

  async function uploadAndInsertImages(
    itemId: string,
    files: File[],
  ): Promise<ItemImage[]> {
    if (!files.length) return [];
    const results: ItemImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(supabase, businessId, files[i]);
      if (!url) continue;

      const { data, error } = await supabase
        .from("item_images")
        .insert({
          boutique_item_id: itemId,
          menu_item_id: null,
          business_id: businessId,
          url,
          sort_order: i,
        })
        .select()
        .single();

      if (!error && data) results.push(data as ItemImage);
    }

    return results;
  }

  return {
    items,
    uploading,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleToggleItem,
    setItems,
  };
}
