import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/Shad-UI/carousel";

const NormalCarousel = ({ items }: { items: object[] }) => {
  return (
    <div className="w-full h-64 xl:px-12 xl:h-72">
      <Carousel opts={{ align: "start" }} className="h-full xl:pr-0">
        <CarouselContent className="-ml-5 xl:-ml-8 h-full pr-24 xl:pr-0">
          {items.map((_, index) => (
            <CarouselItem
              key={index}
              className="md:basis-1/2 xl:basis-1/4 pl-5 xl:pl-8 h-full"
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
  );
};

export default NormalCarousel;
