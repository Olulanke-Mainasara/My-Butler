"use client";

import { Button } from "@/components/Shad-UI/button";
import { PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import EventCard from "@/components/Custom-UI/Cards/EventCard";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { getEvents } from "@/lib/fetches";
import { useBrandProfile } from "@/components/Providers/UserProvider";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export default function Collections() {
  const brandProfile = useBrandProfile();

  const { data: events } = useQuery(
    getEvents().eq("brand_id", brandProfile?.id || ""),
    {
      enabled: !!brandProfile?.id,
    }
  );

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
