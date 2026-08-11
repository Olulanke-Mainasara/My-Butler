"use client";

import { Link } from "next-view-transitions";
import { Button } from "@/components/Shad-UI/button";
import {
  getBrandsCount,
  getCustomersCount,
  getOrdersCount,
  getPendingBrands,
} from "@/lib/fetches";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

function StatCard({
  title,
  value,
  href,
  linkLabel,
  highlight,
}: {
  title: string;
  value: number | undefined;
  href: string;
  linkLabel: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white dark:bg-neutral-900 border p-4 flex flex-col items-center justify-center gap-3 rounded-lg h-full ${
        highlight && value
          ? "border-yellow-500/50"
          : "dark:border-neutral-800"
      }`}
    >
      <p className="text-lg">{title}</p>
      {value === undefined ? (
        <div className="w-28 h-36 bg-neutral-200 animate-pulse"></div>
      ) : (
        <h3 className="text-9xl font-bold">{value}</h3>
      )}
      <Button asChild>
        <Link href={href}>{linkLabel}</Link>
      </Button>
    </div>
  );
}

export default function AdminOverviewPage() {
  const { count: brandsCount } = useQuery(getBrandsCount());
  const { count: customersCount } = useQuery(getCustomersCount());
  const { count: ordersCount } = useQuery(getOrdersCount());
  const { data: pendingBrands } = useQuery(getPendingBrands());

  return (
    <div className="flex flex-col gap-4 h-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-center lg:text-left">
          Overview
        </h2>
      </div>
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4 h-full">
        <StatCard
          title="Total Brands"
          value={brandsCount ?? undefined}
          href="/admin/brands"
          linkLabel="View Brands"
        />
        <StatCard
          title="Pending Approvals"
          value={pendingBrands?.length}
          href="/admin/brands"
          linkLabel="Review Pending"
          highlight
        />
        <StatCard
          title="Total Customers"
          value={customersCount ?? undefined}
          href="/admin/customers"
          linkLabel="View Customers"
        />
        <StatCard
          title="Total Orders"
          value={ordersCount ?? undefined}
          href="/admin/orders"
          linkLabel="View Orders"
        />
      </div>
    </div>
  );
}
