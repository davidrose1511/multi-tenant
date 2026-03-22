"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { CustomersList } from "./customers-list";
import { CustomerDetail } from "./customer-detail";
import { MOCK_CUSTOMERS, Customer } from "./customer-types";

export function CustomersShell() {
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = customers.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: customers list */}
      <div className="w-2/3 shrink-0 border-r border-border overflow-hidden flex flex-col">
        <CustomersList
          customers={customers}
          selectedId={selectedId}
          onSelect={(c) => setSelectedId(c.id)}
        />
      </div>

      {/* Right: detail panel */}
      <div className="flex-1 overflow-hidden">
        {selected ? (
          <CustomerDetail key={selected.id} customer={selected} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
            <Users className="h-8 w-8 opacity-25" />
            <p className="text-sm">Select a customer to see details</p>
          </div>
        )}
      </div>
    </div>
  );
}
