"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemCard } from "./menu-card";
import { ItemDialog } from "./menu-dialog";
import { CategoryDialog } from "../shared/category-dialog";
import { MenuItem, Category } from "../shared/item-types";
import { useMenu } from "./use-menu";
import { useCategories } from "../shared/use-category";

const ALL_TAB = "all";

function getItemsForCategory(categoryId: string, items: MenuItem[]) {
  return items.filter((item) => item.category_id === categoryId);
}

export default function MenuShell({
  businessId,
  initialCategories,
  initialItems,
}: {
  businessId: string;
  initialCategories: Category[];
  initialItems: MenuItem[];
}) {
  const {
    items,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleToggleItem,
  } = useMenu(businessId, initialItems);

  const {
    categories,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
  } = useCategories(businessId, initialCategories);

  const [itemDialog, setItemDialog] = useState<MenuItem | "add" | null>(null);
  const [categoryDialog, setCategoryDialog] = useState(false);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Menu</h1>
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
          {categories.map((cat) => (
            <div key={cat.id} className="mb-8">
              <h2 className="font-semibold mb-3">{cat.name}</h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {getItemsForCategory(cat.id, items).map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onEdit={() => setItemDialog(item)}
                    onDelete={handleDeleteItem}
                    onToggle={handleToggleItem}
                  />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {getItemsForCategory(cat.id, items).map((item) => (
                <ItemCard
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
        <ItemDialog
          item={itemDialog === "add" ? null : itemDialog}
          categoryId={categories[0]?.id ?? ""}
          categories={categories}
          onSave={
            itemDialog === "add"
              ? (form) => {
                  handleAddItem(form);
                  setItemDialog(null);
                }
              : (form) => {
                  handleEditItem(form, itemDialog as MenuItem);
                  setItemDialog(null);
                }
          }
          onClose={() => setItemDialog(null)}
        />
      )}

      {categoryDialog && (
        <CategoryDialog
          categories={categories}
          onAdd={handleAddCategory}
          onEdit={handleEditCategory}
          onDelete={(id) =>
            handleDeleteCategory(id, () =>
              // clear items in deleted category from local state if needed
              console.log("category deleted", id),
            )
          }
          onClose={() => setCategoryDialog(false)}
        />
      )}
    </div>
  );
}
