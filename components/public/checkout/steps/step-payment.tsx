"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckoutData, Business } from "../checkout-shell";

type Props = {
  step: number;
  setStep: (step: 1 | 2 | 3) => void;
  business: Business;
  checkoutData: CheckoutData;
  user: any | null;
  slug: string;
};

export function StepPayment({
  step,
  setStep,
  business,
  checkoutData,
  user,
  slug,
}: Props) {
  const router = useRouter();
  const isActive = step === 3;

  return (
    <div className={isActive ? "" : "opacity-40 pointer-events-none"}>
      <h2 className="font-semibold text-xl mb-3">Payment</h2>

      {isActive && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Complete your payment to place the order.
          </p>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStep(2)}
            >
              ← Back
            </Button>
            <Button
              className="text-white"
              onClick={() => router.push(`/${slug}/payment`)}
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
