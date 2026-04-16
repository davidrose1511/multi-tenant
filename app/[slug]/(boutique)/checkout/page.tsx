import { getBusinessBySlug } from "@/lib/public-fetches/get-business-by-slug";
import { createClient } from "@/lib/supabase/server";
import { CheckoutShell } from "@/components/public/checkout/checkout-shell";
import { BoutiqueHeaderServer } from "@/components/public/public-boutique/header/boutique-header-server";

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
    <>
      <BoutiqueHeaderServer slug={slug} />
      <CheckoutShell
        business={business}
        user={user}
        customer={customer}
        slug={slug}
      />
    </>
  );
}
