"use client";

import { getAllOrders } from "@/lib/fetches";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Icons } from "@/components/Custom-UI/icons";
import { Badge } from "@/components/Shad-UI/badge";
import { convertRawDateToReadableDate } from "@/lib/utils";

const STATUS_BADGE_CLASSES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  paid: "bg-green-100 text-green-800 hover:bg-green-200",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
};

export default function AdminOrdersPage() {
  const { data: orders } = useQuery(getAllOrders());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl">Orders</h1>
        <p className="opacity-70">Every order placed across the platform.</p>
      </div>

      {!orders ? (
        <div className="flex items-center justify-center py-10">
          <Icons.spinner className="w-6 h-6 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 border rounded-lg text-xl">
          <p>No orders yet.</p>
        </div>
      ) : (
        <div className="border rounded-xl divide-y">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4"
            >
              <div>
                <p className="text-lg">
                  {order.customers?.display_name || "Unknown customer"}
                </p>
                <p className="opacity-70 text-sm">
                  {order.customers?.email} &middot; #{order.id.slice(0, 8)}{" "}
                  &middot;{" "}
                  {order.created_at
                    ? convertRawDateToReadableDate(order.created_at)
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">
                  ${order.total_amount.toFixed(2)}
                </Badge>
                <Badge
                  className={
                    STATUS_BADGE_CLASSES[order.status] ??
                    "bg-neutral-100 text-neutral-800"
                  }
                >
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
