"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  step: number;
  setStep: (step: 1 | 2 | 3) => void;
  user: any | null;
  slug: string;
};

export function StepAccount({ step, setStep, user, slug }: Props) {
  const router = useRouter();
  const isComplete = step > 1;
  const isActive = step === 1;

  return (
    <div
      className={isActive || isComplete ? "" : "opacity-40 pointer-events-none"}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-base">Account</h2>
        {isComplete && (
          <button
            className="text-xs text-muted-foreground hover:underline"
            onClick={() => setStep(1)}
          >
            Change
          </button>
        )}
      </div>

      {isComplete ? (
        // completed state — show summary
        <p className="text-sm text-muted-foreground">
          {user ? `Signed in as ${user.email}` : "Continuing as guest"}
        </p>
      ) : (
        // active state
        <div className="space-y-3">
          {user ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Signed in as{" "}
                <span className="font-medium text-foreground">
                  {user.email}
                </span>
              </p>
              <Button
                onClick={() => setStep(2)}
                style={{ backgroundColor: "var(--theme-color)" }}
                className="text-white"
              >
                Continue
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Sign in to save your order history, or continue as guest.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/${slug}/login?next=/${slug}/checkout`)
                  }
                >
                  Log in
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/${slug}/signup?next=/${slug}/checkout`)
                  }
                >
                  Sign up
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  style={{ backgroundColor: "var(--theme-color)" }}
                  className="text-white"
                >
                  Continue as Guest
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
