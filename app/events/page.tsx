"use client";

import EventCard from "@/components/Custom-UI/Cards/EventCard";
import { getEvents } from "@/lib/fetches";
import Image from "next/image";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/Shad-UI/carousel";
import EventSliderCard from "@/components/Custom-UI/Cards/EventSliderCard";
import { Link } from "next-view-transitions";
import { ArrowRight, CalendarDays, MapPin, Wifi } from "lucide-react";
import {
  buildItemSlugId,
  convertRawDateToReadableDate,
  convertRawDateToReadableTime,
} from "@/lib/utils";

const Events = () => {
  const { data: events } = useQuery(getEvents());

  const [featured, ...rest] = events ?? [];

  return (
    <main className="space-y-10 mt-19 pb-5">
      <section className="px-4 md:px-5">
        {featured ? (
          <Link
            href={`/events/${buildItemSlugId(featured.slug, featured.id)}`}
            prefetch={false}
            className="group relative block w-full h-96 md:h-128 xl:h-144 rounded-2xl overflow-hidden"
          >
            <Image
              src={featured.display_image ?? "/placeholder.svg"}
              alt={featured.title}
              fill
              sizes="100vw"
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 xl:p-14 max-w-3xl flex flex-col gap-3 text-white">
              <span className="w-fit text-xs font-medium uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm">
                Featured Event
              </span>
              <h1 className="text-3xl md:text-5xl xl:text-6xl font-semibold leading-tight">
                {featured.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm md:text-base opacity-90">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={16} />
                  {convertRawDateToReadableDate(featured.start_date)} ·{" "}
                  {convertRawDateToReadableTime(featured.start_date)}
                </span>
                {featured.is_virtual ? (
                  <span className="flex items-center gap-1.5">
                    <Wifi size={16} />
                    Online event
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    {featured.location ?? "No location"}
                  </span>
                )}
              </div>
              <span className="inline-flex items-center gap-1.5 mt-1 text-sm md:text-base font-medium group-hover:gap-2.5 transition-all duration-300">
                View event details
                <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        ) : (
          <div className="w-full h-96 md:h-128 xl:h-144 rounded-2xl bg-darkBackground/5 dark:bg-lightBackground/5 animate-pulse" />
        )}
      </section>

      <Carousel opts={{ align: "start" }} className="h-125 md:h-150">
        <CarouselContent className="h-full ml-0">
          {rest.slice(0, 8).map((event) => (
            <CarouselItem
              key={event.id}
              className="h-full basis-[85%] md:basis-[40%] last:pr-4 md:first:pl-5 md:last:pr-5"
            >
              <EventSliderCard item={event} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-5 border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white" />
        <CarouselNext className="hidden md:flex right-5 border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white" />
      </Carousel>

      <section className="space-y-4 px-4 md:px-5 pt-5">
        {events === undefined ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
            {rest.map((event) => (
              <EventCard key={event.id} item={event} />
            ))}
          </div>
        )}
      </section>

      <section className="py-14 px-4 md:px-5 relative flex flex-col gap-4 xl:flex-row xl:gap-8 items-center">
        <div className="w-full xl:w-1/2 text-center">
          <p className="text-2xl md:text-4xl">Individual scenes, same</p>
          <p className="text-7xl md:text-[120px] text-brandLight dark:text-brandDark">
            Confidence
          </p>
        </div>

        <div className="w-full lg:max-w-3xl xl:w-1/2 grid grid-cols-2 gap-4 xl:gap-8">
          <div className="h-44 md:h-60 rounded-xl relative object-cover object-top overflow-hidden">
            <Image
              src={"/Pages/Collections/collection.webp"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              alt="Group of people with different styles"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="h-44 md:h-60 rounded-xl relative object-cover object-top overflow-hidden">
            <Image
              src={"/Pages/Collections/collection2.png"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              alt="Group of people with different styles"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="h-44 md:h-60 rounded-xl relative object-cover object-top overflow-hidden">
            <Image
              src={"/Pages/Collections/collection.webp"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              alt="Group of people with different styles"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="h-44 md:h-60 rounded-xl relative object-cover object-top overflow-hidden">
            <Image
              src={"/Pages/Collections/collection2.png"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              alt="Group of people with different styles"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 px-4 md:px-5">
        {events?.length === 0 ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
            {events?.map((event) => (
              <EventCard key={event.id} item={event} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4 px-4 md:px-5 py-12">
        <p className="text-center text-3xl md:text-4xl">
          What&apos;s Your Scene?
        </p>
        <div className="grid md:grid-cols-3 gap-4 md:gap-5 mx-auto xl:w-full">
          <div className="border rounded-xl col-span-2 xl:col-span-1 xl:row-span-2 h-44 xl:h-auto"></div>
          <div className="border h-44 md:h-52 xl:h-60 rounded-xl"></div>
          <div className="border h-44 md:h-52 xl:h-60 rounded-xl col-start-2"></div>
          <div className="hidden md:block border rounded-xl row-start-1 col-start-3 row-span-2"></div>
        </div>
      </section>

      <section className="space-y-4 px-4 md:px-5">
        {events?.length === 0 ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
            {events?.map((event) => (
              <EventCard key={event.id} item={event} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Events;
