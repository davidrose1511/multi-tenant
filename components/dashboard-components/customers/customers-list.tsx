"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Customer } from "./customer-types";

interface CustomersListProps {
  customers: Customer[];
  selectedId: string | null;
  onSelect: (customer: Customer) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function CustomersList({
  customers,
  selectedId,
  onSelect,
}: CustomersListProps) {
  const [search, setSearch] = useState("");

  const filtered = [...customers]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .filter((c) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.name?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.address?.toLowerCase().includes(q)
      );
    });

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone or address…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">
            No customers found
          </p>
        )}

        {filtered.map((customer) => (
          <Card
            key={customer.id}
            onClick={() => onSelect(customer)}
            className={cn(
              "p-4 cursor-pointer transition-colors hover:bg-muted/40",
              selectedId === customer.id && "ring-1 ring-ring bg-muted/40",
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm">{customer.name}</span>
              <span className="">
                <p className="text-xs text-muted-foreground">
                  Joined {formatDate(customer.created_at)}
                </p>
              </span>
            </div>

            <p className="text-sm text-muted-foreground truncate">
              {customer.phone ?? <span className="italic">No phone</span>}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {customer.address ?? <span className="italic">No address</span>}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
