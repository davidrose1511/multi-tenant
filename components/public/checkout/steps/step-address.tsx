"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CheckoutData, Business, Customer } from "../checkout-shell";

// delivery schema — address required
const deliverySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(15, "Phone number too long")
    .regex(/^[+\d\s]+$/, "Only numbers, spaces and + allowed"),
  address: z
    .string()
    .min(5, "Enter a valid address")
    .max(200, "Address too long"),
  notes: z.string().max(200, "Notes too long").optional(),
});

// pickup/dinein schema — no address needed
const pickupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(15, "Phone number too long")
    .regex(/^[+\d\s]+$/, "Only numbers, spaces and + allowed"),
  notes: z.string().max(200, "Notes too long").optional(),
});

type DeliveryValues = z.infer<typeof deliverySchema>;
type PickupValues = z.infer<typeof pickupSchema>;

type Props = {
  step: number;
  setStep: (step: 1 | 2 | 3) => void;
  checkoutData: CheckoutData;
  update: (fields: Partial<CheckoutData>) => void;
  business: Business;
  customer: Customer;
};

export function StepAddress({
  step,
  setStep,
  checkoutData,
  update,
  business,
  customer,
}: Props) {
  const isComplete = step > 2;
  const isActive = step === 2;
  const [useSavedAddress, setUseSavedAddress] = useState(!!customer?.address);

  const deliveryForm = useForm<DeliveryValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      name: checkoutData.name,
      phone: checkoutData.phone,
      address: useSavedAddress
        ? (customer?.address ?? "")
        : checkoutData.address,
      notes: checkoutData.notes,
    },
  });

  const pickupForm = useForm<PickupValues>({
    resolver: zodResolver(pickupSchema),
    defaultValues: {
      name: checkoutData.name,
      phone: checkoutData.phone,
      notes: checkoutData.notes,
    },
  });

  function onDeliverySubmit(values: DeliveryValues) {
    update({
      name: values.name,
      phone: values.phone,
      address: useSavedAddress ? (customer?.address ?? "") : values.address,
      notes: values.notes ?? "",
    });
    setStep(3);
  }

  function onPickupSubmit(values: PickupValues) {
    update({
      name: values.name,
      phone: values.phone,
      address: "",
      notes: values.notes ?? "",
    });
    setStep(3);
  }

  return (
    <div
      className={isActive || isComplete ? "" : "opacity-40 pointer-events-none"}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-xl">Address</h2>
        {isComplete && (
          <button
            className="text-xs text-muted-foreground hover:underline"
            onClick={() => setStep(2)}
          >
            Change
          </button>
        )}
      </div>

      {isComplete ? (
        <div className="text-sm text-muted-foreground space-y-0.5">
          <p className="font-medium text-foreground">{checkoutData.name}</p>
          <p>{checkoutData.phone}</p>
          <p>
            {checkoutData.deliveryType === "delivery"
              ? checkoutData.address
              : checkoutData.deliveryType === "pickup"
                ? "Pickup"
                : "Dine In"}
          </p>
        </div>
      ) : isActive ? (
        <div className="space-y-4">
          {/* Delivery type buttons */}
          <div className="flex gap-2">
            {(["delivery", "pickup", "dinein"] as const).map((type) => (
              <Button
                key={type}
                type="button"
                variant={
                  checkoutData.deliveryType === type ? "default" : "outline"
                }
                size="sm"
                onClick={() => update({ deliveryType: type })}
              >
                {type === "delivery"
                  ? "Delivery"
                  : type === "pickup"
                    ? "Pickup"
                    : "Dine In"}
              </Button>
            ))}
          </div>

          {/* Delivery form */}
          {checkoutData.deliveryType === "delivery" && (
            <Form {...deliveryForm}>
              <form
                onSubmit={deliveryForm.handleSubmit(onDeliverySubmit)}
                className="space-y-3"
              >
                <FormField
                  control={deliveryForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={deliveryForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+91 98000 00000"
                          maxLength={15}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Saved address */}
                {customer?.address && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Saved Address
                    </p>
                    <div
                      className={`p-3 rounded-lg border text-sm cursor-pointer transition-colors ${
                        useSavedAddress ? "bg-muted/50" : "border-border"
                      }`}
                      onClick={() => {
                        setUseSavedAddress(true);
                        deliveryForm.setValue(
                          "address",
                          customer.address ?? "",
                        );
                      }}
                    >
                      <p>{customer.address}</p>
                    </div>
                    <button
                      type="button"
                      className="text-xs hover:underline"
                      onClick={() => {
                        setUseSavedAddress(false);
                        deliveryForm.setValue("address", "");
                      }}
                    >
                      + Use a different address
                    </button>
                  </div>
                )}

                {!useSavedAddress && (
                  <FormField
                    control={deliveryForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your full address"
                            maxLength={200}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={deliveryForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Any special instructions?"
                          maxLength={200}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </Button>
                  <Button type="submit" className="text-white">
                    Continue
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* Pickup / Dine In form */}
          {(checkoutData.deliveryType === "pickup" ||
            checkoutData.deliveryType === "dinein") && (
            <>
              <div className="p-4 rounded-lg bg-muted text-sm space-y-1">
                <p className="font-medium">{business.name}</p>
                {business.address ? (
                  <p className="text-muted-foreground">{business.address}</p>
                ) : (
                  <p className="text-muted-foreground italic">No address set</p>
                )}
                <p className="text-muted-foreground">
                  {checkoutData.deliveryType === "pickup"
                    ? "Please collect your order from us."
                    : "We'll bring it to your table."}
                </p>
              </div>

              <Form {...pickupForm}>
                <form
                  onSubmit={pickupForm.handleSubmit(onPickupSubmit)}
                  className="space-y-3"
                >
                  <FormField
                    control={pickupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={pickupForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+91 98000 00000"
                            maxLength={15}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={pickupForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Any special instructions?"
                            maxLength={200}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep(1)}
                    >
                      ← Back
                    </Button>
                    <Button type="submit" className="text-white">
                      Continue
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
