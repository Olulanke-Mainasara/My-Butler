"use client";

import CollectionCard from "@/components/Custom-UI/Cards/CollectionCard";
import Image from "next/image";
import { getCollections } from "@/lib/fetches";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { Link } from "next-view-transitions";
import { ArrowRight } from "lucide-react";
import { buildItemSlugId } from "@/lib/utils";

const Collections = () => {
  const { data: collections } = useQuery(getCollections());

  // Lead with one featured collection, then keep it out of the grid
  // directly beneath it so it isn't shown twice in a row.
  const [featured, ...rest] = collections ?? [];

  return (
    <main className="space-y-10 mt-19 pb-5">
      <section className="px-4 md:px-5">
        {featured ? (
          <Link
            href={`/collections/${buildItemSlugId(featured.slug, featured.id)}`}
            prefetch={false}
            className="group relative block w-full h-96 md:h-128 xl:h-144 rounded-2xl overflow-hidden"
          >
            <Image
              src={featured.display_image ?? "/placeholder.svg"}
              alt={featured.name}
              fill
              sizes="100vw"
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 xl:p-14 max-w-xl flex flex-col gap-3 text-white">
              <span className="w-fit text-xs font-medium uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm">
                Featured Collection
              </span>
              <h1 className="text-3xl md:text-5xl xl:text-6xl font-semibold leading-tight">
                {featured.name}
              </h1>
              {featured.description && (
                <p className="text-sm md:text-base opacity-85 line-clamp-2">
                  {featured.description}
                </p>
              )}
              <span className="inline-flex items-center gap-1.5 mt-1 text-sm md:text-base font-medium group-hover:gap-2.5 transition-all duration-300">
                Explore the collection
                <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        ) : (
          <div className="w-full h-96 md:h-128 xl:h-144 rounded-2xl bg-darkBackground/5 dark:bg-lightBackground/5 animate-pulse" />
        )}
      </section>

      <section className="px-4 md:px-5">
        {collections === undefined ? (
          <LoadingSkeleton length={4} height="md:h-96" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 xl:gap-8">
            {rest.slice(0, 12).map((collection, index) => (
              <CollectionCard item={collection} key={index} />
            ))}
          </div>
        )}
      </section>

      <section className="lg:mx-auto xl:w-4/5 lg:max-w-3xl xl:max-w-full py-14 px-4 xl:px-0 relative grid grid-cols-2 gap-2 lg:gap-5 xl:gap-8 items-center">
        <div className="h-44 md:h-60 rounded-xl relative object-cover object-top overflow-hidden">
          <Image
            src={"/Pages/Collections/collection.webp"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            alt="Group of people with different styles"
            className="w-full h-full object-cover object-top"
          />
        </div>
        <p className="text-5xl md:text-6xl xl:text-8xl p-2">
          Different{" "}
          <span className="text-brandLight dark:text-brandDark">styles</span>
        </p>
        <p className="text-5xl md:text-6xl xl:text-8xl text-right p-2">
          Different{" "}
          <span className="text-brandLight dark:text-brandDark">stories</span>
        </p>
        <div className="h-44 md:h-60 rounded-xl relative object-cover object-top overflow-hidden">
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

      <section className="px-4 md:px-5 pt-5">
        {collections?.length === 0 ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 xl:gap-8">
            {collections?.slice(0, 12).map((collection, index) => (
              <CollectionCard item={collection} key={index} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4 pb-14 px-4 xl:px-5">
        <p className="text-center text-3xl md:text-4xl">
          Everyone gets something
        </p>
        <div className="grid md:grid-cols-3 gap-4 md:gap-5 mx-auto xl:w-full">
          <div className="rounded-xl row-span-2 relative overflow-hidden">
            <Image
              src={"/Pages/Collections/collection3.jpeg"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt="Group of people with different styles"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="h-44 md:h-52 xl:h-60 rounded-xl relative overflow-hidden">
            <Image
              src={"/Pages/Collections/collection4.webp"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt="Group of people with different styles"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="h-44 md:h-52 xl:h-60 rounded-xl col-start-2 relative overflow-hidden">
            <Image
              src={"/Pages/Collections/collection5.webp"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt="Group of people with different styles"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="hidden md:block rounded-xl row-start-1 col-start-3 row-span-2 relative overflow-hidden">
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

      <section className="px-4 md:px-5">
        {collections?.length === 0 ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 xl:gap-8">
            {collections?.slice(0, 12).map((collection, index) => (
              <CollectionCard item={collection} key={index} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Collections;
