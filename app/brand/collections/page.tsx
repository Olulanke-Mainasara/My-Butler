"use client";

import { Button } from "@/components/Shad-UI/button";
import { PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import { Collection } from "@/types/Collection";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import CollectionCard from "@/components/Custom-UI/Cards/CollectionCard";

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    async function fetchCollections() {
      const { data, error } = await supabase.from("collections").select("*");

      if (error) {
        toast.error("Failed to fetch collections.");
        return;
      }

      setCollections(data);
    }

    fetchCollections();
  }, []);

  console.log(collections);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">Collections</h1>
          <p className="opacity-70">Manage your published Collections.</p>
        </div>
        {collections.length > 0 && (
          <Button asChild>
            <Link href="/brand/collections/new" className="flex items-center">
              <PlusCircle />
              Add Collection
            </Link>
          </Button>
        )}
      </div>

      {collections.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} item={collection} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg text-xl flex flex-col gap-4 items-center">
          <p>No collections found.</p>
          <Button asChild>
            <Link href="/brand/collections/new" className="flex items-center">
              <PlusCircle />
              Create Collection
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
