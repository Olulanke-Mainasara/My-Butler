"use client";

import React from "react";
import { Search } from "lucide-react";
import { Link } from "next-view-transitions";
import CarouselWithSlideTracker from "@/components/Shared/UI/Carousel/CarouselWithSlideTracker";
import NewsCard from "@/components/Shared/UI/Cards/NewsCard";

const News = () => {
  return (
    <div className="mt-[141px] md:mt-[136px] xl:mt-36 pb-4 xl:pb-5">
      <div className="justify-center fixed left-0 top-12 py-3 w-full bg-lightBackground dark:bg-darkBackground z-10 px-4 md:px-0">
        <div className="w-full items-center border border-black dark:border-white overflow-hidden rounded-3xl flex h-14 md:w-4/6 md:mx-auto xl:w-3/6">
          <div className="flex items-center p-3">
            <Search className="" />
          </div>

          <input
            type="text"
            placeholder="Find news and trends"
            className="pr-3 outline-none bg-transparent pl-0 w-full text-lg md:text-xl h-full"
          />
        </div>
      </div>

      <section className="space-y-10">
        <CarouselWithSlideTracker items={Array.from({ length: 5 })}>
          <NewsCard trending />
        </CarouselWithSlideTracker>

        <section className="space-y-4 px-4 md:px-5">
          <div className="flex items-center justify-between">
            <p className="text-3xl md:text-4xl">Latest</p>

            <Link href={"/news/latest"} className="text-xl">
              {" "}
              See More
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={`${
                  index === 4 || index === 5 ? "hidden lg:flex" : "flex"
                } gap-5 h-36`}
              >
                <div className="border w-full basis-2/5 rounded-xl"></div>
                <div className="border w-full basis-3/5"></div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 px-4 md:px-5">
          <p className="text-center text-3xl md:text-4xl">
            What&apos;s the tea?
          </p>
          <div className="grid md:grid-cols-3 gap-4 md:gap-5 xl:gap-8 mx-auto xl:w-full">
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={`${
                  index > 3 ? "hidden lg:flex" : "flex"
                } gap-5 h-36`}
              >
                <div className="border w-full basis-2/5 rounded-xl"></div>
                <div className="border w-full basis-3/5"></div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <p className="text-3xl md:text-4xl text-center">
            Our reader&apos;s favorites
          </p>
          <CarouselWithSlideTracker items={Array.from({ length: 5 })}>
            <NewsCard trending={false} />
          </CarouselWithSlideTracker>
        </section>
      </section>
    </div>
  );
};

export default News;
