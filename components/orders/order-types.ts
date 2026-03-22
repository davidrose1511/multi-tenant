export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid'

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  business_id: string
  customer_id: string | null
  customer_name: string | null
  customer_phone: string | null
  items_snapshot: OrderItem[]
  total: number
  status: OrderStatus
  payment_status: PaymentStatus
  notes: string | null
  created_at: string
}

// What button to show to advance the order forward
export const STATUS_NEXT: Record<OrderStatus, OrderStatus | null> = {
  pending:   'confirmed',
  confirmed: 'ready',
  ready:     null,
  cancelled: null,
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending:   'Pending',
  confirmed: 'Confirmed',
  ready:     'Ready',
  cancelled: 'Cancelled',
}

// Tailwind classes for each status badge
export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:   'text-amber-700 bg-amber-50 border-amber-200',
  confirmed: 'text-blue-700 bg-blue-50 border-blue-200',
  ready:     'text-emerald-700 bg-emerald-50 border-emerald-200',
  cancelled: 'text-red-600 bg-red-50 border-red-200',
}

// Mock data — factory function so Date.now() runs client-side only
export function createMockOrders(): Order[] {
  const now = Date.now()
  return [
    {
      id: 'ord-001',
      business_id: 'biz-001',
      customer_id: 'cust-001',
      customer_name: 'Ayesha Khan',
      customer_phone: '+91 98765 43210',
      items_snapshot: [
        { id: 'i1', name: 'Margherita Pizza', price: 349, quantity: 1 },
        { id: 'i2', name: 'Garlic Bread',     price: 129, quantity: 2 },
        { id: 'i3', name: 'Coke',             price:  60, quantity: 2 },
      ],
      total: 727,
      status: 'pending',
      payment_status: 'unpaid',
      notes: 'Extra crispy crust please',
      created_at: new Date(now - 4 * 60 * 1000).toISOString(),
    },
    {
      id: 'ord-002',
      business_id: 'biz-001',
      customer_id: 'cust-002',
      customer_name: 'Rohan Mehta',
      customer_phone: '+91 91234 56789',
      items_snapshot: [
        { id: 'i4', name: 'Butter Chicken', price: 420, quantity: 1 },
        { id: 'i5', name: 'Garlic Naan',    price:  60, quantity: 3 },
        { id: 'i6', name: 'Mango Lassi',    price:  90, quantity: 1 },
      ],
      total: 690,
      status: 'confirmed',
      payment_status: 'paid',
      notes: null,
      created_at: new Date(now - 18 * 60 * 1000).toISOString(),
    },
    {
      id: 'ord-003',
      business_id: 'biz-001',
      customer_id: null,
      customer_name: null,
      customer_phone: null,
      items_snapshot: [
        { id: 'i7', name: 'Paneer Tikka',  price: 280, quantity: 2 },
        { id: 'i8', name: 'Tandoori Roti', price:  40, quantity: 4 },
      ],
      total: 720,
      status: 'ready',
      payment_status: 'paid',
      notes: 'Table 7',
      created_at: new Date(now - 35 * 60 * 1000).toISOString(),
    },
    {
      id: 'ord-004',
      business_id: 'biz-001',
      customer_id: 'cust-003',
      customer_name: 'Priya Sharma',
      customer_phone: '+91 70000 12345',
      items_snapshot: [
        { id: 'i9',  name: 'Caesar Salad',    price: 220, quantity: 1 },
        { id: 'i10', name: 'Pasta Arrabiata', price: 310, quantity: 1 },
      ],
      total: 530,
      status: 'cancelled',
      payment_status: 'unpaid',
      notes: null,
      created_at: new Date(now - 50 * 60 * 1000).toISOString(),
    },
  ]
}
