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

const CarouselWithSlideTracker = ({
  items,
  className,
  children,
}: {
  items: object[];
  className?: string;
  children: ReactElement;
}) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className={`w-full h-64 xl:h-72 px-4 md:px-0 ${className}`}>
      <Carousel
        opts={{ align: "center" }}
        setApi={setApi}
        className="h-full xl:pr-0"
      >
        <CarouselContent className="h-full -ml-4 md:-ml-0">
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              className="md:basis-1/2 xl:basis-1/3 h-full pl-4 md:pl-0"
            >
              {React.cloneElement(children, { item })}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-5 disabled:hidden hidden md:flex" />
        <CarouselNext className="right-5 disabled:hidden hidden md:flex" />
        <div className="text-center w-full md:hidden flex gap-1 items-center justify-center h-8">
          {Array.from({ length: count }).map((_, index) => (
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
    </div>
  );
};

export default CarouselWithSlideTracker;
