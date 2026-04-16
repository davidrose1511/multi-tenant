"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { BoutiqueItem } from "../shared/item-types";
import { COLLECTIONS } from "@/lib/constants/collections";

type Props = {
  item: BoutiqueItem;
  onEdit: (item: BoutiqueItem) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
};

export function BoutiqueItemCard({ item, onEdit, onDelete, onToggle }: Props) {
  const [imageIndex, setImageIndex] = useState(0);
  const images = item.images ?? [];
  const hasMultiple = images.length > 1;
  const currentImage = images[imageIndex]?.url;

  function prev(e: React.MouseEvent) {
    e.stopPropagation();
    setImageIndex((i) => (i - 1 + images.length) % images.length);
  }

  function next(e: React.MouseEvent) {
    e.stopPropagation();
    setImageIndex((i) => (i + 1) % images.length);
  }

  return (
    <Card
      className={`transition-all h-fit duration-300 overflow-hidden ${!item.is_available ? "opacity-60" : ""}`}
    >
      <div className="relative w-full aspect-square bg-muted">
        {currentImage ? (
          <img
            src={currentImage}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}

        {/* arrows + dots — only when image exists */}
        {currentImage && hasMultiple && (
          <>
            <button
              onClick={prev}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-1 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 text-white" />
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageIndex(i);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imageIndex ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
            <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {imageIndex + 1}/{images.length}
            </span>
          </>
        )}

        {/* badges — always visible regardless of image */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.is_new && (
            <span className="bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide">
              New
            </span>
          )}
          {item.is_featured && (
            <span className="bg-black/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide">
              Featured
            </span>
          )}
          {item.collection && (
            <span className="bg-accent text-accent-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide">
              {COLLECTIONS.find((c) => c.value === item.collection)?.label}
            </span>
          )}
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm leading-tight">{item.name}</CardTitle>
          <Badge
            className={`shrink-0 transition-all duration-200 ${
              item.is_available
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {item.is_available ? "Available" : "Unavailable"}
          </Badge>
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="pb-2 space-y-2">
        <p className="text-sm font-bold">₹{item.price}</p>
        {item.sizes && item.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.sizes.map((size) => (
              <span
                key={size}
                className="text-[11px] border border-border rounded px-1.5 py-0.5 text-muted-foreground"
              >
                {size}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          {item.color && <span>🎨 {item.color}</span>}
          {item.fabric && <span>🧵 {item.fabric}</span>}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-2">
        <div className="flex items-center gap-1.5">
          <Switch
            size="sm"
            onCheckedChange={() => onToggle(item.id)}
            checked={item.is_available}
          />
          <span className="text-sm text-muted-foreground">
            {item.is_available ? "On" : "Off"}
          </span>
        </div>
        <div className="flex gap-1">
          <Button
            onClick={() => onEdit(item)}
            variant="ghost"
            size="icon"
            className="h-7 w-7"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                <AlertDialogDescription>
                  {item.name} will be permanently deleted along with all its
                  images.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
