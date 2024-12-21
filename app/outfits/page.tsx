"use client";

import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/Shad-UI/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

const Outfits = () => {
  const [brand, setBrand] = useState();
  const ismobile = useIsMobile();

  return (
    <div className="pt-16 md:pt-12 flex flex-col h-full">
      <h1 className="text-center text-4xl xl:text-8xl">Line-ups</h1>

      <section className="flex flex-col xl:flex-row items-center h-full w-full gap-6 md:gap-8 xl:gap-16 p-6 xl:p-12">
        <div className="xl:basis-1/6 w-3/5 flex items-center">
          <div className="xl:h-44 w-full">
            <Carousel
              opts={{
                align: "start",
              }}
              orientation={ismobile ? "horizontal" : "vertical"}
              className="w-full"
            >
              <CarouselContent className="-mt-5 h-20 xl:h-[200px]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index} className="pt-5 md:basis-1/3">
                    <div className="p-1 border h-full flex items-center justify-center">
                      {index}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>

        <div className="xl:basis-5/6 w-4/5 md:w-11/12 flex items-center h-full">
          <div className="w-full h-full">
            <Carousel opts={{ align: "start" }} className="h-full">
              <CarouselContent className="-ml-2 md:-ml-4 h-full">
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 xl:basis-1/3 pl-2 md:pl-4 h-full"
                  >
                    <div className="border flex items-center justify-center h-full">
                      {index}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      <section></section>
    </div>
  );
};

export default Outfits;
