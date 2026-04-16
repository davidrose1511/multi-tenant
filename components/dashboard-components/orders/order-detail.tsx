"use client";

import { User, Phone, Clock, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Order, STATUS_LABEL, STATUS_COLORS } from "./order-types";

interface OrderDetailProps {
  order: Order;
}

export function OrderDetail({ order }: OrderDetailProps) {
  return (
    <div className="h-full overflow-y-auto px-6 py-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-muted-foreground">
          #{order.id.slice(-6).toUpperCase()}
        </span>
        <Badge
          variant="outline"
          className={cn(
            "text-xs font-semibold border",
            STATUS_COLORS[order.status],
          )}
        >
          {STATUS_LABEL[order.status]}
        </Badge>
        {order.status !== "cancelled" && (
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-semibold border",
              order.payment_status === "paid"
                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                : "text-slate-500 bg-slate-50 border-slate-200",
            )}
          >
            {order.payment_status === "paid" ? "Paid" : "Unpaid"}
          </Badge>
        )}
      </div>

      <Separator />

      {/* Customer */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Customer
        </p>
        {order.customer_name ? (
          <>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              {order.customer_name}
            </div>
            {order.customer_phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                {order.customer_phone}
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Walk-in</p>
        )}
      </div>

      <Separator />

      {/* Time */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        {new Date(order.created_at).toLocaleString([], {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

      {order.notes && (
        <>
          <Separator />
          <div className="flex items-start gap-2 text-sm">
            <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <span>{order.notes}</span>
          </div>
        </>
      )}

      <Separator />

      {/* Items */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Items
        </p>
        {order.items_snapshot.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {item.name}
              <span className="ml-1 text-xs">×{item.quantity}</span>
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between text-sm font-semibold">
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>
      </div>
    </div>
  );
}
