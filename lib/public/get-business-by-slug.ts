import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export async function getBusinessBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) notFound();

  return data;
}
