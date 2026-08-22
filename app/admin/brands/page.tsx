"use client";

import { useMemo, useState } from "react";
import { getBrands } from "@/lib/fetches";
import { updateBrandStatus } from "@/lib/mutations";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/Shad-UI/button";
import { Badge } from "@/components/Shad-UI/badge";
import { Icons } from "@/components/Custom-UI/icons";
import { invalidateTable } from "@/lib/utils";
import { Check, User, X } from "lucide-react";
import Image from "next/image";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/Shad-UI/tabs";
import { Brand } from "@/types/system-types/Brand";

const STATUS_BADGE_CLASSES: Record<Brand["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  approved: "bg-green-100 text-green-800 hover:bg-green-200",
  rejected: "bg-red-100 text-red-800 hover:bg-red-200",
};

function BrandRow({ brand }: { brand: Brand }) {
  const queryClient = useQueryClient();

  const { mutate: review, isPending } = useMutation({
    mutationFn: (status: "approved" | "rejected") =>
      updateBrandStatus(supabase, brand.id, status),
    onSuccess: (_data, status) => {
      invalidateTable(queryClient, "brands");
      toast.success(
        status === "approved" ? "Brand approved." : "Brand rejected.",
      );
    },
    onError: () => toast.error("Failed to update brand status."),
  });

  return (
    <div className="p-4 flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
      <div className="flex items-start gap-3">
        {brand.profile_picture ? (
          <Image
            src={brand.profile_picture}
            className="w-12 h-12 rounded-full object-cover shrink-0"
            alt={`${brand.name} logo`}
            width={48}
            height={48}
            quality={75}
          />
        ) : (
          <span className="p-2 rounded-full bg-darkBackground text-white dark:bg-lightBackground dark:text-black shrink-0">
            <User size={32} />
          </span>
        )}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-lg font-semibold">{brand.name}</p>
            <Badge className={STATUS_BADGE_CLASSES[brand.status]}>
              {brand.status}
            </Badge>
          </div>
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
      </div>

      {brand.status === "pending" && (
        <div className="flex gap-2 shrink-0">
          <Button disabled={isPending} onClick={() => review("approved")}>
            <Check className="w-4 h-4" /> Approve
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => review("rejected")}
          >
            <X className="w-4 h-4" /> Reject
          </Button>
        </div>
      )}
    </div>
  );
}

const TABS = ["all", "pending", "approved", "rejected"] as const;
type Tab = (typeof TABS)[number];

function BrandsList({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg text-xl">
        <p>No brands here.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-xl divide-y">
      {brands.map((brand) => (
        <BrandRow key={brand.id} brand={brand} />
      ))}
    </div>
  );
}

export default function AdminBrandsPage() {
  const [tab, setTab] = useState<Tab>("all");
  const { data: brands } = useQuery(getBrands());

  const filtered = useMemo(() => {
    if (!brands) return undefined;
    if (tab === "all") return brands;
    return brands.filter((brand) => brand.status === tab);
  }, [brands, tab]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl">Brands</h1>
        <p className="opacity-70">
          Approve a brand to make its products, collections, events, and
          articles visible to customers.
        </p>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          {TABS.map((value) => (
            <TabsTrigger key={value} value={value} className="capitalize">
              {value}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((value) => (
          <TabsContent key={value} value={value} className="mt-6">
            {!filtered ? (
              <div className="flex items-center justify-center py-10">
                <Icons.spinner className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <BrandsList brands={filtered} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
