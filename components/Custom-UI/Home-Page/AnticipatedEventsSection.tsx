import { Button } from "@/components/Shad-UI/button";
import Link from "next/link";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../Shad-UI/empty";
import { GiTicket } from "react-icons/gi";
import LoadingSkeleton from "../Skeletons/LoadingSkeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../Shad-UI/carousel";
import EventSliderCard from "../Cards/EventSliderCard";
import { Event } from "@/types/system-types/Event";

const AnticipatedEventsSection = ({
  events,
  isLoadingEvents,
}: {
  events: Event[];
  isLoadingEvents: boolean;
}) => {
  return (
    <section className="flex flex-col gap-8 dark:text-white">
      <div className="flex items-center justify-center gap-5 px-4 md:px-5">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter">
          Anticipated Events.
        </h2>
        <Button variant="outline" asChild>
          <Link href="/events">View More</Link>
        </Button>
      </div>

      {isLoadingEvents ? (
        <LoadingSkeleton
          length={1}
          height="h-[500px] md:h-[600px]"
          className="md:grid-cols-1 px-4 md:px-5"
        />
      ) : !events || events.length === 0 ? (
        <Empty className="border dark:text-white px-4 md:px-5">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <GiTicket />
            </EmptyMedia>
            <EmptyTitle>Nothing on the calendar yet</EmptyTitle>
            <EmptyDescription>
              Trunk shows, launches, and private shopping experiences will show
              up here as brands post them.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Carousel opts={{ align: "start" }} className="h-125 md:h-150">
          <CarouselContent className="h-full ml-0">
            {events.slice(0, 8).map((event) => (
              <CarouselItem
                key={event.id}
                className="h-full basis-[85%] md:basis-[40%] last:pr-4 md:first:pl-5 md:last:pr-5"
              >
                <EventSliderCard item={event} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex left-4" />
          <CarouselNext className="hidden md:flex right-4" />
        </Carousel>
      )}
    </section>
  );
};

export default AnticipatedEventsSection;
