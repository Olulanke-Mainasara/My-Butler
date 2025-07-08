"use client";

import { Button } from "@/components/Shad-UI/button";
import { PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import { useEffect, useState } from "react";
import { Event } from "@/types/Event";
import EventCard from "@/components/Custom-UI/Cards/EventCard";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { fetchEvents } from "@/lib/DatabaseFetches";
import { useBrandProfile } from "@/components/Providers/UserProvider";

export default function Collections() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const brandProfile = useBrandProfile();

  useEffect(() => {
    if (!brandProfile) {
      return;
    }

    const fetchPageData = async () => {
      const [events] = await Promise.all([
        fetchEvents({ filters: { brand_id: brandProfile?.id ?? "" } }),
      ]);

      setEvents(Array.isArray(events) ? events : []);
    };

    fetchPageData();
  }, [brandProfile]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">Events</h1>
          <p className="opacity-70">Manage your posted Events.</p>
        </div>
        {events && events.length > 0 && (
          <Button asChild>
            <Link
              href="/brand-dashboard/events/new"
              className="flex items-center"
            >
              <PlusCircle />
              Post Event
            </Link>
          </Button>
        )}
      </div>

      {events && events.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {events.map((product) => (
            <EventCard key={product.id} item={product} />
          ))}
        </div>
      ) : events && events.length === 0 ? (
        <div className="text-center py-10 border rounded-lg text-xl flex flex-col gap-4 items-center">
          <p>No events found.</p>
          <Button asChild>
            <Link
              href="/brand-dashboard/events/new"
              className="flex items-center"
            >
              <PlusCircle />
              Create Event
            </Link>
          </Button>
        </div>
      ) : (
        <LoadingSkeleton />
      )}
    </div>
  );
}
