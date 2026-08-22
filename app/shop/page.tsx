"use client";

import CarouselWithSlideTracker from "@/components/Custom-UI/Carousel/CarouselWithSlideTracker";
import ProductCard from "@/components/Custom-UI/Cards/ProductCard";
import { getProducts } from "@/lib/fetches";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import Image from "next/image";

const Shop = () => {
  const { data: products } = useQuery(getProducts());

  return (
    <section className="space-y-10 mt-19 pb-5">
      <CarouselWithSlideTracker items={products?.slice(0, 10) ?? []}>
        <ProductCard />
      </CarouselWithSlideTracker>

      <section className="px-4 md:px-5 pt-5">
        {products?.length === 0 ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-8">
            {products?.slice(0, 32).map((product, index) => (
              <ProductCard item={product} key={index} />
            ))}
          </div>
        )}
      </section>

      <section className="py-14 px-4 md:px-5 relative flex flex-col gap-4 md:gap-8 items-center">
        <div className="w-full xl:w-1/2 text-center">
          <p className="text-2xl md:text-4xl">Unique brands</p>
          <p className="text-7xl xl:text-[120px] text-brandLight dark:text-brandDark">
            One Outfit
          </p>
        </div>

        <div className="w-full flex">
          <div className="h-44 md:h-60 rounded-xl relative object-cover object-top overflow-hidden w-full rotate-6">
            <Image
              src={"/Pages/Collections/collection.webp"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              alt="Group of people with different styles"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="h-44 md:h-60 rounded-xl relative object-cover object-top overflow-hidden w-full -rotate-6">
            <Image
              src={"/Pages/Collections/collection2.png"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              alt="Group of people with different styles"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="h-44 md:h-60 rounded-xl relative object-cover object-top overflow-hidden w-full rotate-6">
            <Image
              src={"/Pages/Collections/collection.webp"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              alt="Group of people with different styles"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="h-44 md:h-60 rounded-xl relative object-cover object-top overflow-hidden w-full -rotate-6">
            <Image
              src={"/Pages/Collections/collection2.png"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              alt="Group of people with different styles"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </section>

      <section className="px-4 md:px-5">
        {products?.length === 0 ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-8">
            {products?.slice(0, 32).map((product, index) => (
              <ProductCard item={product} key={index} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4 px-4 md:px-5">
        <p className="text-center text-3xl md:text-4xl">Style your wardrobe</p>
        <div className="grid md:grid-cols-3 gap-4 md:gap-5 mx-auto xl:w-full">
          <div className="border rounded-xl col-span-2 xl:col-span-1 xl:row-span-2 h-44 xl:h-auto"></div>
          <div className="border h-44 md:h-52 xl:h-60 rounded-xl"></div>
          <div className="border h-44 md:h-52 xl:h-60 rounded-xl col-start-2"></div>
          <div className="hidden md:block border rounded-xl row-start-1 col-start-3 row-span-2"></div>
        </div>
      </section>

      <section className="px-4 md:px-5">
        {products?.length === 0 ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-8">
            {products?.map((product, index) => (
              <ProductCard item={product} key={index} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
};

export default Shop;
