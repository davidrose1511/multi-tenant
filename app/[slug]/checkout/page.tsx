import { getBusinessBySlug } from "@/lib/public/get-business-by-slug";
import { createClient } from "@/lib/supabase/server";
import { CheckoutShell } from "@/components/public/checkout/checkout-shell";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims ?? null;

  // if logged in fetch customer record
  let customer = null;
  if (user) {
    const { data: customerData } = await supabase
      .from("customers")
      .select("*")
      .eq("auth_user_id", user.sub)
      .eq("business_id", business.id)
      .single();
    customer = customerData;
  }

  return (
    <CheckoutShell
      business={business}
      user={user}
      customer={customer}
      slug={slug}
    />
  );
}
