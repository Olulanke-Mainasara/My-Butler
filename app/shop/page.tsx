"use client";

import React, { Suspense } from "react";
import CarouselWithSlideTracker from "@/components/Custom-UI/Carousel/CarouselWithSlideTracker";
import CartDrawerTrigger from "@/components/Custom-UI/Buttons/CartDrawerTrigger";
import FilterDrawerTrigger from "@/components/Custom-UI/Buttons/FilterDrawerTrigger";
import { Product } from "@/types/Product";
import ProductCard from "@/components/Custom-UI/Cards/ProductCard";
import FullTextSearchInput from "@/components/Custom-UI/Buttons/Search";
import { Category } from "@/types/Category";
import { fetchCategories, fetchProducts } from "@/lib/DatabaseFetches";
import { Button } from "@/components/Shad-UI/button";
import { useRouter } from "next/navigation";

const Shop = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [filterResult, setFilterResult] = React.useState<Product[]>([]);
  const [searchResult, setSearchResult] = React.useState<Product[]>([]);
  const router = useRouter();
  const hasRendered = React.useRef(false);

  const handleFilterResult = (result: unknown[]) => {
    setFilterResult(result as Product[]);
  };

  const handleSearchResult = (result: unknown[]) => {
    setSearchResult(result as Product[]);
  };

  const fetchPageData = async () => {
    const [Products, categories] = await Promise.all([
      fetchProducts(),
      fetchCategories(),
    ]);

    setProducts(Products || []);
    setCategories(categories || []);
  };

  React.useEffect(() => {
    if (hasRendered.current) {
      return;
    }

    hasRendered.current = true;
    fetchPageData();
  }, []);

  return (
    <div className="mt-[141px] md:mt-[136px] xl:mt-36 pb-4 xl:pb-5">
      <div className="flex justify-center fixed left-0 top-12 py-3 w-full bg-lightBackground dark:bg-darkBackground z-10">
        <div className="flex gap-3 px-4 xl:px-0 w-full md:w-4/6 xl:w-3/6">
          <FullTextSearchInput
            table="products"
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
                  table="products"
                  handleFilterResult={handleFilterResult}
                />
              )}
            </Suspense>
          </div>
        </div>
      </div>

      {searchResult.length > 0 ? (
        <div className="space-y-4">
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
              <ProductCard item={result} key={result.id} />
            ))}
          </div>
        </div>
      ) : filterResult.length > 0 ? (
        <div className="pt-16 md:pt-28 space-y-4">
          <div className="px-4 xl:px-5">
            <p className="text-3xl md:text-4xl">Filtered Results</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 xl:gap-8 px-4 xl:px-5">
            {filterResult.map((result) => (
              <ProductCard item={result} key={result.id} />
            ))}
          </div>
        </div>
      ) : (
        <section className="space-y-10">
          <CarouselWithSlideTracker items={products}>
            <ProductCard />
          </CarouselWithSlideTracker>

          <section className="space-y-4 px-4 md:px-5">
            <p className="text-3xl md:text-4xl">Latest drops</p>

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-8">
              {products.map((product, index) => (
                <ProductCard item={product} key={index} />
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
            <p className="text-3xl md:text-4xl">Recommended</p>

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-8">
              {products.map((product, index) => (
                <ProductCard item={product} key={index} />
              ))}
            </div>
          </section>
        </section>
      )}
    </div>
  );
};

export default Shop;
