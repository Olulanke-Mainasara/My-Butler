"use client";

import ArticleCard from "@/components/Custom-UI/Cards/ArticleCard";
import CollectionCard from "@/components/Custom-UI/Cards/CollectionCard";
import EventCard from "@/components/Custom-UI/Cards/EventCard";
import ProductCard from "@/components/Custom-UI/Cards/ProductCard";
import BrandLoadingSkeleton from "@/components/Custom-UI/Skeletons/BrandLoadingSkeleton";
import { getBrand } from "@/lib/fetches";
import { normalizeAndFormatPhoneNumber } from "@/lib/utils";
import {
  Globe,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  Layers,
  Newspaper,
  CalendarDays,
} from "lucide-react";
import { useTransitionRouter } from "next-view-transitions";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/types/system-types/Product";
import { Collection } from "@/types/system-types/Collection";
import { Article } from "@/types/system-types/Article";
import { Event } from "@/types/system-types/Event";
import { useState } from "react";

type SectionKey = "products" | "collections" | "articles" | "events";

// One grid, reused for whichever section is active. Takes the raw query
// result (undefined while loading, [] once loaded with nothing in it) so
// the two states render differently instead of collapsing into one.
const SectionGrid = <T,>({
  items,
  emptyLabel,
  renderCard,
}: {
  items: T[] | undefined;
  emptyLabel: string;
  renderCard: (item: T, index: number) => React.ReactNode;
}) => {
  if (items === undefined) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="aspect-3/4 rounded-xl bg-darkBackground/5 dark:bg-lightBackground/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-sm opacity-60 py-16 border border-dashed border-neutral-500/30 rounded-xl text-center">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-8">
      {items.slice(0, 12).map(renderCard)}
    </div>
  );
};

const Brand = () => {
  const pathname = usePathname();
  const brandId = pathname.split("/").pop() || "";
  const router = useTransitionRouter();
  const [activeSection, setActiveSection] = useState<SectionKey>("products");

  const { data: brand } = useQuery(getBrand(brandId || ""), {
    enabled: !!brandId,
  });

  const { data: products } = useQuery(
    supabase
      .from("products")
      .select("*")
      .eq("brand_id", brandId || ""),
    { enabled: !!brandId },
  );

  const { data: collections } = useQuery(
    supabase
      .from("collections")
      .select("*")
      .eq("brand_id", brandId || ""),
    { enabled: !!brandId },
  );

  const { data: articles } = useQuery(
    supabase
      .from("news")
      .select("*")
      .eq("brand_id", brandId || ""),
    { enabled: !!brandId },
  );

  const { data: events } = useQuery(
    supabase
      .from("events")
      .select("*")
      .eq("brand_id", brandId || ""),
    { enabled: !!brandId },
  );

  if (!brandId) {
    toast.error("Brand ID is missing in the URL.");
    router.push("/brands");
    return;
  }

  const sections: {
    key: SectionKey;
    label: string;
    icon: React.ElementType;
    count: number | undefined;
  }[] = [
    {
      key: "products",
      label: "Products",
      icon: ShoppingBag,
      count: products?.length,
    },
    {
      key: "collections",
      label: "Collections",
      icon: Layers,
      count: collections?.length,
    },
    {
      key: "articles",
      label: "Articles",
      icon: Newspaper,
      count: articles?.length,
    },
    {
      key: "events",
      label: "Events",
      icon: CalendarDays,
      count: events?.length,
    },
  ];

  return (
    <div className="pb-4 xl:pb-5 lg:h-screen lg:overflow-y-scroll flex flex-col gap-6">
      {!brand ? (
        <BrandLoadingSkeleton />
      ) : (
        <div className="flex flex-col">
          {/* Banner */}
          <div className="relative w-full h-36 sm:h-48 md:h-64 xl:h-72 overflow-hidden">
            {brand.banner_image ? (
              <Image
                src={brand.banner_image}
                alt={`${brand.name} banner`}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-darkBackground/10 via-darkBackground/5 to-transparent dark:from-lightBackground/15 dark:via-lightBackground/5" />
            )}
          </div>

          {/* Only the avatar overlaps the banner. Name/email sit in normal
              flow below it so they can never end up rendered over the image. */}
          <div className="px-3 md:px-6">
            <div className="-mt-10 sm:-mt-12 md:-mt-14 relative z-10 inline-block">
              {brand.profile_picture ? (
                <Image
                  src={brand.profile_picture}
                  alt={`${brand.name} profile picture`}
                  width={96}
                  height={96}
                  quality={75}
                  className="w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-full object-cover border-4 border-background shrink-0 block"
                />
              ) : (
                <span className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-darkBackground text-white dark:bg-lightBackground dark:text-black border-4 border-background shrink-0">
                  <User size={36} />
                </span>
              )}
            </div>

            <div className="mt-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl">{brand.name}</h2>
              <p className="opacity-70 text-sm">{brand.email}</p>
            </div>
          </div>

          {/* Description + meta */}
          <div className="px-3 md:px-6 mt-4 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
            {brand.description && (
              <p className="max-w-2xl text-sm sm:text-base opacity-90">
                {brand.description}
              </p>
            )}

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm opacity-80 shrink-0">
              {brand.url && (
                <Link
                  href={brand.url}
                  prefetch={false}
                  target="_blank"
                  className="flex items-center gap-1.5 hover:opacity-100 hover:underline underline-offset-2"
                >
                  <Globe size={16} />
                  <span className="truncate max-w-45">{brand.url}</span>
                </Link>
              )}
              {brand.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  {brand.location}
                </span>
              )}
              {brand.contact && (
                <span className="flex items-center gap-1.5">
                  <Phone size={16} />
                  {normalizeAndFormatPhoneNumber(brand.contact)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <hr className="mx-3 md:mx-6" />

      {/* Below md there's no room for a real sidebar, so section switching
          becomes a horizontal tab strip instead. */}
      <div className="flex md:hidden gap-2 overflow-x-auto px-3 -mb-2">
        {sections.map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`flex items-center gap-1.5 shrink-0 px-3.5 py-2 rounded-full text-sm border transition ${
              activeSection === key
                ? "bg-darkBackground text-white border-darkBackground dark:bg-lightBackground dark:text-black dark:border-lightBackground"
                : "border-neutral-500/30 opacity-70"
            }`}
          >
            <Icon size={15} />
            {label}
            {count !== undefined && (
              <span className="opacity-60">({count})</span>
            )}
          </button>
        ))}
      </div>

      <div className="px-3 md:px-6 flex-1 flex flex-col md:flex-row gap-6 md:gap-8 xl:gap-10 min-h-0">
        <nav className="hidden md:flex md:flex-col gap-1 w-48 xl:w-56 shrink-0 md:sticky md:top-19 md:self-start">
          {sections.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-left transition cursor-pointer ${
                activeSection === key
                  ? "bg-darkBackground text-white dark:bg-lightBackground dark:text-black"
                  : "hover:bg-darkBackground/5 dark:hover:bg-lightBackground/10 opacity-80"
              }`}
            >
              <Icon size={17} />
              <span className="flex-1">{label}</span>
              {count !== undefined && (
                <span className="text-xs opacity-60">{count}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="flex-1 min-w-0 space-y-4 pb-6">
          <h3 className="text-2xl md:text-3xl font-medium">
            {sections.find((s) => s.key === activeSection)?.label}
          </h3>

          {activeSection === "products" && (
            <SectionGrid
              items={products as Product[] | undefined}
              emptyLabel="No products yet."
              renderCard={(product, i) => (
                <ProductCard item={product} key={i} />
              )}
            />
          )}
          {activeSection === "collections" && (
            <SectionGrid
              items={collections as Collection[] | undefined}
              emptyLabel="No collections yet."
              renderCard={(collection, i) => (
                <CollectionCard item={collection} key={i} />
              )}
            />
          )}
          {activeSection === "articles" && (
            <SectionGrid
              items={articles as Article[] | undefined}
              emptyLabel="No articles yet."
              renderCard={(article, i) => (
                <ArticleCard item={article} key={i} />
              )}
            />
          )}
          {activeSection === "events" && (
            <SectionGrid
              items={events as Event[] | undefined}
              emptyLabel="No events yet."
              renderCard={(event, i) => <EventCard item={event} key={i} />}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Brand;
