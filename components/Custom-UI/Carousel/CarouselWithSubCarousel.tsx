import React, { ReactElement } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/Shad-UI/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Icons } from "../icons";

const CarouselWithSubCarousel = ({
  items,
  subItems,
  children,
}: {
  items: object[];
  subItems: { name: string }[];
  children: ReactElement<{ item: object; form: "static" | "carousel" }>;
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col xl:flex-row w-full xl:pr-7 gap-4 xl:gap-0">
      {subItems.length === 0 ? (
        <div className="text-center px-10 py-5 xl:py-28 border rounded-lg text-xl flex flex-col gap-4 items-center xl:px-2 xl:mr-2 xl:w-1/12">
          <Icons.spinner className="animate-spin" />
        </div>
      ) : (
        <div className="xl:basis-[10.7%] flex items-center">
          <div className="xl:h-44 w-full">
            <Carousel
              opts={{
                align: "start",
              }}
              orientation={isMobile ? "horizontal" : "vertical"}
              className="w-full"
            >
              <CarouselContent className="-mt-5 h-20 xl:h-[200px] pr-16 xl:pr-0">
                {subItems.map((subItem, index) => (
                  <CarouselItem
                    key={index}
                    className="pt-5 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/3"
                  >
                    <div className="p-1 border h-full flex items-center justify-center rounded-3xl xl:rounded-lg text-xl xl:text-base">
                      {subItem.name}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden xl:flex" />
              <CarouselNext className="hidden xl:flex" />
            </Carousel>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-28 border rounded-lg text-xl flex justify-center gap-1 items-center w-full">
          <Icons.spinner className="animate-spin" />
          <p>Loading</p>
        </div>
      ) : (
        <div className="xl:basis-5/6 xl:w-11/12 flex items-center h-full xl:pl-16 xl:pr-4">
          <div className="w-full h-full">
            <Carousel opts={{ align: "start" }} className="h-full">
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
        </div>
      )}
    </div>
  );
};

export default CarouselWithSubCarousel;
