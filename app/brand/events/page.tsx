"use client";

import { Button } from "@/components/Shad-UI/button";
import { PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Event } from "@/types/Event";
import EventCard from "@/components/Custom-UI/Cards/EventCard";

export default function Collections() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase.from("events").select("*");

      if (error) {
        toast.error("Failed to fetch events.");
        return;
      }

      setEvents(data);
    }

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">Events</h1>
          <p className="opacity-70">Manage your posted Events.</p>
        </div>
        {events.length > 0 && (
          <Button asChild>
            <Link href="/brand/events/new" className="flex items-center">
              <PlusCircle />
              Post Event
            </Link>
          </Button>
        )}
      </div>

      {events.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} item={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg text-xl flex flex-col gap-4 items-center">
          <p>No events found.</p>
          <Button asChild>
            <Link href="/brand/events/new" className="flex items-center">
              <PlusCircle />
              Post Event
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
