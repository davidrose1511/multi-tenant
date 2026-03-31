// /lib/context/business-context.tsx
"use client";

import { createContext, useContext } from "react";

type Business = {
  id: string;
  name: string;
  slug: string;
  business_type: string;
  logo_url: string | null;
  theme_color: string | null;
};

const BusinessContext = createContext<Business | null>(null);

export function BusinessProvider({
  business,
  children,
}: {
  business: Business;
  children: React.ReactNode;
}) {
  return (
    <BusinessContext.Provider value={business}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness must be used within BusinessProvider");
  return ctx;
}
