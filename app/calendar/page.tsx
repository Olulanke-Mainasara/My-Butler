"use client";
import { Calendar } from "@/components/Shad-UI/calendar";
import { getEvents } from "@/lib/fetches";
import { buildItemSlugId, convertRawDateToReadableDate } from "@/lib/utils";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { CalendarX, MapPin } from "lucide-react";
import React from "react";

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const CalendarPage = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { data: events } = useQuery(getEvents());

  const eventDates = React.useMemo(
    () => (events ?? []).map((event) => new Date(event.start_date)),
    [events],
  );

  // The panel is meant to show what's happening on the selected day, not
  // every event that exists, so it needs to actually filter by `date`.
  const selectedDateEvents = React.useMemo(
    () =>
      date
        ? (events ?? []).filter((event) =>
            isSameDay(new Date(event.start_date), date),
          )
        : [],
    [events, date],
  );

  return (
    <div className="mt-19 pb-4 xl:pb-5 flex flex-col lg:flex-row gap-4 lg:gap-5 grow px-4 xl:px-5 h-full">
      <div className="w-full lg:basis-8/12 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-2 md:p-4 flex items-center justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          modifiers={{ hasEvent: eventDates }}
          modifiersClassNames={{
            hasEvent:
              "relative after:content-[''] after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-brandLight dark:after:bg-brandDark",
          }}
          className="w-full h-full px-0 py-0 overflow-hidden"
        />
      </div>

      <div className="w-full lg:basis-4/12 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 md:p-5 flex flex-col gap-4">
        <div>
          <p className="text-xl md:text-2xl font-semibold">
            {date
              ? convertRawDateToReadableDate(date.toISOString())
              : "No date selected"}
          </p>
          <p className="text-sm opacity-60">
            {selectedDateEvents.length}{" "}
            {selectedDateEvents.length === 1 ? "event" : "events"}
          </p>
        </div>

        {selectedDateEvents.length > 0 ? (
          <ul className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
            {selectedDateEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${buildItemSlugId(event.slug, event.id)}`}
                prefetch={false}
                className="py-3 first:pt-0 last:pb-0 flex items-center gap-3 group"
              >
                <Image
                  src={event.display_image ?? "/placeholder.svg"}
                  alt={event.title}
                  width={56}
                  height={56}
                  className="rounded-lg object-cover w-14 h-14 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-medium truncate group-hover:underline underline-offset-2">
                    {event.title}
                  </h3>
                  {!event.is_virtual && event.location && (
                    <p className="flex items-center gap-1 text-sm opacity-70 truncate">
                      <MapPin size={13} className="shrink-0" />
                      {event.location}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <div className="min-h-40 flex-1 flex flex-col items-center justify-center gap-2 opacity-60">
            <CalendarX size={28} />
            <p className="text-sm">No events on this day</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default CalendarPage;
