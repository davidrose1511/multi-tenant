import { Clock, MapPin, Phone } from "lucide-react";

type Business = {
  name: string;
  address: string | null;
  whatsapp_number: string | null;
  theme_color: string | null;
};

export function Features({ business }: { business: Business }) {
  return (
    <div className="border-t bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Hours — placeholder, edit as needed */}
        <div className="flex items-start gap-3">
          <Clock
            className="h-5 w-5 shrink-0 mt-0.5"
            style={{ color: "var(--theme-color)" }}
          />
          <div>
            <p className="text-sm font-semibold">Hours</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Mon – Sun: 11am – 11pm
            </p>
          </div>
        </div>

        {/* Address */}
        {business.address && (
          <div className="flex items-start gap-3">
            <MapPin
              className="h-5 w-5 shrink-0 mt-0.5"
              style={{ color: "var(--theme-color)" }}
            />
            <div>
              <p className="text-sm font-semibold">Location</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {business.address}
              </p>
            </div>
          </div>
        )}

        {/* WhatsApp */}
        {business.whatsapp_number && (
          <div className="flex items-start gap-3">
            <Phone
              className="h-5 w-5 shrink-0 mt-0.5"
              style={{ color: "var(--theme-color)" }}
            />
            <div>
              <p className="text-sm font-semibold">Contact</p>
              <a
                href={`https://wa.me/${business.whatsapp_number}`}
                className="text-xs mt-0.5 hover:underline"
                style={{ color: "var(--theme-color)" }}
              >
                WhatsApp us
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
