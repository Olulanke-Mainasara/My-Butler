import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/Shad-UI/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

const CarouselWithSubCarousel = ({ items }: { items: object[] }) => {
  const ismobile = useIsMobile();

  return (
    <div className="flex flex-col xl:flex-row w-full gap-6 md:gap-8 xl:gap-16 xl:pr-7 h-[340px]">
      <div className="xl:basis-[10.7%] flex items-center">
        <div className="xl:h-44 w-full">
          <Carousel
            opts={{
              align: "start",
            }}
            orientation={ismobile ? "horizontal" : "vertical"}
            className="w-full"
          >
            <CarouselContent className="-mt-5 h-20 xl:h-[200px] pr-16 xl:pr-0">
              {items.map((_, index) => (
                <CarouselItem
                  key={index}
                  className="pt-5 basis-1/2 md:basis-1/3"
                >
                  <div className="p-1 border h-full flex items-center justify-center rounded-3xl xl:rounded-lg">
                    {index}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden xl:flex" />
            <CarouselNext className="hidden xl:flex" />
          </Carousel>
        </div>
      </div>

      <div className="xl:basis-5/6 xl:w-11/12 flex items-center h-full">
        <div className="w-full h-full">
          <Carousel opts={{ align: "start" }} className="h-full">
            <CarouselContent className="-ml-5 xl:-ml-8 h-full pr-24 xl:pr-0">
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 xl:basis-1/3 pl-5 xl:pl-8 h-full"
                >
                  <div className="border flex items-center justify-center h-full rounded-3xl">
                    {index}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden xl:flex" />
            <CarouselNext className="hidden xl:flex" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default CarouselWithSubCarousel;
