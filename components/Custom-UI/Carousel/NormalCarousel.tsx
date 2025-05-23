import React, { ReactElement } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/Shad-UI/carousel";

const NormalCarousel = ({
  items,
  children,
}: {
  items: object[];
  children: ReactElement<{ item: object; form: "static" | "carousel" }>;
}) => {
  return (
    <div className="w-full xl:px-12">
      <Carousel opts={{ align: "start" }} className="h-full xl:pr-0">
        <CarouselContent className="-ml-5 xl:-ml-8 h-full pr-24 xl:pr-0">
          {items.map((item, index) => {
            const form = "static"; // Initialize the 'form' variable
            return (
              <CarouselItem
                key={index}
                className="md:basis-1/2 xl:basis-1/4 pl-5 xl:pl-8 h-full"
              >
                {React.cloneElement(children, { item, form })}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden xl:flex" />
        <CarouselNext className="hidden xl:flex" />
      </Carousel>
    </div>
  );
};

export default NormalCarousel;
