import { Suspense } from "react";
import { getBusinessBySlug } from "@/lib/public-fetches/get-business-by-slug";
import { CustomerLoginForm } from "@/components/public/auth/public-login-form";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <p className="text-sm text-muted-foreground">Signing in to</p>
        <p className="font-bold text-lg">{business.name}</p>
      </div>
      <Suspense>
        <CustomerLoginForm slug={slug} />
      </Suspense>
    </div>
  );
}
