"use client";

import React, { useCallback } from "react";
import { Search } from "lucide-react";
import CarouselWithSlideTracker from "@/components/Custom-UI/Carousel/CarouselWithSlideTracker";
import EventCard from "@/components/Custom-UI/Cards/EventCard";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Event } from "@/types/Event";

const Events = () => {
  const [events, setEvents] = React.useState<Event[]>([]);

  async function fetchEvents() {
    const { data, error } = await supabase.from("events").select("*");

    if (error) {
      toast.error("Failed to fetch events.");
      return [];
    }

    return data || [];
  }

  const fetchPageData = useCallback(async () => {
    const [Events] = await Promise.all([fetchEvents()]);

    setEvents(Events || []);
  }, []);

  React.useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  return (
    <div className="mt-[141px] md:mt-[136px] xl:mt-36 pb-4 xl:pb-5">
      <div className="justify-center fixed left-0 top-12 py-3 w-full bg-lightBackground dark:bg-darkBackground z-10 px-4 md:px-0">
        <div className="w-full items-center border border-black dark:border-white overflow-hidden rounded-3xl flex h-14 md:w-4/6 md:mx-auto xl:w-3/6">
          <div className="flex items-center p-3">
            <Search className="" />
          </div>

          <input
            type="text"
            placeholder="Find upcoming events"
            className="pr-3 outline-none bg-transparent pl-0 w-full text-lg md:text-xl h-full"
          />
        </div>
      </div>

      <section className="space-y-10">
        <CarouselWithSlideTracker items={events}>
          <EventCard />
        </CarouselWithSlideTracker>

        <section className="space-y-4 px-4 md:px-5">
          <div className="flex items-center justify-between">
            <p className="text-3xl md:text-4xl">Upcoming</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
            {events.map((event) => (
              <EventCard key={event.id} item={event} />
            ))}
          </div>
        </section>

        <section className="space-y-4 px-4 md:px-5">
          <p className="text-center text-3xl md:text-4xl">
            What&apos;s happening?
          </p>
          <div className="grid md:grid-cols-3 gap-4 md:gap-5 mx-auto xl:w-full">
            <div className="border rounded-3xl col-span-2 xl:col-span-1 xl:row-span-2 h-44 xl:h-auto"></div>
            <div className="border h-44 md:h-52 xl:h-60 rounded-3xl"></div>
            <div className="border h-44 md:h-52 xl:h-60 rounded-3xl col-start-2"></div>
            <div className="hidden md:block border rounded-3xl row-start-1 col-start-3 row-span-2"></div>
          </div>
        </section>

        <section className="space-y-4 px-4 md:px-5">
          <div className="flex items-center justify-between">
            <p className="text-3xl md:text-4xl">Recommended</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
            {events.map((event) => (
              <EventCard key={event.id} item={event} />
            ))}
          </div>
        </section>
      </section>
    </div>
  );
};

export default Events;
