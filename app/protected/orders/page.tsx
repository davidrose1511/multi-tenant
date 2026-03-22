import { OrdersShell } from '@/components/orders/orders-shell'

export default function OrdersPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border shrink-0">
        <h1 className="text-lg font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground">Incoming orders, newest first</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <OrdersShell />
      </div>
    </div>
  )
}
