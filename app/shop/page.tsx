"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/Shad-UI/carousel";
import { Search, Shirt, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { Link } from "next-view-transitions";
import CarouselWithSlideTracker from "@/components/Shared/UI/Carousel/CarouselWithSlideTracker";
import ShopCard from "@/components/Shared/UI/Cards/ShopCard";

const Shop = () => {
  return (
    <div className="mt-[141px] md:mt-[136px] xl:mt-36 pb-4 xl:pb-5">
      <div className="flex justify-center fixed left-0 top-12 py-3 w-full bg-lightBackground dark:bg-darkBackground z-10 px-4 md:px-0">
        <div className="flex gap-3 xl:px-0 w-full md:w-4/6 xl:w-3/6">
          <div className="w-full items-center border border-black dark:border-white overflow-hidden rounded-3xl flex h-14">
            <div className="flex items-center p-3">
              <Search className="" />
            </div>

            <input
              type="text"
              placeholder="Find clothings and items"
              className="pr-3 outline-none bg-transparent pl-0 w-full text-lg md:text-xl h-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <Link href={"/cart"}>
              <ShoppingCart />
            </Link>
            <button>
              <SlidersHorizontal />
            </button>
          </div>
        </div>
      </div>

      <section className="space-y-10">
        <CarouselWithSlideTracker items={Array.from({ length: 5 })}>
          <ShopCard />
        </CarouselWithSlideTracker>

        <section className="space-y-4 px-4 xl:px-5">
          <p className="text-3xl md:text-4xl">Categories</p>
          <div>
            <Carousel
              opts={{
                align: "start",
                dragFree: true,
              }}
              orientation={"horizontal"}
              className="w-full"
            >
              <CarouselContent className="h-14 md:pr-28 lg:pr-12 -ml-4 md:-ml-5">
                {Array.from({ length: 13 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-1/2 md:basis-1/4 lg:basis-1/6 xl:basis-[12.5%] pl-4 md:pl-5"
                  >
                    <button className="flex items-center w-full gap-3">
                      <div className="border flex items-center justify-center rounded-full w-14 h-14 text-brandLight dark:text-brandDark">
                        <Shirt />
                      </div>
                      <span className="text-xl">{"Shirts"}</span>
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-5 xl:left-6 disabled:hidden hidden xl:flex" />
              <CarouselNext className="right-5 xl:right-6 disabled:hidden hidden xl:flex" />
            </Carousel>
          </div>
        </section>

        <section className="space-y-4 px-4 md:px-5">
          <div className="flex items-center justify-between">
            <p className="text-3xl md:text-4xl">Latest drops</p>

            <Link href={"/news/latest"} className="text-xl">
              {" "}
              See More
            </Link>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className={`border w-full rounded-3xl h-72 ${
                  index > 7 ? "hidden lg:flex" : "flex"
                }`}
              ></div>
            ))}
          </div>
        </section>

        <section className="space-y-4 px-4 md:px-5">
          <p className="text-center text-3xl md:text-4xl">
            What&apos;s your style?
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

            <Link href={"/news/latest"} className="text-xl">
              {" "}
              See More
            </Link>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className={`border w-full rounded-3xl h-72 ${
                  index > 7 ? "hidden lg:flex" : "flex"
                }`}
              ></div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <p className="text-3xl md:text-4xl text-center">
            Our customer&apos;s favorites
          </p>
          <CarouselWithSlideTracker items={Array.from({ length: 5 })}>
            <ShopCard />
          </CarouselWithSlideTracker>
        </section>
      </section>
    </div>
  );
};

export default Shop;
