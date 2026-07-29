"use client";

import { useAuth } from "@/components/Providers/AllProviders";
import { getIsAdmin, getPendingBrands } from "@/lib/fetches";
import { updateBrandStatus } from "@/lib/mutations";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/Shad-UI/button";
import { Icons } from "@/components/Custom-UI/icons";
import { invalidateTable } from "@/lib/utils";
import { Check, X } from "lucide-react";

export default function AdminPage() {
  const user = useAuth();
  const queryClient = useQueryClient();

  const { data: adminRow, isLoading: isCheckingAdmin } = useQuery(
    getIsAdmin(user?.id || ""),
    { enabled: !!user?.id }
  );
  const isAdmin = !!adminRow;

  const { data: pendingBrands } = useQuery(getPendingBrands(), {
    enabled: isAdmin,
  });

  const { mutate: review, isPending } = useMutation({
    mutationFn: ({
      brandId,
      status,
    }: {
      brandId: string;
      status: "approved" | "rejected";
    }) => updateBrandStatus(supabase, brandId, status),
    onSuccess: (_data, variables) => {
      invalidateTable(queryClient, "brands");
      toast.success(
        variables.status === "approved" ? "Brand approved." : "Brand rejected."
      );
    },
    onError: () => toast.error("Failed to update brand status."),
  });

  if (!user || isCheckingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-2">
        <p className="text-2xl">Not authorized</p>
        <p className="opacity-70">This page is only for site admins.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 md:px-5 pb-10 max-w-screen-md mx-auto space-y-6">
      <div>
        <h1 className="text-4xl">Brand applications</h1>
        <p className="opacity-70">
          Approve a brand to make its products, collections, events, and
          articles visible to customers.
        </p>
      </div>

      {!pendingBrands ? (
        <div className="flex items-center justify-center py-10">
          <Icons.spinner className="w-6 h-6 animate-spin" />
        </div>
      ) : pendingBrands.length === 0 ? (
        <div className="text-center py-10 border rounded-lg text-xl">
          <p>No pending applications.</p>
        </div>
      ) : (
        <div className="border rounded-xl divide-y">
          {pendingBrands.map((brand) => (
            <div key={brand.id} className="p-4 space-y-3">
              <div>
                <p className="text-lg font-semibold">{brand.name}</p>
                <p className="opacity-70 text-sm">{brand.email}</p>
                <p className="mt-1">{brand.description}</p>
                {brand.url && (
                  <a
                    href={brand.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    {brand.url}
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  disabled={isPending}
                  onClick={() => review({ brandId: brand.id, status: "approved" })}
                >
                  <Check className="w-4 h-4" /> Approve
                </Button>
                <Button
                  variant="destructive"
                  disabled={isPending}
                  onClick={() => review({ brandId: brand.id, status: "rejected" })}
                >
                  <X className="w-4 h-4" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
