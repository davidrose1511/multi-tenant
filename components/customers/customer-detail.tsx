import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Customer } from "./customer-types";

interface CustomerDetailProps {
  customer: Customer;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm">
        {value ?? (
          <span className="italic text-muted-foreground">Not provided</span>
        )}
      </p>
    </div>
  );
}

export function CustomerDetail({ customer }: CustomerDetailProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 gap-6">
      {/* Header */}
      <div>
        <h2 className="font-semibold text-base">
          {customer.name ?? (
            <span className="italic text-muted-foreground font-normal">
              Unnamed customer
            </span>
          )}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          #{customer.id.slice(-4).toUpperCase()} · Joined{" "}
          {formatDate(customer.created_at)}
        </p>
      </div>

      <Separator />

      {/* Contact */}
      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Contact
        </p>
        <Field label="Phone" value={customer.phone} />
        <Field label="Address" value={customer.address} />
      </div>

      <Separator />

      {/* IDs */}
      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Reference IDs
        </p>
        <Field label="Customer ID" value={customer.id} />
        <Field label="Auth User ID" value={customer.auth_user_id} />
        <Field label="Business ID" value={customer.business_id} />
      </div>

      <Separator />

      {/* Placeholder for orders */}
      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Orders
        </p>
        <Button variant="outline" className="w-full" disabled>
          View Orders (coming soon)
        </Button>
      </div>
    </div>
  );
}
