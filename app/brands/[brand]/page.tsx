"use client";

import ArticleCard from "@/components/Custom-UI/Cards/ArticleCard";
import CollectionCard from "@/components/Custom-UI/Cards/CollectionCard";
import EventCard from "@/components/Custom-UI/Cards/EventCard";
import ProductCard from "@/components/Custom-UI/Cards/ProductCard";
import NormalCarousel from "@/components/Custom-UI/Carousel/NormalCarousel";
import BrandLoadingSkeleton from "@/components/Custom-UI/Skeletons/BrandLoadingSkeleton";
import { getBrand } from "@/lib/fetches";
import { normalizeAndFormatPhoneNumber } from "@/lib/utils";
import { User } from "lucide-react";
import { useTransitionRouter } from "next-view-transitions";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { supabase } from "@/lib/supabase/client";

const Brand = () => {
  const pathname = usePathname();
  const brandId = pathname.split("/").pop() || "";
  const router = useTransitionRouter();

  const { data: brand } = useQuery(getBrand(brandId || ""), {
    enabled: !!brandId,
  });

  const { data: products } = useQuery(
    supabase
      .from("products")
      .select("*")
      .eq("brand_id", brandId || ""),
    {
      enabled: !!brandId,
    }
  );

  const { data: collections } = useQuery(
    supabase
      .from("collections")
      .select("*")
      .eq("brand_id", brandId || ""),
    {
      enabled: !!brandId,
    }
  );

  const { data: articles } = useQuery(
    supabase
      .from("news")
      .select("*")
      .eq("brand_id", brandId || ""),
    {
      enabled: !!brandId,
    }
  );

  const { data: events } = useQuery(
    supabase
      .from("events")
      .select("*")
      .eq("brand_id", brandId || ""),
    {
      enabled: !!brandId,
    }
  );

  if (!brandId) {
    toast.error("Brand ID is missing in the URL.");
    router.push("/brands");
    return;
  }

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
          <NormalCarousel items={products ?? []}>
            <ProductCard />
          </NormalCarousel>
        </section>

        <section className="space-y-4">
          <p className="text-3xl md:text-4xl">Collections</p>
          <NormalCarousel items={collections ?? []}>
            <CollectionCard />
          </NormalCarousel>
        </section>

        <section className="space-y-4">
          <p className="text-3xl md:text-4xl">Articles</p>
          <NormalCarousel items={articles ?? []}>
            <ArticleCard />
          </NormalCarousel>
        </section>

        <section className="space-y-4">
          <p className="text-3xl md:text-4xl">Events</p>
          <NormalCarousel items={events ?? []}>
            <EventCard />
          </NormalCarousel>
        </section>
      </div>
    </div>
  );
};

export default Brand;
