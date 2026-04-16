import { Button } from "@/components/ui/button";

type Business = {
  name: string;
  address: string | null;
  whatsapp_number: string | null;
  theme_color: string | null;
};

export function PublicFooter({ business }: { business: Business }) {
  return (
    <footer className="border-t py-6 text-center text-xs text-muted-foreground">
      <p>{business.name}</p>
      {business.address && <p className="mt-0.5">{business.address}</p>}
      {business.whatsapp_number && (
        <Button
          asChild
          variant="link"
          size="sm"
          className="mt-1"
          style={{ color: "var(--theme-color)" }}
        >
          <a href={`https://wa.me/${business.whatsapp_number}`}>WhatsApp us</a>
        </Button>
      )}
    </footer>
  );
}
