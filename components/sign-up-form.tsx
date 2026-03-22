"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

// -------------------------------------------------------
// SCHEMA — zod validates all fields before submit
// -------------------------------------------------------
const formSchema = z
  .object({
    businessName: z.string().min(2, {
      message: "Business name must be at least 2 characters.",
    }),
    slug: z
      .string()
      .min(2, { message: "Slug must be at least 2 characters." })
      .regex(/^[a-z0-9-]+$/, {
        message: "Only lowercase letters, numbers and hyphens allowed.",
      }),
    email: z.email({
      message: "Please enter a valid email address.",
    }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    repeatPassword: z.string(),
  })
  // cross-field validation — passwords must match
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match.",
    path: ["repeatPassword"],
  });

// -------------------------------------------------------
// COMPONENT
// -------------------------------------------------------
export function SignUpForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      slug: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  // Auto generate slug from business name as they type
  function handleBusinessNameChange(value: string) {
    form.setValue("businessName", value);
    form.setValue(
      "slug",
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-"),
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("onSubmit fired", values);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          business_name: values.businessName,
          slug: values.slug,
        },
      },
    });

    console.log("signup response", { error });
    if (error) {
      console.log("signup error", error.message);
      form.setError("email", { message: error.message });
      return;
    }
    console.log("pushing to sign-up-success");
    router.push("/auth/sign-up-success");
  }

  const slug = form.watch("slug");

  return (
    <div className="w-full max-w-sm">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2 text-center">
            <h1 className="font-bold text-2xl">Create your account</h1>
            <p className="text-muted-foreground text-sm">
              Set up your business in minutes
            </p>
          </div>

          {/* Business Name */}
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    placeholder="e.g. Burger House"
                    {...field}
                    onChange={(e) => handleBusinessNameChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Slug</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    placeholder="burger-house"
                    {...field}
                    onChange={(e) =>
                      form.setValue(
                        "slug",
                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                      )
                    }
                  />
                </FormControl>
                {slug && (
                  <FormDescription className="text-xs">
                    Your site: yourdomain.com/{slug}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    placeholder="you@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    placeholder="Create a strong password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Min 8 characters, uppercase, lowercase and a number.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Repeat Password */}
          <FormField
            control={form.control}
            name="repeatPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeat Password</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    placeholder="Repeat your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Creating account..."
              : "Create Account"}
          </Button>

          <p className="text-center text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link className="hover:underline" href="/auth/login">
              Sign in
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
