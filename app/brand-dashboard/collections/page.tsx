"use client";

import { Button } from "@/components/Shad-UI/button";
import { PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import CollectionCard from "@/components/Custom-UI/Cards/CollectionCard";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { getCollections } from "@/lib/fetches";
import { useBrandProfile } from "@/components/Providers/UserProvider";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export default function Collections() {
  const brandProfile = useBrandProfile();

  const { data: collections } = useQuery(
    getCollections().eq("brand_id", brandProfile?.id || ""),
    {
      enabled: !!brandProfile?.id,
    }
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">Collections</h1>
          <p className="opacity-70">Manage your published Collections.</p>
        </div>
        {collections && collections.length > 0 && (
          <Button asChild>
            <Link
              href="/brand-dashboard/collections/new"
              className="flex items-center"
            >
              <PlusCircle />
              Add Collection
            </Link>
          </Button>
        )}
      </div>

      {collections && collections.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {collections.map((product) => (
            <CollectionCard key={product.id} item={product} />
          ))}
        </div>
      ) : collections && collections.length === 0 ? (
        <div className="text-center py-10 border rounded-lg text-xl flex flex-col gap-4 items-center">
          <p>No collections found.</p>
          <Button asChild>
            <Link
              href="/brand-dashboard/collections/new"
              className="flex items-center"
            >
              <PlusCircle />
              Create Collection
            </Link>
          </Button>
        </div>
      ) : (
        <LoadingSkeleton />
      )}
    </div>
  );
}
