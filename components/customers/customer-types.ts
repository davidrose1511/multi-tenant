export type Customer = {
  id: string;
  auth_user_id: string;
  business_id: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
};

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "c1a2b3c4-0001-4000-a000-000000000001",
    auth_user_id: "u1000000-0000-4000-a000-000000000001",
    business_id: "b0000000-0000-4000-a000-000000000001",
    name: "Priya Sharma",
    phone: "+91 98200 11111",
    address: "12, Linking Road, Bandra West, Mumbai, 400050",
    created_at: "2024-11-03T09:14:00Z",
  },
  {
    id: "c1a2b3c4-0002-4000-a000-000000000002",
    auth_user_id: "u1000000-0000-4000-a000-000000000002",
    business_id: "b0000000-0000-4000-a000-000000000001",
    name: "Arjun Mehta",
    phone: "+91 99300 22222",
    address: "45, MG Road, Indiranagar, Bengaluru, 560038",
    created_at: "2024-11-15T14:30:00Z",
  },
  {
    id: "c1a2b3c4-0003-4000-a000-000000000003",
    auth_user_id: "u1000000-0000-4000-a000-000000000003",
    business_id: "b0000000-0000-4000-a000-000000000001",
    name: "Kavya Nair",
    phone: "+91 97400 33333",
    address: "8, Anna Salai, Teynampet, Chennai, 600018",
    created_at: "2024-12-01T11:00:00Z",
  },
  {
    id: "c1a2b3c4-0004-4000-a000-000000000004",
    auth_user_id: "u1000000-0000-4000-a000-000000000004",
    business_id: "b0000000-0000-4000-a000-000000000001",
    name: "Rahul Gupta",
    phone: "+91 96500 44444",
    address: "22, Connaught Place, New Delhi, 110001",
    created_at: "2024-12-10T08:45:00Z",
  },
  {
    id: "c1a2b3c4-0005-4000-a000-000000000005",
    auth_user_id: "u1000000-0000-4000-a000-000000000005",
    business_id: "b0000000-0000-4000-a000-000000000001",
    name: "Sneha Joshi",
    phone: null,
    address: "77, FC Road, Shivajinagar, Pune, 411004",
    created_at: "2025-01-07T17:20:00Z",
  },
  {
    id: "c1a2b3c4-0006-4000-a000-000000000006",
    auth_user_id: "u1000000-0000-4000-a000-000000000006",
    business_id: "b0000000-0000-4000-a000-000000000001",
    name: "Vikram Singh",
    phone: "+91 95600 66666",
    address: null,
    created_at: "2025-01-20T10:05:00Z",
  },
  {
    id: "c1a2b3c4-0007-4000-a000-000000000007",
    auth_user_id: "u1000000-0000-4000-a000-000000000007",
    business_id: "b0000000-0000-4000-a000-000000000001",
    name: "Ananya Das",
    phone: "+91 94700 77777",
    address: "3, Park Street, Kolkata, 700016",
    created_at: "2025-02-02T13:15:00Z",
  },
  {
    id: "c1a2b3c4-0008-4000-a000-000000000008",
    auth_user_id: "u1000000-0000-4000-a000-000000000008",
    business_id: "b0000000-0000-4000-a000-000000000001",
    name: null,
    phone: "+91 93800 88888",
    address: "101, SG Highway, Ahmedabad, 380054",
    created_at: "2025-02-18T16:40:00Z",
  },
];
