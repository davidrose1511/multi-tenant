"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryDialog } from "../shared/category-dialog";
import { BoutiqueItemCard } from "./boutique-card";
import { BoutiqueItemDialog } from "./boutique-dialog";
import { BoutiqueItem, Category } from "../shared/item-types";
import { useBoutique } from "./use-boutique";
import { useCategories } from "../shared/use-category";

const ALL_TAB = "all";

export default function BoutiqueShell({
  businessId,
  initialCategories,
  initialItems,
}: {
  businessId: string;
  initialCategories: Category[];
  initialItems: BoutiqueItem[];
}) {
  const {
    items,
    uploading,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleToggleItem,
    setItems,
  } = useBoutique(businessId, initialItems);

  const {
    categories,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
  } = useCategories(businessId, initialCategories);

  const [itemDialog, setItemDialog] = useState<BoutiqueItem | "add" | null>(
    null,
  );
  const [categoryDialog, setCategoryDialog] = useState(false);

  function handleCategoryDelete(id: string) {
    handleDeleteCategory(id, () => {
      setItems((prev) => prev.filter((i) => i.category_id !== id));
    });
  }

  function getItemsForCategory(categoryId: string) {
    return items.filter((item) => item.category_id === categoryId);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Catalogue</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCategoryDialog(true)}>
            Manage Categories
          </Button>
          <Button onClick={() => setItemDialog("add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>
      <Tabs defaultValue={ALL_TAB}>
        <TabsList className="gap-6 mb-8" variant={"line"}>
          <TabsTrigger value={ALL_TAB}>All</TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id}>
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={ALL_TAB}>
          {categories.map((cat) => {
            const catItems = getItemsForCategory(cat.id);
            if (!catItems.length) return null;
            return (
              <div key={cat.id} className="mb-8">
                <h2 className="font-semibold mb-3">{cat.name}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {catItems.map((item) => (
                    <BoutiqueItemCard
                      key={item.id}
                      item={item}
                      onEdit={() => setItemDialog(item)}
                      onDelete={handleDeleteItem}
                      onToggle={handleToggleItem}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          {(() => {
            const uncategorised = items.filter((i) => !i.category_id);
            if (!uncategorised.length) return null;
            return (
              <div className="mb-8">
                <h2 className="font-semibold mb-3 text-muted-foreground">
                  Uncategorised
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
                  {uncategorised.map((item) => (
                    <BoutiqueItemCard
                      key={item.id}
                      item={item}
                      onEdit={() => setItemDialog(item)}
                      onDelete={handleDeleteItem}
                      onToggle={handleToggleItem}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </TabsContent>

        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {getItemsForCategory(cat.id).map((item) => (
                <BoutiqueItemCard
                  key={item.id}
                  item={item}
                  onEdit={() => setItemDialog(item)}
                  onDelete={handleDeleteItem}
                  onToggle={handleToggleItem}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      {itemDialog !== null && (
        <BoutiqueItemDialog
          item={itemDialog === "add" ? null : itemDialog}
          categoryId={categories[0]?.id ?? ""}
          categories={categories}
          uploading={uploading}
          onSave={(form) => {
            if (itemDialog === "add") {
              handleAddItem(form);
            } else {
              handleEditItem(form, itemDialog as BoutiqueItem);
            }
            setItemDialog(null);
          }}
          onClose={() => setItemDialog(null)}
        />
      )}
      {categoryDialog && (
        <CategoryDialog
          categories={categories}
          onAdd={handleAddCategory}
          onEdit={handleEditCategory}
          onDelete={handleCategoryDelete}
          onClose={() => setCategoryDialog(false)}
        />
      )}
    </div>
  );
}
