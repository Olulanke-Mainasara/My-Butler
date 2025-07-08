"use client";

import FullTextSearchInput from "@/components/Custom-UI/Buttons/Search";
import BrandCard from "@/components/Custom-UI/Cards/BrandCard";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { Brand } from "@/types/Brand";
import { Factory } from "lucide-react";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Shad-UI/button";
import { fetchBrands } from "@/lib/DatabaseFetches";

const Brands = () => {
  const [brands, setBrands] = React.useState<Brand[] | null>();
  const [searchResult, setSearchResult] = React.useState<Brand[]>([]);
  const router = useRouter();

  const handleSearchResult = (result: unknown[]) => {
    setSearchResult(result as Brand[]);
  };

  useEffect(() => {
    const onPageLoad = async () => {
      const brands = await fetchBrands();
      setBrands(Array.isArray(brands) ? brands : []);
    };
    onPageLoad();
  }, []);

  return (
    <div className="pt-16 md:pt-14 flex flex-col h-full gap-4 md:gap-5">
      <div className="flex flex-col md:flex-row gap-2 items-center w-full md:w-3/5 xl:w-2/5 mx-auto px-4">
        <h1 className="px-3 text-4xl">Brands</h1>
        <FullTextSearchInput
          table="brands"
          column="name"
          handleSearchResult={handleSearchResult}
        />
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
          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
            {searchResult.map((brand) => (
              <BrandCard key={brand.id} item={brand} />
            ))}
          </section>
        </div>
      ) : (
        <section className="px-4 md:px-5 h-full">
          {!brands ? (
            <LoadingSkeleton
              length={5}
              className="grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5"
            />
          ) : (
            <section className="pb-4 h-full overflow-y-scroll">
              {brands.length === 0 ? (
                <div className="text-center py-20 border rounded-lg text-xl flex justify-center items-center gap-2">
                  <span className="text-brandLight dark:text-brandDark">
                    <Factory />
                  </span>
                  <p>No brands found.</p>
                </div>
              ) : (
                <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {brands.map((brand) => (
                    <BrandCard key={brand.id} item={brand} />
                  ))}
                </section>
              )}
            </section>
          )}
        </section>
      )}
    </div>
  );
};

export default Brands;
