"use client";

import React from "react";

import { Search } from "lucide-react";
import NormalCarousel from "@/components/Shared/UI/Carousel/NormalCarousel";
import CarouselWithSubCarousel from "@/components/Shared/UI/Carousel/CarouselWithSubCarousel";
import CarouselWithSlideTracker from "@/components/Shared/UI/Carousel/CarouselWithSlideTracker";
import OutfitCard from "@/components/Shared/UI/Cards/OutfitCard";
import CartDrawerTrigger from "@/components/Shared/UI/Buttons/CartDrawerTrigger";
import FilterDrawerTrigger from "@/components/Shared/UI/Buttons/FilterDrawerTrigger";

const Outfits = () => {
  return (
    <div className="mt-[76px] md:mt-6 pb-5 xl:pb-5 space-y-7 md:space-y-0">
      <div className="flex flex-col md:flex-row xl:items-center gap-4 py-3 justify-center fixed top-12 left-0 w-full bg-lightBackground dark:bg-darkBackground z-10">
        <div className="flex gap-3 px-4 xl:px-0 md:w-4/6 xl:w-3/6">
          <div className="w-full items-center border border-black dark:border-white overflow-hidden rounded-3xl flex h-14">
            <div className="flex items-center p-3">
              <Search className="" />
            </div>

            <input
              type="text"
              placeholder="Search outfits"
              className="pr-3 outline-none bg-transparent pl-0 w-full text-lg md:text-xl h-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <CartDrawerTrigger />
            <FilterDrawerTrigger />
          </div>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-2 xl:gap-8 items-center xl:mx-auto xl:w-4/5 pt-16 md:pt-[113px] xl:pt-[120px] px-4 xl:px-0">
        <div className="border h-44 md:h-60 rounded-3xl"></div>
        <p className="text-4xl md:text-6xl xl:text-8xl p-2">
          Different{" "}
          <span className="text-brandLight dark:text-brandDark">styles</span>
        </p>
        <p className="text-4xl md:text-6xl xl:text-8xl text-right p-2">
          Different{" "}
          <span className="text-brandLight dark:text-brandDark">stories</span>
        </p>
        <div className="border h-44 md:h-60 rounded-3xl"></div>
      </section>

      <section className="space-y-10">
        <CarouselWithSlideTracker
          items={Array.from({ length: 5 })}
          className="xl:hidden"
        >
          <OutfitCard />
        </CarouselWithSlideTracker>

        <section className="space-y-4 px-4 xl:px-5">
          <p className="text-3xl md:text-4xl">New &amp; Hot arrivals</p>
          <NormalCarousel items={Array.from({ length: 5 })} />
        </section>

        <section className="space-y-4 px-4 xl:px-5">
          <p className="text-3xl md:text-4xl">Recommended for you</p>
          <CarouselWithSubCarousel items={Array.from({ length: 5 })} />
        </section>

        <section className="space-y-4  px-4 xl:px-5">
          <p className="text-center text-3xl md:text-4xl">
            Everyone gets something
          </p>
          <div className="grid md:grid-cols-3 gap-4 xl:gap-8 mx-auto xl:w-full">
            <div className="border rounded-3xl row-span-2"></div>
            <div className="border h-44 md:h-52 xl:h-60 rounded-3xl"></div>
            <div className="border h-44 md:h-52 xl:h-60 rounded-3xl col-start-2"></div>
            <div className="hidden md:block border rounded-3xl row-start-1 col-start-3 row-span-2"></div>
          </div>
        </section>

        <section className="space-y-4 px-4 xl:px-5">
          <p className="text-3xl md:text-4xl">Trendy &amp; Featured</p>
          <NormalCarousel items={Array.from({ length: 5 })} />
        </section>

        <section className="space-y-4 px-4 xl:px-5">
          <p className="text-3xl md:text-4xl">Brands and line-ups</p>
          <CarouselWithSubCarousel items={Array.from({ length: 5 })} />
        </section>

        <section className="space-y-5">
          <p className="text-3xl md:text-4xl text-center">
            Our customer&apos;s favorites
          </p>
          <CarouselWithSlideTracker items={Array.from({ length: 5 })}>
            <OutfitCard />
          </CarouselWithSlideTracker>
        </section>
      </section>
    </div>
  );
};

export default Outfits;
