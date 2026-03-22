"use client";

import { useState } from "react";
import { OrderSummary } from "./order-summary";
import { StepAccount } from "./steps/step-account";
import { StepAddress } from "./steps/step-address";
import { StepPayment } from "./steps/step-payment";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type Business = {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  theme_color: string | null;
  whatsapp_number: string | null;
};

export type Customer = {
  id: string;
  name: string | null;
  phone: string | null;
  address: string | null;
} | null;

export type CheckoutData = {
  deliveryType: "delivery" | "pickup" | "dinein" | null;
  address: string;
  name: string;
  phone: string;
  notes: string;
};

const STEPS = [
  { number: 1, label: "Account" },
  { number: 2, label: "Address" },
  { number: 3, label: "Payment" },
];

type Props = {
  business: Business;
  user: any | null;
  customer: Customer;
  slug: string;
};

export function CheckoutShell({ business, user, customer, slug }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    deliveryType: null,
    address: customer?.address ?? "",
    name: customer?.name ?? "",
    phone: customer?.phone ?? "",
    notes: "",
  });

  function update(fields: Partial<CheckoutData>) {
    setCheckoutData((prev) => ({ ...prev, ...fields }));
  }

  const stepComponents = [
    <StepAccount
      key={1}
      step={step}
      setStep={setStep}
      user={user}
      slug={slug}
    />,
    <StepAddress
      key={2}
      step={step}
      setStep={setStep}
      checkoutData={checkoutData}
      update={update}
      business={business}
      customer={customer}
    />,
    <StepPayment
      key={3}
      step={step}
      setStep={setStep}
      business={business}
      checkoutData={checkoutData}
      user={user}
      slug={slug}
    />,
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: stepper */}
        <div className="flex-1">
          {STEPS.map((s, i) => (
            <div key={s.number} className="flex gap-4">
              {/* Number + connector */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 shrink-0 transition-colors mt-0.5",
                    step > s.number
                      ? "text-white border-transparent"
                      : step === s.number
                        ? "border-current"
                        : "text-muted-foreground border-muted",
                  )}
                  style={
                    step > s.number
                      ? {
                          backgroundColor: "var(--theme-color)",
                          borderColor: "var(--theme-color)",
                        }
                      : step === s.number
                        ? {
                            color: "var(--theme-color)",
                            borderColor: "var(--theme-color)",
                          }
                        : {}
                  }
                >
                  {step > s.number ? <Check className="h-4 w-4" /> : s.number}
                </div>
                {/* Connector line — grows to fill space between steps */}
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-border my-2 min-h-8" />
                )}
              </div>

              {/* Step content — heading naturally aligns with circle */}
              <div className="flex-1 pb-10">{stepComponents[i]}</div>
            </div>
          ))}
        </div>

        {/* Right: order summary */}
        <div className="lg:w-80 lg:shrink-0">
          <OrderSummary business={business} />
        </div>
      </div>
    </div>
  );
}
