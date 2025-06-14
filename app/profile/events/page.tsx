"use client";

import { Button } from "@/components/Shad-UI/button";
import { PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import { useEffect, useState } from "react";
import { getBookmarkedItems } from "@/lib/DatabaseFetches";
import EventCard from "@/components/Custom-UI/Cards/EventCard";
import { useBookmarks } from "@/components/Providers/AllProviders";
import { Event } from "@/types/Event";

export default function Products() {
  const [bookmarkItems, setBookmarkItems] = useState<Event[]>([]);
  const bookmarks = useBookmarks();

  const fetchPageData = async (filteredBookmarkIds: string[]) => {
    const [Bookmarks] = await Promise.all([
      getBookmarkedItems(filteredBookmarkIds, "events"),
    ]);

    setBookmarkItems(
      (Bookmarks || []).filter(
        (item): item is Event =>
          typeof item === "object" && item !== null && "location" in item
      )
    );
  };

  useEffect(() => {
    if (!bookmarks) {
      return;
    }

    const filteredBookmarkIds = bookmarks
      .filter((item) => item.target_type_name === "event")
      .map((item) => item.target_type_id);
    fetchPageData(filteredBookmarkIds);
  }, [bookmarks]);

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

      {bookmarkItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-8">
          {bookmarkItems.map((bookmark, index) => (
            <EventCard item={bookmark} key={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border rounded-lg text-xl flex justify-center items-center">
          <p>No events found.</p>
        </div>
      )}
    </div>
  );
}
