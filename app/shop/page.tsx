"use client";

import CarouselWithSlideTracker from "@/components/Custom-UI/Carousel/CarouselWithSlideTracker";
import ProductCard from "@/components/Custom-UI/Cards/ProductCard";
import { getProducts } from "@/lib/fetches";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { ArrowRight, Star, Truck } from "lucide-react";
import { buildItemSlugId } from "@/lib/utils";

const Shop = () => {
  const { data: products } = useQuery(getProducts());

  // Lead with one featured product, then keep it out of the carousel and
  // the grid directly beneath it so it isn't shown twice in a row.
  const [featured, ...rest] = products ?? [];
  const gallery = featured?.product_images?.slice(1, 4) ?? [];
  const lowStock =
    featured?.stock_quantity !== undefined &&
    featured.stock_quantity > 0 &&
    featured.stock_quantity <= 10;

  return (
    <section className="space-y-10 mt-19 pb-5">
      <div className="px-4 md:px-5">
        {featured ? (
          <Link
            href={`/shop/${buildItemSlugId(featured.slug, featured.id)}`}
            prefetch={false}
            className="group relative block w-full h-96 md:h-128 xl:h-144 rounded-2xl overflow-hidden"
          >
            <Image
              src={featured.product_images?.[0] ?? "/placeholder.svg"}
              alt={featured.name}
              fill
              sizes="100vw"
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />

            {gallery.length > 0 && (
              <div className="absolute top-4 right-4 md:top-6 md:right-6 hidden sm:flex">
                {gallery.map((src, i) => (
                  <div
                    key={i}
                    style={{ marginLeft: i === 0 ? 0 : "-1.25rem" }}
                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 border-white/90 shadow-lg ${
                      i % 2 === 0 ? "rotate-3" : "-rotate-3"
                    }`}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 xl:p-14 max-w-2xl flex flex-col gap-3 text-white">
              <span className="w-fit text-xs font-medium uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm">
                Featured Product
              </span>
              <h1 className="text-3xl md:text-5xl xl:text-6xl font-semibold leading-tight">
                {featured.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm md:text-base opacity-90">
                <span className="text-lg md:text-xl font-semibold text-white">
                  ₦
                  {featured.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
                {featured.rating != null && (
                  <span className="flex items-center gap-1">
                    <Star size={16} className="fill-current" />
                    {featured.rating.toFixed(1)}
                    {featured.reviews_count != null && (
                      <span className="opacity-75">
                        ({featured.reviews_count})
                      </span>
                    )}
                  </span>
                )}
                {featured.free_shipping && (
                  <span className="flex items-center gap-1.5">
                    <Truck size={16} />
                    Free shipping
                  </span>
                )}
                {lowStock && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/90 text-xs font-medium">
                    Only {featured.stock_quantity} left
                  </span>
                )}
              </div>

              <span className="inline-flex items-center gap-1.5 mt-1 text-sm md:text-base font-medium group-hover:gap-2.5 transition-all duration-300">
                Shop this piece
                <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        ) : (
          <div className="w-full h-96 md:h-128 xl:h-144 rounded-2xl bg-darkBackground/5 dark:bg-lightBackground/5 animate-pulse" />
        )}
      </div>

      <CarouselWithSlideTracker items={rest.slice(0, 10)}>
        <ProductCard />
      </CarouselWithSlideTracker>

      <section className="px-4 md:px-5 pt-5">
        {products === undefined ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-8">
            {rest.slice(0, 32).map((product, index) => (
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
