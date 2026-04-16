import { MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`w-full px-4 sm:px-8 lg:px-16 ${className ?? ""}`}>
    {children}
  </div>
);

const HOURS = [
  { day: "Monday", hours: "11 am – 8:30 pm" },
  { day: "Tuesday", hours: "11 am – 8:30 pm" },
  { day: "Wednesday", hours: "11 am – 8:30 pm" },
  { day: "Thursday", hours: "11 am – 8:30 pm" },
  { day: "Friday", hours: "11 am – 8:30 pm" },
  { day: "Saturday", hours: "11 am – 8:30 pm" },
  { day: "Sunday", hours: "11 am – 8:30 pm" },
];
const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/yourboutique",
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://facebook.com/yourboutique",
    icon: Facebook,
  },
];

export function BoutiqueVisitSection() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <section className="pb-20 md:pb-32">
      <Container>
        <div className="mb-10 md:mb-14">
          <div className="text-muted-foreground mb-4 flex flex-row items-center">
            <Sparkles size={20} />
            <p className="md:text-sm text-xs font-semibold tracking-[0.25em] uppercase ml-2">
              Find Us
            </p>
          </div>
          <h2 className="text-4xl lg:text-6xl font-light leading-tightest mb-1 text-rose-900">
            Visit Our Store
          </h2>
          <p className="text-base text-muted-foreground">
            Come experience our collection in person.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left — info */}
          <div className="flex flex-col gap-6">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="mt-0.5 p-2 rounded-md bg-secondary">
                <MapPin size={18} className="text-rose-900" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">
                  Address
                </p>
                <p className="text-base leading-relaxed">
                  F4, Block F, Kirti Nagar
                  <br />
                  New Delhi, Delhi 110015
                </p>
              </div>
            </div>

            <Separator />

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="mt-0.5 p-2 rounded-md bg-secondary">
                <Phone size={18} className="text-rose-900" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">
                  Phone
                </p>
                <Link
                  className="text-base hover:text-rose-900 transition-colors"
                  href="tel:09090006888"
                >
                  090900 06888
                </Link>
              </div>
            </div>

            <Separator />

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="mt-0.5 p-2 rounded-md bg-secondary">
                <Clock size={18} className="text-rose-900" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                  Hours
                </p>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto hover:bg-transparent flex items-center gap-2 text-sm font-normal -ml-3"
                    >
                      <span>
                        <span className="font-medium">{today}</span> · 11 am –
                        8:30 pm
                      </span>
                      <ChevronDown
                        size={14}
                        className="text-muted-foreground transition-transform duration-200 [[data-state=open]_&]:rotate-180"
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="flex flex-col gap-1.5">
                      {HOURS.map(({ day, hours }) => (
                        <div
                          key={day}
                          className={`flex justify-between text-sm py-1 ${
                            day === today
                              ? "text-rose-900 font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          <span>{day}</span>
                          <span>{hours}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>

            <Separator />

            {/* Socials */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Right — map */}
          <div className="rounded-xl overflow-hidden border border-border w-full aspect-[4/3] lg:aspect-auto lg:h-[420px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.4!2d77.1488!3d28.6575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM5JzI3LjAiTiA3N8KwMDgnNTUuNyJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
