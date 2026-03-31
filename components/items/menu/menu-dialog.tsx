"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuItem, Category } from "../shared/item-types";

// This is all the dialog cares about — just what the user fills in
export type MenuForm = {
  name: string;
  description: string;
  price: string;
  category_id: string;
  image_url: string;
};

type ItemDialogProps = {
  item: MenuItem | null; // null = add mode, Item = edit mode
  categoryId: string; // pre-selected category for add mode
  categories: Category[];
  onSave: (form: MenuForm) => void; // just passes form fields, shell does the rest
  onClose: () => void;
};

function emptyForm(categoryId: string): MenuForm {
  return {
    name: "",
    description: "",
    price: "",
    category_id: categoryId,
    image_url: "",
  };
}

function itemToForm(item: MenuItem): MenuForm {
  return {
    name: item.name,
    description: item.description ?? "",
    price: item.price.toString(),
    category_id: item.category_id ?? "",
    image_url: item.images?.[0]?.url ?? "",
  };
}

export function ItemDialog({
  item,
  categoryId,
  categories,
  onSave,
  onClose,
}: ItemDialogProps) {
  const isEditing = item !== null;

  const [form, setForm] = useState<MenuForm>(
    isEditing ? itemToForm(item) : emptyForm(categoryId),
  );

  // reset form when dialog opens with a different item
  useEffect(() => {
    setForm(isEditing ? itemToForm(item) : emptyForm(categoryId));
  }, [item, categoryId]);

  function handleSave() {
    if (!form.name.trim() || !form.price || !form.category_id) return;
    onSave(form);
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Butter Chicken"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              placeholder="Optional"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.category_id}
              onValueChange={(v) => setForm((f) => ({ ...f, category_id: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              placeholder="e.g. 299"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              placeholder="https://..."
              value={form.image_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, image_url: e.target.value }))
              }
            />
            {form.image_url.trim() && (
              <img
                src={form.image_url}
                alt="preview"
                className="w-full h-32 object-cover rounded-md"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>{isEditing ? "Save" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
