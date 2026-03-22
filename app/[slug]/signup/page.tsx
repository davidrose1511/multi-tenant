import { Suspense } from "react";
import { getBusinessBySlug } from "@/lib/get-business-by-slug";
import { CustomerSignUpForm } from "@/components/public/auth/public-signup-form";

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <p className="text-sm text-muted-foreground">Creating account at</p>
        <p className="font-bold text-lg">{business.name}</p>
      </div>
      <Suspense>
        <CustomerSignUpForm slug={slug} businessId={business.id} />
      </Suspense>
    </div>
  );
}
