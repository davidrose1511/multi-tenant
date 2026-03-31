"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { MenuItem } from "../shared/item-types";
import { MenuForm } from "./menu-dialog";

export function useMenu(businessId: string, initialItems: MenuItem[]) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const supabase = createClient();

  async function handleAddItem(form: MenuForm) {
    const tempId = Date.now().toString();
    const newItem: MenuItem = {
      id: tempId,
      business_id: businessId,
      category_id: form.category_id,
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      is_available: true,
      is_featured: false,
      sort_order: 0,
      metadata: {},
      images: form.image_url.trim()
        ? [
            {
              id: tempId,
              menu_item_id: tempId,
              boutique_item_id: null,
              business_id: businessId,
              url: form.image_url.trim(),
              sort_order: 0,
              created_at: new Date().toISOString(),
            },
          ]
        : [],
      created_at: new Date().toISOString(),
    };
    setItems((prev) => [...prev, newItem]);

    const { data: insertedItem, error } = await supabase
      .from("menu_items")
      .insert({
        business_id: businessId,
        category_id: form.category_id,
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: parseFloat(form.price),
      })
      .select()
      .single();

    if (error || !insertedItem) {
      setItems((prev) => prev.filter((i) => i.id !== tempId));
      toast.error("Failed to add item");
      return;
    }

    if (form.image_url.trim()) {
      await supabase.from("item_images").insert({
        menu_item_id: insertedItem.id,
        boutique_item_id: null,
        business_id: businessId,
        url: form.image_url.trim(),
        sort_order: 0,
      });
    }

    setItems((prev) =>
      prev.map((i) =>
        i.id === tempId
          ? {
              ...newItem,
              id: insertedItem.id,
              images: newItem.images.map((img) => ({
                ...img,
                id: insertedItem.id,
                menu_item_id: insertedItem.id,
              })),
            }
          : i,
      ),
    );
    toast.success("Item added");
  }

  async function handleEditItem(form: MenuForm, existing: MenuItem) {
    const updatedItem: MenuItem = {
      ...existing,
      category_id: form.category_id,
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      images: form.image_url.trim()
        ? [
            {
              ...(existing.images?.[0] ?? {
                id: Date.now().toString(),
                menu_item_id: existing.id,
                boutique_item_id: null,
                business_id: businessId,
                sort_order: 0,
                created_at: new Date().toISOString(),
              }),
              url: form.image_url.trim(),
            },
          ]
        : [],
    };
    setItems((prev) =>
      prev.map((i) => (i.id === existing.id ? updatedItem : i)),
    );

    const { error } = await supabase
      .from("menu_items")
      .update({
        category_id: form.category_id,
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: parseFloat(form.price),
      })
      .eq("id", existing.id);

    if (error) {
      setItems((prev) =>
        prev.map((i) => (i.id === existing.id ? existing : i)),
      );
      toast.error("Failed to update item");
      return;
    }

    if (form.image_url.trim()) {
      if (existing.images?.[0]) {
        await supabase
          .from("item_images")
          .update({ url: form.image_url.trim() })
          .eq("id", existing.images[0].id);
      } else {
        await supabase.from("item_images").insert({
          menu_item_id: existing.id,
          boutique_item_id: null,
          business_id: businessId,
          url: form.image_url.trim(),
          sort_order: 0,
        });
      }
    }

    toast.success("Item updated");
  }

  async function handleDeleteItem(id: string) {
    const previous = items;
    setItems((prev) => prev.filter((i) => i.id !== id));

    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    if (error) {
      setItems(previous);
      toast.error("Failed to delete item");
      return;
    }

    toast.success("Item deleted");
  }

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
      .from("menu_items")
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

  return {
    items,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleToggleItem,
  };
}
