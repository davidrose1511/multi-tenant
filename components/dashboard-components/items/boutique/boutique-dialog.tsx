"use client";

import { useEffect, useRef, useState } from "react";
import { X, Upload, ImagePlus } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BoutiqueItem,
  BoutiqueItemForm,
  Category,
  CollectionType,
} from "../shared/item-types";
import { COLLECTIONS } from "@/lib/constants/collections";

const PRESET_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

function emptyForm(categoryId: string): BoutiqueItemForm {
  return {
    name: "",
    description: "",
    price: "",
    category_id: categoryId,
    sizes: [],
    fabric: "",
    care: "",
    color: "",
    is_new: false,
    is_featured: false,
    collection: null,
    newImageFiles: [],
    existingImageUrls: [],
  };
}

function itemToForm(item: BoutiqueItem): BoutiqueItemForm {
  return {
    name: item.name,
    description: item.description ?? "",
    price: item.price.toString(),
    category_id: item.category_id ?? "",
    sizes: item.sizes ?? [],
    fabric: item.fabric ?? "",
    care: item.care ?? "",
    color: item.color ?? "",
    is_new: item.is_new ?? false,
    is_featured: item.is_featured ?? false,
    collection: item.collection ?? null,
    newImageFiles: [],
    existingImageUrls: item.images.map((img) => img.url),
  };
}

function ImagePreview({
  src,
  label,
  onRemove,
}: {
  src: string;
  label?: string;
  onRemove: () => void;
}) {
  return (
    <div className="relative group w-24 h-24 rounded-md overflow-hidden border border-border flex-shrink-0">
      <img
        src={src}
        alt={label ?? "preview"}
        className="w-full h-full object-cover"
      />
      {label && (
        <span className="absolute bottom-0 left-0 right-0 text-[10px] text-center bg-black/50 text-white px-1 truncate">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3 text-white" />
      </button>
    </div>
  );
}

type Props = {
  item: BoutiqueItem | null;
  categoryId: string;
  categories: Category[];
  uploading: boolean;
  onSave: (form: BoutiqueItemForm) => void;
  onClose: () => void;
};

export function BoutiqueItemDialog({
  item,
  categoryId,
  categories,
  uploading,
  onSave,
  onClose,
}: Props) {
  const isEditing = item !== null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<BoutiqueItemForm>(
    isEditing ? itemToForm(item) : emptyForm(categoryId),
  );
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    setForm(isEditing ? itemToForm(item) : emptyForm(categoryId));
    setNewImagePreviews([]);
  }, [item, categoryId]);

  useEffect(() => {
    return () => newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [newImagePreviews]);

  function handleFilesPicked(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const previews = files.map((f) => URL.createObjectURL(f));
    setForm((f) => ({ ...f, newImageFiles: [...f.newImageFiles, ...files] }));
    setNewImagePreviews((prev) => [...prev, ...previews]);
    e.target.value = "";
  }

  function removeExistingImage(url: string) {
    setForm((f) => ({
      ...f,
      existingImageUrls: f.existingImageUrls.filter((u) => u !== url),
    }));
  }

  function removeNewImage(index: number) {
    URL.revokeObjectURL(newImagePreviews[index]);
    setForm((f) => ({
      ...f,
      newImageFiles: f.newImageFiles.filter((_, i) => i !== index),
    }));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleSize(size: string) {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size],
    }));
  }

  function handleSave() {
    if (!form.name.trim() || !form.price || !form.category_id) return;
    onSave(form);
  }

  const totalImages = form.existingImageUrls.length + form.newImageFiles.length;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Silk Wrap Dress"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          {/* Description */}
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

          {/* Category + Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category_id}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, category_id: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
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
                placeholder="e.g. 4999"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <Label>Sizes Available</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_SIZES.map((size) => (
                <Badge
                  key={size}
                  variant={form.sizes.includes(size) ? "default" : "outline"}
                  className="cursor-pointer select-none px-3 py-1"
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </Badge>
              ))}
            </div>
          </div>

          {/* Color + Fabric */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                placeholder="e.g. Ivory"
                value={form.color}
                onChange={(e) =>
                  setForm((f) => ({ ...f, color: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fabric">Fabric</Label>
              <Input
                id="fabric"
                placeholder="e.g. Pure Silk"
                value={form.fabric}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fabric: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Care */}
          <div className="space-y-2">
            <Label htmlFor="care">Care Instructions</Label>
            <Input
              id="care"
              placeholder="e.g. Dry clean only"
              value={form.care}
              onChange={(e) => setForm((f) => ({ ...f, care: e.target.value }))}
            />
          </div>

          {/* Toggles */}
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <p className="text-xs font-medium">Mark as New Arrival</p>
              <Switch
                checked={form.is_new}
                onCheckedChange={(v) => setForm((f) => ({ ...f, is_new: v }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <p className="text-xs font-medium">Mark as Featured Item</p>
              <Switch
                checked={form.is_featured}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, is_featured: v }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Collection</Label>
            <Select
              value={form.collection ?? "none"}
              onValueChange={(v) =>
                setForm((f) => ({
                  ...f,
                  collection: v === "none" ? null : (v as CollectionType),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="No collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No collection</SelectItem>
                {COLLECTIONS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>
                Images{" "}
                <span className="text-muted-foreground font-normal">
                  ({totalImages} added)
                </span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="w-3.5 h-3.5 mr-1.5" />
                Add Photos
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFilesPicked}
              />
            </div>

            {totalImages > 0 ? (
              <div className="flex gap-2 flex-wrap">
                {form.existingImageUrls.map((url) => (
                  <ImagePreview
                    key={url}
                    src={url}
                    onRemove={() => removeExistingImage(url)}
                  />
                ))}
                {newImagePreviews.map((src, i) => (
                  <ImagePreview
                    key={src}
                    src={src}
                    label={form.newImageFiles[i]?.name}
                    onRemove={() => removeNewImage(i)}
                  />
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span className="text-sm">Click to upload photos</span>
              </button>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={uploading}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={uploading}>
            {uploading ? "Saving…" : isEditing ? "Save" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
