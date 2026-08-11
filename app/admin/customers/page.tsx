"use client";

import { getAllCustomers } from "@/lib/fetches";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Icons } from "@/components/Custom-UI/icons";
import { convertRawDateToReadableDate } from "@/lib/utils";
import { User } from "lucide-react";
import Image from "next/image";

export default function AdminCustomersPage() {
  const { data: customers } = useQuery(getAllCustomers());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl">Customers</h1>
        <p className="opacity-70">Everyone with a customer account.</p>
      </div>

      {!customers ? (
        <div className="flex items-center justify-center py-10">
          <Icons.spinner className="w-6 h-6 animate-spin" />
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-10 border rounded-lg text-xl">
          <p>No customers yet.</p>
        </div>
      ) : (
        <div className="border rounded-xl divide-y">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="p-4 flex items-center gap-3 flex-wrap justify-between"
            >
              <div className="flex items-center gap-3">
                {customer.profile_picture ? (
                  <Image
                    src={customer.profile_picture}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                    alt={`${customer.display_name} avatar`}
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
                  <p className="text-lg font-semibold">
                    {customer.display_name}
                  </p>
                  <p className="opacity-70 text-sm">{customer.email}</p>
                </div>
              </div>
              <div className="text-sm opacity-70 text-right">
                {customer.phone_no && <p>{customer.phone_no}</p>}
                {customer.location && <p>{customer.location}</p>}
                <p>
                  Joined{" "}
                  {customer.created_at
                    ? convertRawDateToReadableDate(customer.created_at)
                    : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
