"use client";

import React, { useCallback } from "react";
import CarouselWithSlideTracker from "@/components/Custom-UI/Carousel/CarouselWithSlideTracker";
import ArticleCard from "@/components/Custom-UI/Cards/ArticleCard";
import { Article } from "@/types/Article";
import { fetchArticles } from "@/lib/DatabaseFetches";
import FullTextSearchInput from "@/components/Custom-UI/Buttons/Search";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Shad-UI/button";

const News = () => {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [searchResult, setSearchResult] = React.useState<Article[]>([]);
  const router = useRouter();
  const hasRendered = React.useRef(false);

  const handleSearchResult = (result: unknown[]) => {
    setSearchResult(result as Article[]);
  };

  const fetchPageData = useCallback(async () => {
    const [Articles] = await Promise.all([fetchArticles()]);

    setArticles(Articles || []);
  }, []);

  React.useEffect(() => {
    if (hasRendered.current) {
      return;
    }

    hasRendered.current = true;
    fetchPageData();
  }, [fetchPageData]);

  return (
    <div className="mt-[141px] md:mt-[136px] xl:mt-36 pb-4 xl:pb-5">
      <div className="flex justify-center fixed left-0 top-12 py-3 w-full bg-lightBackground dark:bg-darkBackground z-10">
        <div className="px-4 xl:px-0 w-full md:w-4/6 xl:w-3/6 mx">
          <FullTextSearchInput
            table="news"
            column="title"
            handleSearchResult={handleSearchResult}
          />
        </div>
      </div>

      {searchResult.length > 0 ? (
        <div className=" space-y-4">
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
        <section className="space-y-10">
          <CarouselWithSlideTracker items={articles}>
            <ArticleCard />
          </CarouselWithSlideTracker>

          <section className="space-y-4 px-4 md:px-5">
            <div className="flex items-center justify-between">
              <p className="text-3xl md:text-4xl">Latest</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
              {articles.map((article, index) => (
                <ArticleCard key={index} item={article} />
              ))}
            </div>
          </section>

          <section className="space-y-4 px-4 md:px-5">
            <p className="text-center text-3xl md:text-4xl">
              What&apos;s the tea?
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
              {articles.map((article, index) => (
                <ArticleCard key={index} item={article} />
              ))}
            </div>
          </section>
        </section>
      )}
    </div>
  );
};

export default News;
