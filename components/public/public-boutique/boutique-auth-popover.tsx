"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type AuthPopoverProps = {
  slug: string;
  user: { email: string; name?: string } | null;
};

export function AuthPopover({ slug, user }: AuthPopoverProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Account"
          className="flex items-center justify-center w-8 h-8"
        >
          <User strokeWidth={1.5} size={24} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-52 p-1 border border-border bg-accent shadow-sm rounded-lg overflow-hidden"
      >
        {user ? (
          <>
            {/* Greeting */}
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs font-semibold  text-muted-foreground">
                Welcome back
              </p>
              <p className="text-sm text-foreground mt-0.5 ">{user.name}</p>
            </div>

            {/* Actions */}
            <div className="py-1">
              <Link
                href={`/${slug}/account`}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Settings strokeWidth={1.5} size={13} />
                My Account
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-red-800 hover:bg-accent transition-colors"
              >
                <LogOut strokeWidth={1.5} size={13} />
                Sign out
              </button>
            </div>
          </>
        ) : (
          <div className="p-4 flex flex-col gap-3">
            <div className="w-full border-b border-border text-xs">
              <p>Account</p>
            </div>
            <Link href={`/${slug}/login`} className="w-full">
              <Button className="w-full bg-primary">Sign in</Button>
            </Link>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href={`/${slug}/register`}
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Register
              </Link>
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
