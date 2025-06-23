"use client";

import { Button } from "@/components/Shad-UI/button";
import { PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import { Collection } from "@/types/Collection";
import { useEffect, useState } from "react";
import CollectionCard from "@/components/Custom-UI/Cards/CollectionCard";
import LoadingSkeleton from "@/components/Custom-UI/Placeholders/LoadingSkeleton";
import { fetchCollections } from "@/lib/DatabaseFetches";
import { useBrandProfile } from "@/components/Providers/UserProvider";

export default function Collections() {
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const brandProfile = useBrandProfile();

  useEffect(() => {
    if (!brandProfile) {
      return;
    }

    const fetchPageData = async () => {
      const [collections] = await Promise.all([
        fetchCollections({ filters: { brand_id: brandProfile?.id ?? "" } }),
      ]);

      setCollections(Array.isArray(collections) ? collections : []);
    };

    fetchPageData();
  }, [brandProfile]);

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
