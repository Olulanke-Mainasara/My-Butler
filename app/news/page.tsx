"use client";
import CarouselWithSlideTracker from "@/components/Custom-UI/Carousel/CarouselWithSlideTracker";
import ArticleCard from "@/components/Custom-UI/Cards/ArticleCard";
import { getArticles } from "@/lib/fetches";
import Image from "next/image";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Link } from "next-view-transitions";
import { ArrowRight, CalendarDays } from "lucide-react";
import { buildItemSlugId, convertRawDateToReadableDate } from "@/lib/utils";

const News = () => {
  const { data: articles } = useQuery(getArticles());

  // Feature the newest article up top, then keep it out of the carousel/grid
  // directly below so the same headline doesn't repeat immediately.
  const [featured, ...rest] = articles ?? [];

  return (
    <main className="mt-19 pb-5">
      <section className="px-4 md:px-5">
        {featured ? (
          <Link
            href={`/news/${buildItemSlugId(featured.slug, featured.id)}`}
            prefetch={false}
            className="group relative block w-full h-96 md:h-128 xl:h-144 rounded-2xl overflow-hidden"
          >
            <Image
              src={featured.display_image ?? "/placeholder.svg"}
              alt={featured.title}
              fill
              sizes="100vw"
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 xl:p-14 max-w-3xl flex flex-col gap-3 text-white">
              <span className="w-fit text-xs font-medium uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm">
                Featured Story
              </span>
              <h1 className="text-3xl md:text-5xl xl:text-6xl font-semibold leading-tight">
                {featured.title}
              </h1>
              {featured.created_at && (
                <p className="flex items-center gap-1.5 text-sm md:text-base opacity-85">
                  <CalendarDays size={16} />
                  {convertRawDateToReadableDate(featured.created_at)}
                </p>
              )}
              <span className="inline-flex items-center gap-1.5 mt-1 text-sm md:text-base font-medium group-hover:gap-2.5 transition-all duration-300">
                Read the story
                <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        ) : (
          <div className="relative w-full max-w-(--breakpoint-lg) xl:max-w-full mx-auto">
            <div className="py-5 px-4 rounded-xl bg-lightBackground dark:bg-darkBackground text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-3/4 md:w-3/5 lg:w-2/4 xl:w-2/5 h-2/4 flex flex-col items-center justify-center">
              <p className="text-xl md:text-2xl lg:text-3xl">
                Fashion is a{" "}
                <span className="text-brandLight dark:text-brandDark">
                  story.
                </span>
              </p>
              <p className="text-4xl md:text-6xl lg:text-7xl">
                We&apos;re telling it{" "}
                <span className="text-brandLight dark:text-brandDark">
                  your
                </span>{" "}
                way.
              </p>
            </div>
            <div className="h-75 md:h-128 rounded-xl relative object-cover object-top overflow-hidden">
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
        )}
      </section>

      <section className="space-y-10 xl:pt-10">
        <CarouselWithSlideTracker items={rest}>
          <ArticleCard />
        </CarouselWithSlideTracker>
        <section className="space-y-4 px-4 md:px-5 pt-5">
          <div className="flex items-center justify-between">
            <p className="text-3xl md:text-4xl">Latest</p>
          </div>
          {articles === undefined ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
              {rest.map((article, index) => (
                <ArticleCard key={index} item={article} />
              ))}
            </div>
          )}
        </section>
        <section className="space-y-4 px-4 md:px-5">
          <p className="text-center text-3xl md:text-4xl">The Fit Files</p>
          <div className="grid md:grid-cols-3 gap-4 md:gap-5 mx-auto xl:w-full">
            <div className="border rounded-xl col-span-2 xl:col-span-1 xl:row-span-2 h-44 xl:h-auto"></div>
            <div className="border h-44 md:h-52 xl:h-60 rounded-xl"></div>
            <div className="border h-44 md:h-52 xl:h-60 rounded-xl col-start-2"></div>
            <div className="hidden md:block border rounded-xl row-start-1 col-start-3 row-span-2"></div>
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
    </main>
  );
};
export default News;
