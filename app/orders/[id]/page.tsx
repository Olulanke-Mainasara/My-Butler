"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getOrder } from "@/lib/fetches";
import { Icons } from "@/components/Custom-UI/icons";
import { CheckCircle2, Clock } from "lucide-react";
import { Link } from "next-view-transitions";
import { Button } from "@/components/Shad-UI/button";

function OrderStatusBanner({ status }: { status: string }) {
  const searchParams = useSearchParams();
  const justCompleted = searchParams.get("checkout") === "success";

  return (
    <div className="flex flex-col items-center text-center gap-2">
      {status === "paid" ? (
        <CheckCircle2 className="size-12 text-green-500" />
      ) : (
        <Clock className="size-12 text-yellow-500" />
      )}
      <h1 className="text-3xl md:text-4xl">
        {status === "paid" ? "Order confirmed!" : "Order pending"}
      </h1>
      <p className="opacity-70">
        {status === "paid"
          ? "Thanks for your purchase - here's what you ordered."
          : justCompleted
            ? "We're confirming your payment. This page will update shortly - feel free to refresh."
            : "This order hasn't been paid for yet."}
      </p>
    </div>
  );
}

export default function OrderPage() {
  const pathname = usePathname();
  const orderId = pathname.split("/").pop() || "";

  const { data: order, isError } = useQuery(getOrder(orderId), {
    enabled: !!orderId,
  });

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="w-6 h-6 animate-spin" /> Loading
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-2xl">Order not found</p>
        <Link href="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const items = order.order_items ?? [];

  return (
    <div className="pt-24 px-4 md:px-5 pb-10 max-w-[theme(screens.md)] mx-auto space-y-6">
      <Suspense fallback={null}>
        <OrderStatusBanner status={order.status} />
      </Suspense>

      <div className="border rounded-xl divide-y">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between p-4">
            <div>
              <p>{item.product_name}</p>
              <p className="opacity-70 text-sm">Qty {item.quantity}</p>
            </div>
            <p>${(item.unit_price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-xl font-semibold px-1">
        <span>Total</span>
        <span>${order.total_amount.toFixed(2)}</span>
      </div>

      <div className="flex justify-center">
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
