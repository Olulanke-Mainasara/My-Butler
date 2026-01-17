"use client";

import { Button } from "@/components/Shad-UI/button";
import { PartyPopper, PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getBookmarkedItems } from "@/lib/fetches";
import EventCard from "@/components/Custom-UI/Cards/EventCard";
import { useBookmarks } from "@/components/Providers/AllProviders";
import { Event } from "@/types/Event";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { useMemo } from "react";

export default function Events() {
  const bookmarks = useBookmarks();

  // Filter bookmark IDs for events
  const filteredBookmarkIds = useMemo(() => {
    if (!bookmarks) return [];
    return bookmarks
      .filter((item) => item.target_type === "event")
      .map((item) => item.target_id);
  }, [bookmarks]);

  const hasEventBookmarks = filteredBookmarkIds.length > 0;

  // Fetch bookmarked events using React Query
  const {
    data: bookmarkItems,
    isPending,
    isError,
  } = useQuery(getBookmarkedItems(filteredBookmarkIds, "events"), {
    // Only run query when we have bookmark IDs
    enabled: hasEventBookmarks,
  });

  // Type-safe filter for events
  const events = useMemo(() => {
    if (!bookmarkItems) return [];
    return bookmarkItems.filter(
      (item): item is Event =>
        typeof item === "object" && item !== null && "location" in item
    );
  }, [bookmarkItems]);

  // Loading state: only show loading when we have bookmarks and query is pending
  const isLoading = hasEventBookmarks && isPending;

  // No bookmarks at all (neither bookmarks loaded yet OR no event bookmarks)
  const showEmptyState = !bookmarks || !hasEventBookmarks;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">Events</h1>
          <p className="text-neutral-400">View all your bookmarked events.</p>
        </div>
        <Button asChild>
          <Link href="/events" className="flex items-center">
            <PlusCircle />
            Add Event
          </Link>
        </Button>
      </div>

      {showEmptyState ? (
        <div className="text-center py-20 border rounded-lg text-xl flex justify-center items-center gap-2">
          <span className="text-brandLight dark:text-brandDark">
            <PartyPopper />
          </span>
          <p>You have no bookmarked events. Start adding some!</p>
        </div>
      ) : isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <div className="text-center py-20 border rounded-lg text-xl flex justify-center items-center gap-2">
          <p className="text-red-500">
            Error loading events. Please try again.
          </p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
          {events.map((bookmark) => (
            <EventCard item={bookmark} key={bookmark.id} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border rounded-lg text-xl flex justify-center items-center gap-2">
          <span className="text-brandLight dark:text-brandDark">
            <PartyPopper />
          </span>
          <p>No events found.</p>
        </div>
      )}
    </div>
  );
}
