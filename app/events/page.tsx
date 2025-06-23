"use client";

import React from "react";
import CarouselWithSlideTracker from "@/components/Custom-UI/Carousel/CarouselWithSlideTracker";
import EventCard from "@/components/Custom-UI/Cards/EventCard";
import { Event } from "@/types/Event";
import { fetchEvents } from "@/lib/DatabaseFetches";
import FullTextSearchInput from "@/components/Custom-UI/Buttons/Search";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Shad-UI/button";
import Image from "next/image";
import LoadingSkeleton from "@/components/Custom-UI/Placeholders/LoadingSkeleton";

const Events = () => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [searchResult, setSearchResult] = React.useState<Event[]>([]);
  const router = useRouter();
  const hasRendered = React.useRef(false);

  const handleSearchResult = (result: unknown[]) => {
    setSearchResult(result as Event[]);
  };

  const fetchPageData = async () => {
    const [Events] = await Promise.all([fetchEvents()]);

    setEvents(Array.isArray(Events) ? Events : []);
  };

  React.useEffect(() => {
    if (hasRendered.current) {
      return;
    }

    hasRendered.current = true;
    fetchPageData();
  }, []);

  return (
    <div className="mt-[76px] md:mt-6 pb-5 space-y-7 xl:space-y-0">
      <div className="flex justify-center fixed left-0 top-12 py-3 w-full bg-lightBackground dark:bg-darkBackground z-10">
        <div className="px-4 xl:px-0 w-full md:w-4/6 xl:w-3/6 mx">
          <FullTextSearchInput
            table="events"
            column="title"
            handleSearchResult={handleSearchResult}
          />
        </div>
      </div>

      {searchResult.length > 0 ? (
        <div className="space-y-4 pt-16 md:pt-28">
          <div className="px-4 xl:px-5 flex items-center gap-4">
            <p className="text-3xl md:text-4xl">Search Results</p>
            <Button
              variant={"outline"}
              onClick={() => {
                router.push("?");
                handleSearchResult([]);
              }}
            >
              Clear
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-8 px-4 xl:px-5">
            {searchResult.map((result) => (
              <EventCard item={result} key={result.id} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <section className="pt-14 md:pt-28 xl:pt-[120px] px-4 md:px-5 relative flex flex-col gap-4 xl:flex-row xl:gap-8 items-center">
            <div className="w-full xl:w-1/2 text-center">
              <p className="text-2xl md:text-4xl">Individual scenes, same</p>
              <p className="text-7xl md:text-[120px] text-brandLight dark:text-brandDark">
                Confidence
              </p>
            </div>

            <div className="w-full lg:max-w-screen-md xl:w-1/2 grid grid-cols-2 gap-4 xl:gap-8">
              <div className="h-44 md:h-60 rounded-2xl relative object-cover object-top overflow-hidden">
                <Image
                  src={"/Pages/Collections/collection.webp"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  alt="Group of people with different styles"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="h-44 md:h-60 rounded-2xl relative object-cover object-top overflow-hidden">
                <Image
                  src={"/Pages/Collections/collection2.png"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  alt="Group of people with different styles"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="h-44 md:h-60 rounded-2xl relative object-cover object-top overflow-hidden">
                <Image
                  src={"/Pages/Collections/collection.webp"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  alt="Group of people with different styles"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="h-44 md:h-60 rounded-2xl relative object-cover object-top overflow-hidden">
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

          <section className="space-y-10 xl:pt-10">
            <CarouselWithSlideTracker items={events}>
              <EventCard />
            </CarouselWithSlideTracker>

            <section className="space-y-4 px-4 md:px-5 pt-5">
              <p className="text-3xl md:text-4xl">Upcoming</p>

              {events.length === 0 ? (
                <LoadingSkeleton />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
                  {events.map((event) => (
                    <EventCard key={event.id} item={event} />
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-4 px-4 md:px-5">
              <p className="text-center text-3xl md:text-4xl">
                What&apos;s Your Scene?
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

              {events.length === 0 ? (
                <LoadingSkeleton />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
                  {events.map((event) => (
                    <EventCard key={event.id} item={event} />
                  ))}
                </div>
              )}
            </section>
          </section>
        </>
      )}
    </div>
  );
};

export default Events;
