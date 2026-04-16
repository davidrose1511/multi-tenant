"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { OrdersList } from "./orders-list";
import { OrderDetail } from "./order-detail";
import {
  Order,
  OrderStatus,
  PaymentStatus,
  createMockOrders,
} from "./order-types";

export function OrdersShell() {
  const [orders, setOrders] = useState<Order[]>(() => createMockOrders());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  // Single place to handle status changes — add side effects here later
  function handleUpdateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  function handleUpdatePayment(id: string, payment_status: PaymentStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, payment_status } : o)),
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: order list — wider since it's the main UI */}
      <div className="w-1/2 shrink-0 border-r border-border overflow-hidden flex flex-col">
        <OrdersList
          orders={orders}
          selectedId={selectedId}
          onSelect={(o) => setSelectedId(o.id)}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePayment={handleUpdatePayment}
        />
      </div>

      {/* Right: detail panel */}
      <div className="flex-1 overflow-hidden">
        {selected ? (
          <OrderDetail key={selected.id} order={selected} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
            <ClipboardList className="h-8 w-8 opacity-25" />
            <p className="text-sm">Select an order to see details</p>
          </div>
        )}
      </div>
    </div>
  );
}
