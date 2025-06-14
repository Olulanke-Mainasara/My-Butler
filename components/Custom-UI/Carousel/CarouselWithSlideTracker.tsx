import React, { ReactElement } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/Shad-UI/carousel";
import { motion } from "framer-motion";
import { Icons } from "../icons";

const CarouselWithSlideTracker = ({
  items,
  className,
  children,
}: {
  items: object[];
  className?: string;
  children: ReactElement<{ item: object; form: "static" | "carousel" }>;
}) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className={`w-full h-60 px-4 md:px-5 ${className}`}>
      {items.length === 0 ? (
        <div className="text-center py-28 border rounded-lg text-xl flex justify-center gap-1 items-center w-full">
          <Icons.spinner className="animate-spin" />
          <p>Loading</p>
        </div>
      ) : (
        <Carousel
          opts={{ align: "center" }}
          setApi={setApi}
          className="h-full xl:pr-0"
        >
          <CarouselContent className="h-full -ml-4 md:-ml-5 xl:-ml-8">
            {items.map((item, index) => {
              const form = "carousel"; // Initialize the 'form' variable
              return (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3 h-full pl-4 md:pl-5 xl:pl-8"
                >
                  {React.cloneElement(children, { item, form })}
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-5 disabled:hidden hidden xl:flex" />
          <CarouselNext className="right-5 disabled:hidden hidden xl:flex" />
          <div className="text-center w-full flex gap-1 items-center justify-center h-8">
            {Array.from({ length: items.length }).map((_, index) => (
              <motion.div
                key={index}
                animate={
                  current === index + 1
                    ? { width: 20, backgroundColor: "#65d1fd" }
                    : { width: 8 }
                }
                className="h-2 bg-darkBackground dark:bg-white rounded-full transition"
              ></motion.div>
            ))}
          </div>
        </Carousel>
      )}
    </section>
  );
};

export default CarouselWithSlideTracker;
