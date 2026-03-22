"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Item, Category } from "./menu-types";
import { ItemForm } from "./item-dialog";

export function useMenu(
  businessId: string,
  initialCategories: Category[],
  initialItems: Item[],
) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const supabase = createClient();

  // ── item handlers ──────────────────────────────────────────────────────

  async function handleAddItem(form: ItemForm) {
    const tempId = Date.now().toString();
    const newItem: Item = {
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
              item_id: tempId,
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
      .from("items")
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
        item_id: insertedItem.id,
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
                item_id: insertedItem.id,
              })),
            }
          : i,
      ),
    );
    toast.success("Item added");
  }

  async function handleEditItem(form: ItemForm, existing: Item) {
    const updatedItem: Item = {
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
                item_id: existing.id,
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
      .from("items")
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
          item_id: existing.id,
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

    const { error } = await supabase.from("items").delete().eq("id", id);

    if (error) {
      setItems(previous);
      toast.error("Failed to delete item");
      return;
    }

    toast.success("Item deleted");
  }

  async function handleToggleItem(id: string) {
    const previous = items;
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, is_available: !i.is_available } : i,
      ),
    );

    const item = items.find((i) => i.id === id);
    if (!item) return;

    const { error } = await supabase
      .from("items")
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

  // ── category handlers ──────────────────────────────────────────────────

  async function handleAddCategory(name: string) {
    const tempId = Date.now().toString();
    const newCategory: Category = {
      id: tempId,
      name,
      business_id: businessId,
      sort_order: categories.length,
      created_at: new Date().toISOString(),
    };
    setCategories((prev) => [...prev, newCategory]);

    const { data, error } = await supabase
      .from("categories")
      .insert({ business_id: businessId, name, sort_order: categories.length })
      .select()
      .single();

    if (error || !data) {
      setCategories((prev) => prev.filter((c) => c.id !== tempId));
      toast.error("Failed to add category");
      return;
    }

    setCategories((prev) =>
      prev.map((c) => (c.id === tempId ? { ...newCategory, id: data.id } : c)),
    );
    toast.success("Category added");
  }

  async function handleEditCategory(id: string, name: string) {
    const previous = categories;
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c)),
    );

    const { error } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", id);

    if (error) {
      setCategories(previous);
      toast.error("Failed to update category");
      return;
    }

    toast.success("Category updated");
  }

  async function handleDeleteCategory(id: string) {
    const previous = categories;
    const previousItems = items;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setItems((prev) => prev.filter((i) => i.category_id !== id));

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      setCategories(previous);
      setItems(previousItems);
      toast.error("Failed to delete category");
      return;
    }

    toast.success("Category deleted");
  }

  return {
    items,
    categories,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleToggleItem,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
  };
}
