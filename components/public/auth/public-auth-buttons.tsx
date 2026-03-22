import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { PublicLogoutButton } from "./public-logout-button";
import { User } from "lucide-react";

type Props = { slug: string };

export async function PublicAuthButton({ slug }: Props) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return user ? (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground hidden sm:block">
        {user.email}
      </span>
      <PublicLogoutButton slug={slug} />
    </div>
  ) : (
    <Button
      asChild
      size="sm"
      style={{ backgroundColor: "var(--theme-color)" }}
      className="text-white hover:opacity-90"
    >
      <Link href={`/${slug}/login`}>
        <User className="h-4 w-4 mr-1.5" />
        Sign in
      </Link>
    </Button>
  );
}
