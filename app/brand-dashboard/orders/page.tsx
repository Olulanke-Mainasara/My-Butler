"use client";

import { useBrandProfile } from "@/components/Providers/UserProvider";
import { getBrandOrderItems } from "@/lib/fetches";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { Badge } from "@/components/Shad-UI/badge";
import { convertRawDateToReadableDate } from "@/lib/utils";

export default function BrandOrdersPage() {
  const brandProfile = useBrandProfile();

  const { data: orderItems } = useQuery(
    getBrandOrderItems(brandProfile?.id || ""),
    { enabled: !!brandProfile?.id }
  );

  const paidItems = orderItems?.filter((item) => item.orders?.status === "paid");

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1 text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight">Orders</h1>
        <p className="opacity-70">
          Products customers have purchased from you.
        </p>
      </div>

      {!orderItems ? (
        <LoadingSkeleton />
      ) : paidItems && paidItems.length > 0 ? (
        <div className="border rounded-xl divide-y">
          {paidItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4"
            >
              <div>
                <p className="text-lg">{item.product_name}</p>
                <p className="opacity-70 text-sm">
                  Qty {item.quantity} &middot;{" "}
                  {item.orders?.created_at
                    ? convertRawDateToReadableDate(item.orders.created_at)
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">
                  ${(item.unit_price * item.quantity).toFixed(2)}
                </Badge>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  Paid
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg text-xl">
          <p>No orders yet.</p>
        </div>
      )}
    </div>
  );
}
