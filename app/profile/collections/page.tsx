"use client";

import { Button } from "@/components/Shad-UI/button";
import { BookCopy, PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import { useEffect, useState } from "react";
import { getBookmarkedItems } from "@/lib/DatabaseFetches";
import CollectionCard from "@/components/Custom-UI/Cards/CollectionCard";
import { Collection } from "@/types/Collection";
import { useBookmarks } from "@/components/Providers/AllProviders";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";

export default function Products() {
  const [bookmarkItems, setBookmarkItems] = useState<Collection[] | null>(null);
  const bookmarks = useBookmarks();

  const fetchPageData = async (filteredBookmarkIds: string[]) => {
    const [Bookmarks] = await Promise.all([
      getBookmarkedItems(filteredBookmarkIds, "collections"),
    ]);

    setBookmarkItems(
      (Bookmarks || []).filter(
        (item): item is Collection =>
          typeof item === "object" &&
          item !== null &&
          !("price" in item) &&
          !("author" in item) &&
          !("location" in item)
      )
    );
  };

  useEffect(() => {
    if (!bookmarks) {
      return;
    }

    const filteredBookmarkIds = bookmarks
      .filter((item) => item.target_type_name === "collection")
      .map((item) => item.target_type_id);
    fetchPageData(filteredBookmarkIds);
  }, [bookmarks]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">Collections</h1>
          <p className="text-neutral-400">
            View all your bookmarked collections.
          </p>
        </div>
        <Button asChild>
          <Link href="/collections" className="flex items-center">
            <PlusCircle />
            Add Collection
          </Link>
        </Button>
      </div>

      {!bookmarkItems ? (
        <LoadingSkeleton />
      ) : bookmarkItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
          {bookmarkItems.map((bookmark, index) => (
            <CollectionCard item={bookmark} key={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border rounded-lg text-xl flex justify-center items-center gap-2">
          <span className="text-brandLight dark:text-brandDark">
            <BookCopy />
          </span>
          <p>No collections found.</p>
        </div>
      )}
    </div>
  );
}
