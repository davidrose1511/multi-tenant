"use client";

import { useState } from "react";
import { Search, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import {
  Order,
  OrderStatus,
  PaymentStatus,
  STATUS_NEXT,
  STATUS_LABEL,
  STATUS_COLORS,
} from "./order-types";

interface OrdersListProps {
  orders: Order[];
  selectedId: string | null;
  onSelect: (order: Order) => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onUpdatePayment: (id: string, status: PaymentStatus) => void;
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function OrdersList({
  orders,
  selectedId,
  onSelect,
  onUpdateStatus,
  onUpdatePayment,
}: OrdersListProps) {
  const [search, setSearch] = useState("");

  const filtered = [...orders]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .filter((o) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        o.customer_name?.toLowerCase().includes(q) ||
        o.id.slice(-4).toLowerCase().includes(q) ||
        o.items_snapshot.some((i) => i.name.toLowerCase().includes(q))
      );
    });

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by customer or item…"
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
            No orders found
          </p>
        )}

        {filtered.map((order) => {
          const next = STATUS_NEXT[order.status];
          const isTerminal =
            order.status === "ready" || order.status === "cancelled";

          return (
            <Card
              key={order.id}
              onClick={() => onSelect(order)}
              className={cn(
                "p-4 cursor-pointer transition-colors hover:bg-muted/40",
                selectedId === order.id && "ring-1 ring-ring bg-muted/40",
              )}
            >
              {/* Row 1: customer + badges + time */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">
                    {order.customer_name ?? "Walk-in"}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    #{order.id.slice(-4).toUpperCase()}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-semibold px-2 py-0.5 border",
                      STATUS_COLORS[order.status],
                    )}
                  >
                    {STATUS_LABEL[order.status]}
                  </Badge>
                  {order.status !== "cancelled" && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-semibold px-2 py-0.5 border pointer-events-none",
                        order.payment_status === "paid"
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                          : "text-slate-500 bg-slate-50 border-slate-200",
                      )}
                    >
                      {order.payment_status === "paid" ? "Paid" : "Unpaid"}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                  {timeAgo(order.created_at)}
                </span>
              </div>

              {/* Row 2: items */}
              <p className="text-sm text-muted-foreground mb-6 leading-snug">
                {order.items_snapshot
                  .map((i) => `${i.name} ×${i.quantity}`)
                  .join(", ")}
              </p>

              {/* Row 3: actions left, total right */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {order.payment_status === "unpaid" &&
                    order.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdatePayment(order.id, "paid");
                        }}
                      >
                        Mark Paid
                      </Button>
                    )}

                  {next && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateStatus(order.id, next);
                      }}
                    >
                      Mark {STATUS_LABEL[next]}
                    </Button>
                  )}

                  {!isTerminal && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Cancel this order?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Order from {order.customer_name ?? "Walk-in"} will
                            be cancelled.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel variant={"outline"}>
                            Keep it
                          </AlertDialogCancel>
                          <AlertDialogAction
                            variant={"destructive"}
                            onClick={() =>
                              onUpdateStatus(order.id, "cancelled")
                            }
                          >
                            Cancel Order
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>

                <span className="text-base font-bold">₹{order.total}</span>
              </div>

              {order.notes && (
                <p className="mt-2 text-xs text-muted-foreground italic">
                  Notes: "{order.notes}"
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
