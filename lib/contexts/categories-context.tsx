"use client";

import { createContext, useContext } from "react";
import { Category } from "@/components/dashboard-components/items/shared/item-types";

const CategoryContext = createContext<Category[] | null>(null);

export function CategoryProvider({
  categories,
  children,
}: {
  categories: Category[];
  children: React.ReactNode;
}) {
  return (
    <CategoryContext.Provider value={categories}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  // plural
  const ctx = useContext(CategoryContext);
  if (!ctx)
    throw new Error("useCategories must be used within CategoryProvider");
  return ctx;
}
