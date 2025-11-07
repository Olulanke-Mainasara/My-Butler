"use client";

import ArticleCard from "@/components/Custom-UI/Cards/ArticleCard";
import CollectionCard from "@/components/Custom-UI/Cards/CollectionCard";
import EventCard from "@/components/Custom-UI/Cards/EventCard";
import ProductCard from "@/components/Custom-UI/Cards/ProductCard";
import NormalCarousel from "@/components/Custom-UI/Carousel/NormalCarousel";
import BrandLoadingSkeleton from "@/components/Custom-UI/Skeletons/BrandLoadingSkeleton";
import {
  fetchArticles,
  fetchBrands,
  fetchCollections,
  fetchEvents,
  fetchProducts,
} from "@/lib/DatabaseFetches";
import { normalizeAndFormatPhoneNumber } from "@/lib/utils";
import { Article } from "@/types/Article";
import { Brand as BrandType } from "@/types/Brand";
import { Collection } from "@/types/Collection";
import { Event } from "@/types/Event";
import { Product } from "@/types/Product";
import { User } from "lucide-react";
import { useTransitionRouter } from "next-view-transitions";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Brand = () => {
  const [brand, setBrand] = useState<BrandType | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const pathname = usePathname();
  const brandId = pathname.split("/").pop() || "";
  const router = useTransitionRouter();

  useEffect(() => {
    if (!brandId) {
      toast.error("Brand ID is missing in the URL.");
      router.push("/brands");
      return;
    }

    const fetchPageData = async () => {
      const [brands, products, collections, articles, events] =
        await Promise.all([
          fetchBrands({ filters: { id: brandId ?? "" } }),
          fetchProducts({
            filters: { brand_id: brandId ?? "" },
          }),
          fetchCollections({
            filters: { brand_id: brandId ?? "" },
          }),
          fetchArticles({
            filters: { brand_id: brandId ?? "" },
          }),
          fetchEvents({
            filters: { brand_id: brandId ?? "" },
          }),
        ]);

      setBrand(Array.isArray(brands) && brands.length > 0 ? brands[0] : null);
      setProducts(Array.isArray(products) ? products : []);
      setCollections(Array.isArray(collections) ? collections : []);
      setArticles(Array.isArray(articles) ? articles : []);
      setEvents(Array.isArray(events) ? events : []);
    };

    fetchPageData();
  }, [brandId, router]);

  return (
    <div className="px-3 pt-16 pb-4 xl:pb-5 lg:h-screen lg:overflow-y-scroll flex flex-col gap-4">
      {!brand ? (
        <BrandLoadingSkeleton />
      ) : (
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-6">
          <div className="flex items-center gap-2 xl:pr-6">
            {brand?.profile_picture ? (
              <Image
                src={brand.profile_picture}
                className="w-14 h-14 aspect-square rounded-full object-cover"
                alt="Profile picture"
                width={40}
                height={30}
                quality={75}
              />
            ) : (
              <span className="p-2 rounded-full bg-darkBackground text-white dark:bg-lightBackground dark:text-black">
                <User size={40} />
              </span>
            )}
            <div className="space-y-0.5">
              <h2 className="text-3xl md:text-4xl">{brand?.name}</h2>
              <p className="opacity-70">{brand?.email}</p>
            </div>
          </div>
          <div className="md:flex flex-wrap">
            <div className="p-2 xl:px-4 border-l border-l-neutral-500">
              <p>{brand?.description}</p>
            </div>
            <div className="p-2 xl:px-4 border-l border-l-neutral-500 hidden md:block">
              <Link href={brand?.url || ""} prefetch={false} target="_blank">
                {brand?.url}
              </Link>
            </div>
            <div className="p-2 xl:px-4 border-l border-l-neutral-500 hidden md:block">
              <p>{brand?.location}</p>
            </div>
            <div className="p-2 xl:px-4 border-l border-l-neutral-500 hidden md:block">
              <p>{normalizeAndFormatPhoneNumber(brand?.contact)}</p>
            </div>
          </div>
        </div>
      )}

      <hr />

      <div className="h-full overflow-y-scroll w-full space-y-10">
        <section className="space-y-4">
          <p className="text-3xl md:text-4xl">Products</p>
          <NormalCarousel items={products}>
            <ProductCard />
          </NormalCarousel>
        </section>

        <section className="space-y-4">
          <p className="text-3xl md:text-4xl">Collections</p>
          <NormalCarousel items={collections}>
            <CollectionCard />
          </NormalCarousel>
        </section>

        <section className="space-y-4">
          <p className="text-3xl md:text-4xl">Articles</p>
          <NormalCarousel items={articles}>
            <ArticleCard />
          </NormalCarousel>
        </section>

        <section className="space-y-4">
          <p className="text-3xl md:text-4xl">Events</p>
          <NormalCarousel items={events}>
            <EventCard />
          </NormalCarousel>
        </section>
      </div>
    </div>
  );
};

export default Brand;
