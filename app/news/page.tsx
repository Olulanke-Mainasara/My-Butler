"use client";

import React from "react";
import CarouselWithSlideTracker from "@/components/Custom-UI/Carousel/CarouselWithSlideTracker";
import ArticleCard from "@/components/Custom-UI/Cards/ArticleCard";
import { Article } from "@/types/Article";
import { getArticles } from "@/lib/fetches";
import FullTextSearchInput from "@/components/Custom-UI/Buttons/Search";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Shad-UI/button";
import Image from "next/image";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

const News = () => {
  const [searchResult, setSearchResult] = React.useState<Article[]>([]);
  const router = useRouter();

  const { data: articles } = useQuery(getArticles());

  const handleSearchResult = (result: unknown[]) => {
    setSearchResult(result as Article[]);
  };

  return (
    <div className="mt-[76px] md:mt-6 pb-5 space-y-7 xl:space-y-0">
      <div className="flex justify-center fixed left-0 top-12 py-3 w-full bg-lightBackground dark:bg-darkBackground z-20">
        <div className="px-4 xl:px-0 w-full md:w-4/6 xl:w-3/6 mx">
          <FullTextSearchInput
            table="news"
            column="title"
            handleSearchResult={handleSearchResult}
          />
        </div>
      </div>

      {searchResult.length > 0 ? (
        <div className=" space-y-4 pt-16 md:pt-28">
          <div className="px-4 xl:px-5 flex items-center gap-4">
            <p className="text-3xl md:text-4xl">Search Results</p>
            <Button
              variant={"outline"}
              onClick={() => {
                router.push("?");
                handleSearchResult([]);
              }}
            >
              Clear
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-8 px-4 xl:px-5">
            {searchResult.map((result) => (
              <ArticleCard item={result} key={result.id} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <section className="pt-16 md:pt-28 xl:pt-[120px] px-4 md:px-5 flex flex-col gap-4 xl:flex-row xl:gap-8 items-center">
            <div className="relative w-full max-w-screen-lg xl:max-w-full mx-auto">
              <div className="py-5 px-4 rounded-2xl bg-lightBackground dark:bg-darkBackground text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-3/4 md:w-3/5 lg:w-2/4 xl:w-2/5 h-2/4 flex flex-col items-center justify-center">
                <p className="text-xl md:text-2xl lg:text-3xl">
                  Fashion is a{" "}
                  <span className="text-brandLight dark:text-brandDark">
                    story.
                  </span>
                </p>
                <p className="text-4xl md:text-6xl lg:text-7xl">
                  We&apos;re telling it{" "}
                  <span className=" text-brandLight dark:text-brandDark">
                    your
                  </span>{" "}
                  way.
                </p>
              </div>

              <div className="h-[300px] md:h-[512px] rounded-2xl relative object-cover object-top overflow-hidden">
                <Image
                  src={"/Pages/Collections/collection.webp"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  alt="Group of people with different styles"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </section>

          <section className="space-y-10 xl:pt-10">
            <CarouselWithSlideTracker items={articles ?? []}>
              <ArticleCard />
            </CarouselWithSlideTracker>

            <section className="space-y-4 px-4 md:px-5 pt-5">
              <div className="flex items-center justify-between">
                <p className="text-3xl md:text-4xl">Latest</p>
              </div>

              {articles?.length === 0 ? (
                <LoadingSkeleton />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
                  {articles?.map((article, index) => (
                    <ArticleCard key={index} item={article} />
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-4 px-4 md:px-5">
              <p className="text-center text-3xl md:text-4xl">The Fit Files</p>
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
              </div>

              {articles?.length === 0 ? (
                <LoadingSkeleton />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
                  {articles?.map((article, index) => (
                    <ArticleCard key={index} item={article} />
                  ))}
                </div>
              )}
            </section>
          </section>
        </>
      )}
    </div>
  );
};

export default News;
