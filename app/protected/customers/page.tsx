import { CustomersShell } from "@/components/customers/customers-shell";

export default function MenuPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border shrink-0">
        <h1 className="text-2xl font-semibold">Customers</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <CustomersShell />
      </div>
    </div>
  );
}
