"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Category } from "./menu-types";

type CategoryDialogProps = {
  categories: Category[];
  onAdd: (name: string) => void;
  onEdit: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

export function CategoryDialog({
  categories,
  onAdd,
  onEdit,
  onDelete,
  onClose,
}: CategoryDialogProps) {
  const [showAddInput, setShowAddInput] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  function handleAdd() {
    if (!newName.trim()) return;
    onAdd(newName);
    setNewName("");
    setShowAddInput(false);
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditingName(cat.name);
  }

  function handleEdit() {
    if (!editingName.trim() || !editingId) return;
    onEdit(editingId, editingName);
    setEditingId(null);
    setEditingName("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingName("");
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Add button + input */}
          {!showAddInput ? (
            <Button className="w-full" onClick={() => setShowAddInput(true)}>
              <Plus className="mr-2 h-3.5 w-3.5" />
              Add New Category
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                autoFocus
                placeholder="e.g. Burgers"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                  if (e.key === "Escape") setShowAddInput(false);
                }}
              />
              <Button size="icon" onClick={handleAdd}>
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setShowAddInput(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Category list */}
          <div className="space-y-1">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2 py-1">
                {editingId === cat.id ? (
                  // Edit mode for this category
                  <>
                    <Input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="h-8"
                    />
                    <Button
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleEdit}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={cancelEdit}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </>
                ) : (
                  // Display mode
                  <>
                    <span className="flex-1 text-sm">{cat.name}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => startEdit(cat)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(cat.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogClose asChild>
          <Button variant="outline" className="w-full">
            Done
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
