"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const formSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type Props = {
  slug: string;
};

export function CustomerLoginForm({ slug }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? `/${slug}`;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      form.setError("email", { message: error.message });
      return;
    }
    router.push(next);
  }

  return (
    <div className="w-full max-w-sm">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2 text-center">
            <h1 className="font-bold text-2xl">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to continue</p>
          </div>

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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    placeholder="Your password"
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
            {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-center text-muted-foreground text-sm">
            Don&apos;t have an account?{" "}
            <Link
              className="hover:underline"
              href={`/${slug}/signup?next=${next}`}
            >
              Sign up
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
