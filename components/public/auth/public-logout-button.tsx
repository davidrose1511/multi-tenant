"use client";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = { slug: string };

export function PublicLogoutButton({ slug }: Props) {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${slug}`);
  }

  return (
    <Button variant="outline" size="sm" onClick={logout}>
      Sign out
    </Button>
  );
}
