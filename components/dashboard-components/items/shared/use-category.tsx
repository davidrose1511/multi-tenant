"use client";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Category } from "./item-types";

export function useCategories(
  businessId: string,
  initialCategories: Category[],
) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const supabase = createClient();

  async function uploadCoverImage(
    categoryId: string,
    file: File,
  ): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const path = `categories/${businessId}/${categoryId}.${ext}`;
    const { error } = await supabase.storage
      .from("item-images")
      .upload(path, file, { upsert: true });
    if (error) {
      toast.error("Failed to upload image");
      return null;
    }
    const { data } = supabase.storage.from("item-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleAddCategory(
    name: string,
    tagline?: string,
    coverFile?: File,
  ) {
    const tempId = Date.now().toString();
    const newCategory: Category = {
      id: tempId,
      name,
      tagline: tagline ?? null,
      cover_image_url: null,
      business_id: businessId,
      sort_order: categories.length,
      created_at: new Date().toISOString(),
    };
    setCategories((prev) => [...prev, newCategory]);

    const { data, error } = await supabase
      .from("categories")
      .insert({
        business_id: businessId,
        name,
        tagline,
        sort_order: categories.length,
      })
      .select()
      .single();

    if (error || !data) {
      setCategories((prev) => prev.filter((c) => c.id !== tempId));
      toast.error("Failed to add category");
      return;
    }

    let cover_image_url: string | null = null;
    if (coverFile) {
      cover_image_url = await uploadCoverImage(data.id, coverFile);
      if (cover_image_url) {
        await supabase
          .from("categories")
          .update({ cover_image_url })
          .eq("id", data.id);
      }
    }

    setCategories((prev) =>
      prev.map((c) =>
        c.id === tempId ? { ...newCategory, id: data.id, cover_image_url } : c,
      ),
    );
    toast.success("Category added");
  }

  async function handleEditCategory(
    id: string,
    name: string,
    tagline?: string,
    coverFile?: File,
  ) {
    const previous = categories;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, name, tagline: tagline ?? null } : c,
      ),
    );

    let cover_image_url: string | undefined = undefined;
    if (coverFile) {
      const url = await uploadCoverImage(id, coverFile);
      if (url) cover_image_url = url;
    }

    const { error } = await supabase
      .from("categories")
      .update({
        name,
        tagline,
        ...(cover_image_url ? { cover_image_url } : {}),
      })
      .eq("id", id);

    if (error) {
      setCategories(previous);
      toast.error("Failed to update category");
      return;
    }

    if (cover_image_url) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, cover_image_url: cover_image_url! } : c,
        ),
      );
    }

    toast.success("Category updated");
  }

  async function handleDeleteCategory(
    id: string,
    onItemsInvalidate?: () => void,
  ) {
    const previous = categories;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    onItemsInvalidate?.();

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      setCategories(previous);
      toast.error("Failed to delete category");
      return;
    }

    // best effort — clean up storage too
    await supabase.storage
      .from("item-images")
      .remove([`categories/${businessId}/${id}`]);

    toast.success("Category deleted");
  }

  return {
    categories,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
  };
}
