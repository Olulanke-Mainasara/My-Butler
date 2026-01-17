"use client";

import { Button } from "@/components/Shad-UI/button";
import { BookCopy, PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getBookmarkedItems } from "@/lib/fetches";
import CollectionCard from "@/components/Custom-UI/Cards/CollectionCard";
import { Collection } from "@/types/Collection";
import { useBookmarks } from "@/components/Providers/AllProviders";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { useMemo } from "react";

export default function Collections() {
  const bookmarks = useBookmarks();

  // Filter bookmark IDs for collections
  const filteredBookmarkIds = useMemo(() => {
    if (!bookmarks) return [];
    return bookmarks
      .filter((item) => item.target_type === "collection")
      .map((item) => item.target_id);
  }, [bookmarks]);

  const hasProductBookmarks = filteredBookmarkIds.length > 0;

  // Fetch bookmarked collections using React Query
  const {
    data: bookmarkItems,
    isPending,
    isError,
  } = useQuery(getBookmarkedItems(filteredBookmarkIds, "collections"), {
    // Only run query when we have bookmark IDs
    enabled: hasProductBookmarks,
  });

  // Type-safe filter for collections
  const collections = useMemo(() => {
    if (!bookmarkItems) return [];
    return bookmarkItems.filter(
      (item): item is Collection =>
        typeof item === "object" &&
        item !== null &&
        !("price" in item) &&
        !("author" in item) &&
        !("location" in item)
    );
  }, [bookmarkItems]);

  // Loading state: only show loading when we have bookmarks and query is pending
  const isLoading = hasProductBookmarks && isPending;

  // No bookmarks at all (neither bookmarks loaded yet OR no product bookmarks)
  const showEmptyState = !bookmarks || !hasProductBookmarks;

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

      {showEmptyState ? (
        <div className="text-center py-20 border rounded-lg text-xl flex justify-center items-center gap-2">
          <span className="text-brandLight dark:text-brandDark">
            <BookCopy />
          </span>
          <p>You have no bookmarked collections. Start adding some!</p>
        </div>
      ) : isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <div className="text-center py-20 border rounded-lg text-xl flex justify-center items-center gap-2">
          <p className="text-red-500">
            Error loading collections. Please try again.
          </p>
        </div>
      ) : collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
          {collections.map((bookmark) => (
            <CollectionCard item={bookmark} key={bookmark.id} />
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
