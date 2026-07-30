"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, CircleDashed, CircleAlert } from "lucide-react";
import { Button } from "@/components/Shad-UI/button";
import { useBrandProfile } from "@/components/Providers/UserProvider";
import { invalidateTable } from "@/lib/utils";

export function StripeConnectCard() {
  const brandProfile = useBrandProfile();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isOpeningDashboard, setIsOpeningDashboard] = useState(false);

  useEffect(() => {
    if (searchParams.get("stripe") === "return") {
      // The webhook is what actually flips charges_enabled/payouts_enabled
      // once Stripe finishes verifying the account, which can lag this
      // redirect - refetch now anyway so a return that's already caught up
      // shows immediately instead of waiting on the realtime subscription.
      invalidateTable(queryClient, "brands");
    }
  }, [searchParams, queryClient]);

  const handleConnect = async () => {
    setIsRedirecting(true);
    try {
      const res = await fetch("/api/stripe/connect/onboard", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.url) {
        toast.error(data.error || "Failed to start Stripe onboarding");
        setIsRedirecting(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error("Failed to start Stripe onboarding");
      setIsRedirecting(false);
    }
  };

  const handleOpenDashboard = async () => {
    setIsOpeningDashboard(true);
    try {
      const res = await fetch("/api/stripe/connect/dashboard-link", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        toast.error(data.error || "Failed to open the Stripe dashboard");
        return;
      }

      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Failed to open the Stripe dashboard");
    } finally {
      setIsOpeningDashboard(false);
    }
  };

  if (!brandProfile) return null;

  const isFullyConnected =
    brandProfile.stripe_account_id &&
    brandProfile.stripe_charges_enabled &&
    brandProfile.stripe_payouts_enabled;

  const isOnboarding =
    brandProfile.stripe_account_id && !isFullyConnected;

  return (
    <div className="rounded-lg border p-4 space-y-3 xl:max-w-screen-sm">
      <div className="flex items-center gap-2">
        {isFullyConnected ? (
          <CheckCircle2 className="text-green-600 w-5 h-5" />
        ) : isOnboarding ? (
          <CircleAlert className="text-yellow-600 w-5 h-5" />
        ) : (
          <CircleDashed className="text-neutral-400 w-5 h-5" />
        )}
        <h4 className="font-semibold">
          {isFullyConnected
            ? "Payouts connected"
            : isOnboarding
              ? "Finish setting up payouts"
              : "Payouts not set up"}
        </h4>
      </div>

      <p className="text-sm opacity-70">
        {isFullyConnected
          ? "Your Stripe account is connected and verified. Your share of every sale is transferred out automatically after checkout."
          : isOnboarding
            ? "You've started connecting a Stripe account, but Stripe still needs more information before it can send you payouts."
            : "Connect a Stripe account so you can actually get paid for sales. Until this is set up, proceeds from your sales stay on the platform's balance and can't be paid out."}
      </p>

      {isFullyConnected ? (
        <Button
          variant="outline"
          onClick={handleOpenDashboard}
          disabled={isOpeningDashboard}
        >
          {isOpeningDashboard ? "Opening..." : "View Stripe Dashboard"}
        </Button>
      ) : (
        <Button onClick={handleConnect} disabled={isRedirecting}>
          {isRedirecting
            ? "Redirecting..."
            : isOnboarding
              ? "Continue onboarding"
              : "Connect with Stripe"}
        </Button>
      )}
    </div>
  );
}
