"use client";

import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, Check, X, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Category } from "./item-types";

type CategoryDialogProps = {
  categories: Category[];
  onAdd: (name: string, tagline?: string, coverFile?: File) => void;
  onEdit: (
    id: string,
    name: string,
    tagline?: string,
    coverFile?: File,
  ) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

type FormState = {
  name: string;
  tagline: string;
  coverFile: File | null;
  previewUrl: string | null;
};

const emptyForm = (): FormState => ({
  name: "",
  tagline: "",
  coverFile: null,
  previewUrl: null,
});

export function CategoryDialog({
  categories,
  onAdd,
  onEdit,
  onDelete,
  onClose,
}: CategoryDialogProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<FormState>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm());

  const addFileRef = useRef<HTMLInputElement>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (fn: (prev: FormState) => FormState) => void,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setter((prev) => ({ ...prev, coverFile: file, previewUrl }));
  }

  function handleAdd() {
    if (!addForm.name.trim()) return;
    onAdd(
      addForm.name,
      addForm.tagline || undefined,
      addForm.coverFile ?? undefined,
    );
    setAddForm(emptyForm());
    setShowAddForm(false);
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditForm({
      name: cat.name,
      tagline: cat.tagline ?? "",
      coverFile: null,
      previewUrl: cat.cover_image_url ?? null,
    });
  }

  function handleEdit() {
    if (!editForm.name.trim() || !editingId) return;
    onEdit(
      editingId,
      editForm.name,
      editForm.tagline || undefined,
      editForm.coverFile ?? undefined,
    );
    setEditingId(null);
    setEditForm(emptyForm());
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(emptyForm());
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* ── Add form ── */}
          {!showAddForm ? (
            <Button className="w-full" onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-3.5 w-3.5" />
              Add New Category
            </Button>
          ) : (
            <div className="space-y-2 border rounded-lg p-3">
              <Input
                autoFocus
                placeholder="Category name e.g. Dresses"
                value={addForm.name}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, name: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                  if (e.key === "Escape") setShowAddForm(false);
                }}
              />
              <Input
                placeholder="Tagline e.g. Light & flowy fits"
                value={addForm.tagline}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, tagline: e.target.value }))
                }
              />
              {/* Cover image picker */}
              <div
                className="flex items-center gap-3 cursor-pointer border border-dashed rounded-md p-2 hover:bg-muted transition-colors"
                onClick={() => addFileRef.current?.click()}
              >
                {addForm.previewUrl ? (
                  <img
                    src={addForm.previewUrl}
                    alt="preview"
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                    <ImagePlus className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <span className="text-sm text-muted-foreground">
                  {addForm.coverFile
                    ? addForm.coverFile.name
                    : "Add cover image"}
                </span>
                <input
                  ref={addFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, setAddForm)}
                />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleAdd}>
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                  Add
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowAddForm(false);
                    setAddForm(emptyForm());
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* ── Category list ── */}
          <div className="space-y-1">
            {categories.map((cat) => (
              <div key={cat.id} className="rounded-lg border">
                {editingId === cat.id ? (
                  <div className="space-y-2 p-3">
                    <Input
                      autoFocus
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((p) => ({ ...p, name: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                    />
                    <Input
                      placeholder="Tagline"
                      value={editForm.tagline}
                      onChange={(e) =>
                        setEditForm((p) => ({ ...p, tagline: e.target.value }))
                      }
                    />
                    <div
                      className="flex items-center gap-3 cursor-pointer border border-dashed rounded-md p-2 hover:bg-muted transition-colors"
                      onClick={() => editFileRef.current?.click()}
                    >
                      {editForm.previewUrl ? (
                        <img
                          src={editForm.previewUrl}
                          alt="preview"
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                          <ImagePlus className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {editForm.coverFile
                          ? editForm.coverFile.name
                          : "Change cover image"}
                      </span>
                      <input
                        ref={editFileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, setEditForm)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" onClick={handleEdit}>
                        <Check className="mr-1 h-3.5 w-3.5" /> Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2">
                    {cat.cover_image_url && (
                      <img
                        src={cat.cover_image_url}
                        alt={cat.name}
                        className="w-8 h-8 rounded object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{cat.name}</p>
                      {cat.tagline && (
                        <p className="text-xs text-muted-foreground truncate">
                          {cat.tagline}
                        </p>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0"
                      onClick={() => startEdit(cat)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                      onClick={() => onDelete(cat.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
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
