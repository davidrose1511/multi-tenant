"use client";

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
import { Pencil, Trash2 } from "lucide-react";
import { MenuItem } from "../shared/item-types";

type ItemCardProps = {
  item: MenuItem;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (item: MenuItem) => void;
};

export function ItemCard({ item, onDelete, onToggle, onEdit }: ItemCardProps) {
  const image = item.images?.[0]?.url;

  return (
    <Card
      className={`transition-all duration-300 overflow-hidden ${!item.is_available ? "opacity-60" : ""}`}
    >
      {image && (
        <img
          src={image}
          alt={item.name}
          className="w-full h-72 object-contain"
        />
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{item.name}</CardTitle>
          <Badge
            className={`transition-all duration-200 ${
              item.is_available
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {item.is_available ? "Available" : "Unavailable"}
          </Badge>
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-xl font-bold">₹{item.price}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-2">
        <div className="flex items-center gap-1.5">
          <Switch
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
                  {item.name} will be permanently deleted.
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
