"use client";

import React, { Suspense } from "react";

import NormalCarousel from "@/components/Custom-UI/Carousel/NormalCarousel";
import CarouselWithSubCarousel from "@/components/Custom-UI/Carousel/CarouselWithSubCarousel";
import CarouselWithSlideTracker from "@/components/Custom-UI/Carousel/CarouselWithSlideTracker";
import CartDrawerTrigger from "@/components/Custom-UI/Buttons/CartDrawerTrigger";
import FilterDrawerTrigger from "@/components/Custom-UI/Buttons/FilterDrawerTrigger";
import CollectionCard from "@/components/Custom-UI/Cards/CollectionCard";
import { Collection } from "@/types/Collection";
import { Brand } from "@/types/Brand";
import { Category } from "@/types/Category";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  fetchCollections,
  fetchBrands,
  fetchCategories,
} from "@/lib/DatabaseFetches";
import FullTextSearchInput from "@/components/Custom-UI/Buttons/Search";
import { Button } from "@/components/Shad-UI/button";

const Collections = () => {
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [filterResult, setFilterResult] = React.useState<Collection[]>([]);
  const [searchResult, setSearchResult] = React.useState<Collection[]>([]);
  const router = useRouter();
  const hasRendered = React.useRef(false);

  const handleFilterResult = (result: unknown[]) => {
    setFilterResult(result as Collection[]);
  };

  const handleSearchResult = (result: unknown[]) => {
    setSearchResult(result as Collection[]);
  };

  const fetchPageData = async () => {
    const [Collections, Brands, Categories] = await Promise.all([
      fetchCollections(),
      fetchBrands(),
      fetchCategories(),
    ]);

    setCollections(Collections || []);
    setBrands(Brands || []);
    setCategories(Categories || []);
  };

  React.useEffect(() => {
    if (hasRendered.current) {
      return;
    }

    hasRendered.current = true;
    fetchPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-[76px] md:mt-6 pb-5 xl:pb-5 space-y-7 xl:space-y-0">
      <div className="flex flex-col md:flex-row xl:items-center gap-4 py-3 justify-center fixed top-12 left-0 w-full bg-lightBackground dark:bg-darkBackground z-10">
        <div className="flex gap-3 px-4 xl:px-0 md:w-4/6 xl:w-3/6">
          <FullTextSearchInput
            table="collections"
            column="name"
            handleSearchResult={handleSearchResult}
          />
          <div className="flex items-center gap-4">
            <CartDrawerTrigger />
            <Suspense>
              {searchResult.length > 0 ? null : (
                <FilterDrawerTrigger
                  optionCollection={{
                    category: categories,
                  }}
                  table="collections"
                  handleFilterResult={handleFilterResult}
                />
              )}
            </Suspense>
          </div>
        </div>
      </div>

      {searchResult.length > 0 ? (
        <div className="pt-16 md:pt-28 space-y-4">
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
          <div className="grid md:grid-cols-3 xl:grid-cols-5 gap-4 xl:gap-8 px-4 xl:px-5">
            {searchResult.map((result) => (
              <CollectionCard item={result} key={result.id} />
            ))}
          </div>
        </div>
      ) : filterResult.length > 0 ? (
        <div className="pt-16 md:pt-28 space-y-4">
          <div className="px-4 xl:px-5">
            <p className="text-3xl md:text-4xl">Filtered Results</p>
          </div>
          <div className="grid md:grid-cols-3 xl:grid-cols-5 gap-4 xl:gap-8 px-4 xl:px-5">
            {filterResult.map((result) => (
              <CollectionCard item={result} key={result.id} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <section className="xl:mx-auto xl:w-4/5 pt-16 md:pt-[113px] xl:pt-[120px] px-4 xl:px-0 relative grid grid-cols-2 gap-2 xl:gap-8 items-center ">
            <div className="h-44 md:h-60 rounded-3xl relative object-cover object-top overflow-hidden">
              <Image
                src={"/Pages/Collections/collection.webp"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                alt="Group of people with different styles"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <p className="text-4xl md:text-6xl xl:text-8xl p-2">
              Different{" "}
              <span className="text-brandLight dark:text-brandDark">
                styles
              </span>
            </p>
            <p className="text-4xl md:text-6xl xl:text-8xl text-right p-2">
              Different{" "}
              <span className="text-brandLight dark:text-brandDark">
                stories
              </span>
            </p>
            <div className="h-44 md:h-60 rounded-3xl relative object-cover object-top overflow-hidden">
              <Image
                src={"/Pages/Collections/collection2.png"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                alt="Group of people with different styles"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </section>
          <section className="space-y-10">
            <CarouselWithSlideTracker items={collections} className="xl:mt-10">
              <CollectionCard />
            </CarouselWithSlideTracker>

            <section className="space-y-4 px-4 xl:px-5 pt-5">
              <p className="text-3xl md:text-4xl">New &amp; Hot arrivals</p>
              <NormalCarousel items={collections}>
                <CollectionCard />
              </NormalCarousel>
            </section>

            <section className="space-y-4 px-4 xl:px-5">
              <p className="text-3xl md:text-4xl">Recommended for you</p>
              <CarouselWithSubCarousel
                items={collections}
                subItems={categories}
              >
                <CollectionCard />
              </CarouselWithSubCarousel>
            </section>

            <section className="space-y-4  px-4 xl:px-5">
              <p className="text-center text-3xl md:text-4xl">
                Everyone gets something
              </p>
              <div className="grid md:grid-cols-3 gap-4 xl:gap-8 mx-auto xl:w-full">
                <div className="rounded-3xl row-span-2 relative overflow-hidden">
                  <Image
                    src={"/Pages/Collections/collection3.jpeg"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt="Group of people with different styles"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="h-44 md:h-52 xl:h-60 rounded-3xl relative overflow-hidden">
                  <Image
                    src={"/Pages/Collections/collection4.webp"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt="Group of people with different styles"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="h-44 md:h-52 xl:h-60 rounded-3xl col-start-2 relative overflow-hidden">
                  <Image
                    src={"/Pages/Collections/collection5.webp"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt="Group of people with different styles"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="hidden md:block rounded-3xl row-start-1 col-start-3 row-span-2 relative overflow-hidden">
                  <Image
                    src={"/Pages/Collections/collection6.jpg"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt="Group of people with different styles"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4 px-4 xl:px-5">
              <p className="text-3xl md:text-4xl">Trendy &amp; Featured</p>
              <NormalCarousel items={collections}>
                <CollectionCard />
              </NormalCarousel>
            </section>

            <section className="space-y-4 px-4 xl:px-5">
              <p className="text-3xl md:text-4xl">Brands and Collections</p>
              <CarouselWithSubCarousel items={collections} subItems={brands}>
                <CollectionCard />
              </CarouselWithSubCarousel>
            </section>
          </section>
        </>
      )}
    </div>
  );
};

export default Collections;
