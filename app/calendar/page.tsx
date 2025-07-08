"use client";

import { Calendar } from "@/components/Shad-UI/calendar";
import { fetchEvents } from "@/lib/DatabaseFetches";
import { convertRawDateToReadableDate } from "@/lib/utils";
import { Event } from "@/types/Event";
import Image from "next/image";
import React, { useEffect } from "react";
const CalendarPage = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [events, setEvents] = React.useState<Event[] | null>(null);
  const hasRendered = React.useRef(false);

  useEffect(() => {
    const fetchPageData = async () => {
      const [events] = await Promise.all([
        fetchEvents({
          filters: { start_date: date ? date.toLocaleString() : "" },
        }),
      ]);

      setEvents(Array.isArray(events) ? events : []);
    };

    if (hasRendered.current) {
      return;
    }

    hasRendered.current = true;
    fetchPageData();
  }, [date]);

  return (
    <div className="pt-16 md:pt-14 pb-4 xl:pb-5 flex flex-col md:flex-row md:gap-x-5 gap-y-4 justify-start grow px-4 xl:px-5 h-full">
      <div className="w-full basis-8/12 flex items-center justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border w-full h-full px-0 py-0 overflow-hidden"
        />
      </div>

      <div className="w-full basis-4/12 flex items-center justify-center">
        <div className="space-y-4 w-full">
          <p className="text-center text-3xl sm:text-2xl">
            Events{" - "}
            {date
              ? convertRawDateToReadableDate(date.toLocaleString())
              : "Date not available"}
          </p>
          <div className="min-h-40 border rounded-md flex items-center justify-center">
            {events && events.length > 0 ? (
              <ul className="w-full p-4">
                {events.map((event) => (
                  <li
                    key={event.id}
                    className="py-4 border-b flex items-center first:pt-0 last:pb-0 last:border-b-0"
                  >
                    <div>
                      <Image
                        src={event.display_image ?? ""}
                        alt={event.title}
                        width={50}
                        height={50}
                        className="rounded-md object-cover w-12 h-12 mr-2"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">
                        {convertRawDateToReadableDate(event.start_date)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-2xl sm:text-xl opacity-80">
                No events
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
