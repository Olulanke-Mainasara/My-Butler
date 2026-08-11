"use client";

import Logo from "@/components/Custom-UI/logo";
import Image from "next/image";
import { useEffect, useState } from "react";
import ButlerAIDark from "@/public/Pages/Home/butler-ai-dark.png";
import ButlerAILight from "@/public/Pages/Home/butler-ai-light.png";
import CollectionsDark from "@/public/Pages/Home/collections-dark.png";
import CollectionsLight from "@/public/Pages/Home/collections-light.png";
import EventsDark from "@/public/Pages/Home/events-dark.png";
import EventsLight from "@/public/Pages/Home/events-light.png";
import NewsDark from "@/public/Pages/Home/news-dark.png";
import NewsLight from "@/public/Pages/Home/news-light.png";
import ShopDark from "@/public/Pages/Home/shop-dark.png";
import ShopLight from "@/public/Pages/Home/shop-light.png";
import {
  ArrowDown,
  ArrowRight,
  Factory,
  ShoppingBag,
  Stars,
} from "lucide-react";
import {
  GiNewspaper,
  GiPhotoCamera,
  GiShirt,
  GiShoppingCart,
  GiTicket,
} from "react-icons/gi";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/Shad-UI/carousel";
import { Link } from "next-view-transitions";
import { useTheme } from "next-themes";
import { Icons } from "@/components/Custom-UI/icons";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DEFAULT_PAGE_SIZE,
  getArticles,
  getBrands,
  getCollections,
  getEvents,
  getProducts,
} from "@/lib/fetches";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import ProductCard from "@/components/Custom-UI/Cards/ProductCard";
import CollectionCard from "@/components/Custom-UI/Cards/CollectionCard";
import EventCard from "@/components/Custom-UI/Cards/EventCard";
import EventSliderCard from "@/components/Custom-UI/Cards/EventSliderCard";
import ArticleCard from "@/components/Custom-UI/Cards/ArticleCard";
import { motion } from "framer-motion";
import { Button } from "@/components/Shad-UI/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/Shad-UI/empty";
import Footer from "@/components/Custom-UI/Footer";

const subItems = [
  {
    icon: <ShoppingBag />,
    category: "Products",
  },
  { icon: <GiShirt />, category: "Collections" },
  {
    icon: <GiTicket />,
    category: "Events",
  },
  {
    icon: <GiNewspaper />,
    category: "News",
  },
];

export default function HomePage() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Products only ever feed the category-switcher carousel above (no
  // dedicated listing section on this page), so it's capped but has no
  // "Load more" control here - /shop is where the full paginated listing
  // lives. Collections/events/news each also back a dedicated section
  // further down the page, so those get their own visibleCount + trigger.
  const [productsVisibleCount] = useState(DEFAULT_PAGE_SIZE);
  const [collectionsVisibleCount, setCollectionsVisibleCount] =
    useState(DEFAULT_PAGE_SIZE);
  const [newsVisibleCount, setNewsVisibleCount] = useState(DEFAULT_PAGE_SIZE);

  const { data: products } = useQuery(
    getProducts({ pageSize: productsVisibleCount })
  );
  const {
    data: collections,
    isFetching: isFetchingCollections,
    isLoading: isLoadingCollections,
  } = useQuery(getCollections({ pageSize: collectionsVisibleCount }));
  const { data: events, isLoading: isLoadingEvents } = useQuery(
    getEvents({ pageSize: 8 })
  );
  const {
    data: news,
    isFetching: isFetchingNews,
    isLoading: isLoadingNews,
  } = useQuery(getArticles({ pageSize: newsVisibleCount }));
  const { data: brands } = useQuery(getBrands());
  const [category, setCategory] = useState("Products");

  const hasMoreCollections =
    (collections?.length ?? 0) >= collectionsVisibleCount;
  const hasMoreNews = (news?.length ?? 0) >= newsVisibleCount;

  return (
    <>
    <div className="pb-5 space-y-20">
      <section className="mt-16 h-[calc(100vh-4rem)] w-full bg-white relative overflow-hidden">
        <Carousel
          opts={{ align: "start", loop: true }}
          setApi={setApi}
          className="h-full"
        >
          <CarouselContent className="ml-0 h-full">
            {brands && brands.length > 0 ? (
              brands.map((brand) => (
                <CarouselItem key={brand.id} className="h-full pl-0">
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={brand.profile_picture || "/placeholder.svg"}
                      alt={brand.name}
                      fill
                      sizes="100vw"
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-16 left-8 right-8 md:left-12 md:right-12 text-white">
                      <p className="uppercase tracking-widest text-sm text-brandDark mb-2">
                        Featured brand
                      </p>
                      <p className="text-4xl md:text-6xl font-semibold">
                        {brand.name}
                      </p>
                      <p className="mt-3 max-w-xl text-neutral-200 line-clamp-2">
                        {brand.description}
                      </p>
                      <Link href={`/brands/${brand.id}`}>
                        <Button className="mt-6 bg-white text-black hover:bg-neutral-300">
                          Visit brand <ArrowRight className="size-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="h-full pl-0">
                <div className="h-full w-full bg-darkBackground dark:bg-lightBackground/50 flex flex-col items-center justify-center gap-6 text-center px-4">
                  <Logo mode="normal" />
                  <p className="text-4xl md:text-6xl text-white dark:text-black">
                    Discover, rock!
                  </p>
                  <Link href="/shop">
                    <Button className="bg-white text-black hover:bg-neutral-300">
                      Start Shopping <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <div className="text-center w-full flex gap-1 items-center justify-center h-8 absolute bottom-6">
            {Array.from({ length: brands?.length || 1 }).map((_, index) => (
              <motion.div
                key={index}
                animate={
                  current === index + 1
                    ? { width: 20, backgroundColor: "#65d1fd" }
                    : { width: 8 }
                }
                className="h-2 bg-darkBackground dark:bg-white rounded-full transition"
              ></motion.div>
            ))}
          </div>
        </Carousel>
      </section>

      <section className="flex flex-col xl:flex-row w-full xl:pr-7 gap-4 xl:gap-0 pl-5 pb-8">
        {subItems.length === 0 ? (
          <div className="text-center px-10 py-5 xl:py-28 border rounded-lg text-xl flex flex-col gap-4 items-center xl:px-2 xl:w-1/12">
            <Icons.spinner className="animate-spin" />
          </div>
        ) : (
          <div className="xl:basis-[10.7%] flex items-center">
            <div className="xl:h-44 w-full">
              <Carousel
                opts={{
                  align: "start",
                }}
                orientation={isMobile ? "horizontal" : "vertical"}
                className="w-full"
              >
                <CarouselContent className="-mt-5 h-20 xl:h-[200px] pr-16 xl:pr-0">
                  {subItems.map((subItem, index) => (
                    <CarouselItem
                      key={index}
                      className="pt-5 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/3 cursor-pointer"
                      onClick={() => setCategory(subItem.category)}
                    >
                      <div className="p-1 border h-full flex items-center justify-center gap-1.5 rounded-xl text-xl xl:text-base">
                        <span className="text-brandLight dark:text-brandDark">
                          {subItem.icon}
                        </span>

                        <span className="">{subItem.category}</span>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden xl:flex" />
                <CarouselNext className="hidden xl:flex" />
              </Carousel>
            </div>
          </div>
        )}

        {!products ||
        products?.length === 0 ||
        !collections ||
        collections?.length === 0 ||
        !events ||
        events?.length === 0 ||
        !news ||
        news?.length === 0 ? (
          <LoadingSkeleton length={1} className="md:grid-cols-1 ml-5" />
        ) : (
          <div className="xl:basis-5/6 xl:w-11/12 flex items-center h-full xl:pl-16 xl:pr-4">
            <div className="w-full h-full">
              <Carousel opts={{ align: "start" }} className="h-full">
                <CarouselContent className="-ml-5 xl:-ml-8 h-full pr-24 xl:pr-0">
                  {category === "Products" &&
                    products &&
                    products.map((item, index) => {
                      const form = "static"; // Initialize the 'form' variable
                      return (
                        <CarouselItem
                          key={index}
                          className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-5 xl:pl-8 h-full"
                        >
                          <ProductCard form={form} item={item} />
                        </CarouselItem>
                      );
                    })}

                  {category === "Collections" &&
                    collections &&
                    collections.map((item, index) => {
                      const form = "static"; // Initialize the 'form' variable
                      return (
                        <CarouselItem
                          key={index}
                          className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-5 xl:pl-8 h-full"
                        >
                          <CollectionCard form={form} item={item} />
                        </CarouselItem>
                      );
                    })}

                  {category === "Events" &&
                    events &&
                    events.map((item, index) => {
                      const form = "static"; // Initialize the 'form' variable
                      return (
                        <CarouselItem
                          key={index}
                          className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-5 xl:pl-8 h-full"
                        >
                          <EventCard form={form} item={item} />
                        </CarouselItem>
                      );
                    })}

                  {category === "News" &&
                    news &&
                    news.map((item, index) => {
                      const form = "static"; // Initialize the 'form' variable
                      return (
                        <CarouselItem
                          key={index}
                          className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-5 xl:pl-8 h-full"
                        >
                          <ArticleCard form={form} item={item} />
                        </CarouselItem>
                      );
                    })}
                </CarouselContent>
                <CarouselPrevious className="hidden xl:flex" />
                <CarouselNext className="hidden xl:flex" />
              </Carousel>
            </div>
          </div>
        )}
      </section>

      <section className="grid grid-cols-2 md:grid-cols-6 xl:grid-cols-8 xl:grid-rows-9 gap-5 px-5 xl:max-h-screen w-full">
        <Link
          href={"/butler"}
          className="col-span-2 md:col-span-4 xl:row-span-3 rounded-md flex border border-neutral-500 relative overflow-hidden hover:border-brandLight dark:hover:border-brandDark duration-150 group md:h-56 lg:h-72 h-48 xl:h-full"
        >
          <div>
            <Image
              src={theme === "light" ? ButlerAILight : ButlerAIDark}
              alt="Butler A.I"
              className="h-full object-cover scale-150"
            />
          </div>
          <div className="absolute inset-0 h-full bg-linear-to-r from-transparent via-lightBackground to-lightBackground dark:via-darkBackground dark:to-darkBackground">
            <div className="absolute top-0 right-0 w-1/2 flex flex-col justify-center px-4 h-full gap-1">
              <p className="text-2xl flex items-center gap-2">
                <Stars className="text-brandLight dark:text-brandDark size-7" />
                Butler A.I
              </p>
              <p className="dark:text-neutral-300 dark:opacity-50 group-hover:opacity-100 duration-150 hidden lg:block">
                Your intelligent virtual assistant, ready to help with
                scheduling, recommendations, and daily tasks.
              </p>
            </div>
          </div>
        </Link>
        <Link
          href={"/collections"}
          className="md:col-span-2 xl:row-span-3 rounded-md flex border border-neutral-500 relative overflow-hidden hover:border-brandLight dark:hover:border-brandDark duration-150 group md:h-56 lg:h-72 h-48 xl:h-full"
        >
          <div>
            <Image
              src={theme === "light" ? CollectionsLight : CollectionsDark}
              alt="Butler A.I"
              className="h-full object-cover scale-150"
            />
          </div>
          <div className="absolute inset-0 h-full bg-linear-to-b from-transparent via-lightBackground to-lightBackground dark:via-darkBackground dark:to-darkBackground">
            <div className="absolute bottom-0 right-0 h-1/2 flex flex-col justify-center px-4 gap-1">
              <p className="text-2xl flex items-center gap-2">
                <GiShirt className="text-brandLight dark:text-brandDark size-7" />
                Collections
              </p>
              <p className="dark:text-neutral-300 dark:opacity-50 group-hover:opacity-100 duration-150 hidden lg:block">
                Explore curated fashion collections handpicked by our style
                experts.
              </p>
            </div>
          </div>
        </Link>
        <Link
          href={"/brands"}
          className="md:col-span-2 xl:row-span-4 rounded-md flex flex-col-reverse border border-neutral-500 relative overflow-hidden hover:border-brandLight dark:hover:border-brandDark duration-150 group md:h-56 lg:h-72 h-48 xl:h-full"
        >
          <div>
            <Image
              src={theme === "light" ? ButlerAILight : ButlerAIDark}
              alt="Butler A.I"
              className="h-full object-cover scale-150"
            />
          </div>
          <div className="absolute inset-0 h-full bg-linear-to-t from-transparent via-lightBackground to-lightBackground dark:via-darkBackground dark:to-darkBackground">
            <div className="absolute top-0 right-0 py-4 flex flex-col justify-center px-4 gap-1">
              <p className="text-2xl flex items-center gap-2">
                <Factory className="text-brandLight dark:text-brandDark size-7" />
                Brands
              </p>
              <p className="dark:text-neutral-300 dark:opacity-50 group-hover:opacity-100 duration-150 hidden lg:block">
                Browse premium brands from around the world, curated just for
                you.
              </p>
            </div>
          </div>
        </Link>
        <Link
          href={"/news"}
          className="md:col-span-3 md:row-start-3 xl:col-span-2 xl:row-start-4 xl:row-span-3 rounded-md flex border border-neutral-500 relative overflow-hidden hover:border-brandLight dark:hover:border-brandDark duration-150 group md:h-56 lg:h-72 h-48 xl:h-full"
        >
          <div>
            <Image
              src={theme === "light" ? NewsLight : NewsDark}
              alt="Butler A.I"
              className="h-full object-cover scale-150"
            />
          </div>
          <div className="absolute inset-0 h-full bg-linear-to-b from-transparent via-lightBackground to-lightBackground dark:via-darkBackground dark:to-darkBackground">
            <div className="absolute bottom-0 left-0 h-1/2 flex flex-col justify-center px-4 gap-1">
              <p className="text-2xl flex items-center gap-2">
                <GiNewspaper className="text-brandLight dark:text-brandDark size-7" />
                Latest
              </p>
              <p className="dark:text-neutral-300 dark:opacity-50 group-hover:opacity-100 duration-150 hidden lg:block">
                Stay updated with the newest arrivals and fashion trends.
              </p>
            </div>
          </div>
        </Link>
        <div className="md:col-span-4 xl:col-span-4 xl:row-span-3 bg-darkBackground dark:bg-lightBackground/50 rounded-md flex items-center justify-center lg:gap-6 hover:dark:bg-white duration-150">
          <div className="md:scale-75 lg:scale-100">
            <Logo mode="normal" />
          </div>
          <span className="text-[40px] md:text-5xl lg:text-7xl text-white dark:text-black hidden md:block">
            Discover, rock!
          </span>
        </div>
        <Link
          href={"/shop"}
          className="col-span-2 md:col-span-3 xl:row-span-3 rounded-md flex border border-neutral-500 relative overflow-hidden hover:border-brandLight dark:hover:border-brandDark duration-150 group md:h-56 lg:h-72 h-48 xl:h-full"
        >
          <div>
            <Image
              src={theme === "light" ? ShopLight : ShopDark}
              alt="Butler A.I"
              className="h-full object-cover scale-150"
            />
          </div>
          <div className="absolute inset-0 h-full bg-linear-to-r from-transparent via-lightBackground to-lightBackground dark:via-darkBackground dark:to-darkBackground">
            <div className="absolute top-0 right-0 w-1/2 flex flex-col justify-center px-4 h-full gap-1">
              <p className="text-2xl flex items-center gap-2">
                <GiShoppingCart className="text-brandLight dark:text-brandDark size-7" />
                Shop
              </p>
              <p className="dark:text-neutral-300 dark:opacity-50 group-hover:opacity-100 duration-150 hidden lg:block">
                Browse our exclusive selection of premium products.
              </p>
            </div>
          </div>
        </Link>
        <Link
          href={"/events"}
          className="md:col-span-4 xl:col-span-3 xl:row-span-3 rounded-md flex border border-neutral-500 relative overflow-hidden hover:border-brandLight dark:hover:border-brandDark duration-150 group md:h-56 lg:h-72 h-48 xl:h-full"
        >
          <div>
            <Image
              src={theme === "light" ? EventsLight : EventsDark}
              alt="Butler A.I"
              className="h-full object-cover scale-105 object-left"
            />
          </div>
          <div className="absolute inset-0 h-full bg-linear-to-r from-transparent via-lightBackground to-lightBackground dark:via-darkBackground dark:to-darkBackground">
            <div className="absolute top-0 right-0 w-1/2 flex flex-col justify-center px-4 h-full gap-1">
              <p className="text-2xl flex items-center gap-2">
                <GiTicket className="text-brandLight dark:text-brandDark size-7" />
                Events
              </p>
              <p className="dark:text-neutral-300 dark:opacity-50 group-hover:opacity-100 duration-150 hidden lg:block">
                Discover exclusive fashion events, trunk shows, and private
                shopping experiences.
              </p>
            </div>
          </div>
        </Link>
        <Link
          href={"/camera"}
          className="md:col-span-2 xl:col-start-7 xl:row-start-5 xl:row-span-5 rounded-md flex flex-col border border-neutral-500 relative overflow-hidden hover:border-brandLight dark:hover:border-brandDark duration-150 group md:h-56 lg:h-72 h-48 xl:h-full"
        >
          <div className="h-full">
            <Image
              src={theme === "light" ? ButlerAILight : ButlerAIDark}
              alt="Butler A.I"
              className="h-full w-full object-cover object-right"
            />
          </div>
          <div className="absolute inset-0 h-full bg-linear-to-b from-transparent via-lightBackground dark:via-darkBackground via-70% to-lightBackground dark:to-darkBackground">
            <div className="absolute bottom-0 right-0 py-4 flex flex-col justify-center px-4 gap-1">
              <p className="text-2xl flex items-center gap-2">
                <GiPhotoCamera className="text-brandLight dark:text-brandDark size-7" />
                Camera
              </p>
              <p className="dark:text-neutral-300 dark:opacity-50 group-hover:opacity-100 duration-150 hidden lg:block">
                Upload photos to get instant style recommendations.
              </p>
            </div>
          </div>
        </Link>
      </section>

      <section className="space-y-4 px-4 md:px-5 pt-5">
        <p className="text-3xl md:text-4xl">Diverse Collections</p>

        {isLoadingCollections ? (
          <LoadingSkeleton length={4} height="md:h-[450px]" />
        ) : !collections || collections.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <GiShirt />
              </EmptyMedia>
              <EmptyTitle>No collections yet</EmptyTitle>
              <EmptyDescription>
                Brands are still building out their collections. Check back
                soon.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-8">
            {collections.map((collection, index) => (
              <CollectionCard item={collection} key={index} />
            ))}
          </div>
        )}

        {hasMoreCollections && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              disabled={isFetchingCollections}
              onClick={() =>
                setCollectionsVisibleCount((count) => count + DEFAULT_PAGE_SIZE)
              }
            >
              {isFetchingCollections && (
                <Icons.spinner className="w-4 h-4 animate-spin" />
              )}
              Load more
            </Button>
          </div>
        )}
      </section>

      <section className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-(--breakpoint-xl) mx-auto px-4 md:px-5">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter">
              How Butler A.I <br />
              works for you.
            </h2>
            <p className="uppercase flex items-center gap-2 font-semibold">
              see how it works{" "}
              <ArrowDown className="text-brandLight dark:text-brandDark" />
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-3 gap-6 md:gap-20 items-center mb-20">
            <div className="bg-muted rounded-xl p-4 lg:p-6 col-span-1 md:col-span-2 lg:col-span-1">
              {/* Get Styled Mobile */}
              <div className="md:hidden mb-6 aspect-video w-full bg-background rounded-xl">
                <Image
                  src={theme === "light" ? ButlerAILight : ButlerAIDark}
                  alt="Butler A.I chat"
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="text-3xl font-semibold tracking-tight">
                Get Styled by Butler A.I
              </span>

              <div className="flex items-start gap-3 mt-6">
                <Stars className="shrink-0 text-brandLight dark:text-brandDark" />
                <p className="-mt-0.5 text-xl md:text-base xl:text-2xl">
                  Chat with your personal AI stylist for product
                  recommendations, sizing help, and anything else on the
                  platform.
                </p>
              </div>

              <Link href="/butler">
                <Button className="mt-8 w-full py-6 text-lg cursor-pointer">
                  Chat with Butler{" "}
                  <ArrowRight className="size-6 text-brandLight dark:text-brandDark" />
                </Button>
              </Link>
            </div>
            {/* Get Styled Desktop */}
            <div className="hidden md:block bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2 overflow-hidden h-[550px] dark:border">
              <Image
                src={theme === "light" ? ButlerAILight : ButlerAIDark}
                alt="Butler A.I chat"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Shop Desktop */}
            <div className="hidden md:block bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2 overflow-hidden h-[550px] dark:border">
              <Image
                src={theme === "light" ? ShopLight : ShopDark}
                alt="Shop"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-muted rounded-xl p-4 lg:p-6 col-span-1 md:col-span-2 lg:col-span-1">
              {/* Shop Mobile */}
              <div className="md:hidden mb-6 aspect-video w-full bg-background rounded-xl">
                <Image
                  src={theme === "light" ? ShopLight : ShopDark}
                  alt="Shop"
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="text-3xl font-semibold tracking-tight">
                Shop Curated Products
              </span>

              <div className="flex items-start gap-3 mt-6">
                <GiShoppingCart className="shrink-0 text-brandLight dark:text-brandDark size-5" />
                <p className="-mt-0.5 text-xl md:text-base xl:text-2xl">
                  Browse products from independent brands, searchable and
                  filterable to find exactly what you want.
                </p>
              </div>

              <Link href="/shop">
                <Button className="mt-8 w-full py-6 text-lg cursor-pointer">
                  Start Shopping{" "}
                  <ArrowRight className="size-6 text-brandLight dark:text-brandDark" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-3 gap-6 md:gap-20 items-center">
            <div className="bg-muted rounded-xl p-4 lg:p-6 col-span-1 md:col-span-2 lg:col-span-1">
              {/* Collections Mobile */}
              <div className="md:hidden mb-6 aspect-video w-full bg-background rounded-xl">
                <Image
                  src={theme === "light" ? CollectionsLight : CollectionsDark}
                  alt="Collections"
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="text-3xl font-semibold tracking-tight">
                Explore Collections
              </span>

              <div className="flex items-start gap-3 mt-6">
                <GiShirt className="shrink-0 text-brandLight dark:text-brandDark size-5" />
                <p className="-mt-0.5 text-xl md:text-base xl:text-2xl">
                  Discover collections curated by brands and organized by
                  theme and season.
                </p>
              </div>

              <Link href="/collections">
                <Button className="mt-8 w-full py-6 text-lg cursor-pointer">
                  Browse Collections{" "}
                  <ArrowRight className="size-6 text-brandLight dark:text-brandDark" />
                </Button>
              </Link>
            </div>
            {/* Collections Desktop */}
            <div className="hidden md:block bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2 overflow-hidden h-[550px] dark:border">
              <Image
                src={theme === "light" ? CollectionsLight : CollectionsDark}
                alt="Collections"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Events Desktop */}
            <div className="hidden md:block bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2 overflow-hidden h-[550px] dark:border">
              <Image
                src={theme === "light" ? EventsLight : EventsDark}
                alt="Events"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-muted rounded-xl p-4 lg:p-6 col-span-1 md:col-span-2 lg:col-span-1">
              {/* Events Mobile */}
              <div className="md:hidden mb-6 aspect-video w-full bg-background rounded-xl">
                <Image
                  src={theme === "light" ? EventsLight : EventsDark}
                  alt="Events"
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="text-3xl font-semibold tracking-tight">
                Discover Events
              </span>

              <div className="flex items-start gap-3 mt-6">
                <GiTicket className="shrink-0 text-brandLight dark:text-brandDark size-5" />
                <p className="-mt-0.5 text-xl md:text-base xl:text-2xl">
                  Find trunk shows, launches, and fashion events from the
                  brands you love, virtual and in-person.
                </p>
              </div>

              <Link href="/events">
                <Button className="mt-8 w-full py-6 text-lg cursor-pointer">
                  See Events <ArrowRight className="size-6 text-brandLight dark:text-brandDark" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8 px-6 dark:text-white xl:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl">Anticipated Events</h2>
          <Link href="/events">
            <Button variant="outline">
              See all events <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        {isLoadingEvents ? (
          <LoadingSkeleton
            length={3}
            height="h-[500px] md:h-[600px]"
            className="md:grid-cols-3"
          />
        ) : !events || events.length === 0 ? (
          <Empty className="border dark:text-white">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <GiTicket />
              </EmptyMedia>
              <EmptyTitle>Nothing on the calendar yet</EmptyTitle>
              <EmptyDescription>
                Trunk shows, launches, and private shopping experiences will
                show up here as brands post them.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Carousel opts={{ align: "start" }} className="h-[500px] md:h-[600px]">
            <CarouselContent className="h-full">
              {events.map((event) => (
                <CarouselItem
                  key={event.id}
                  className="h-full basis-[85%] md:basis-[70%]"
                >
                  <EventSliderCard item={event} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        )}
      </section>

      <section className="space-y-4 px-4 md:px-5 pt-5">
        <h2 className="text-3xl md:text-4xl">Top Stories</h2>

        {isLoadingNews ? (
          <LoadingSkeleton
            length={5}
            height="md:h-96"
            className="md:grid-cols-3 xl:grid-cols-5"
          />
        ) : !news || news.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <GiNewspaper />
              </EmptyMedia>
              <EmptyTitle>No stories yet</EmptyTitle>
              <EmptyDescription>
                Fashion news and brand updates will land here first.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-8">
            {news.map((newsItem, index) => (
              <ArticleCard item={newsItem} key={index} />
            ))}
          </div>
        )}

        {hasMoreNews && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              disabled={isFetchingNews}
              onClick={() =>
                setNewsVisibleCount((count) => count + DEFAULT_PAGE_SIZE)
              }
            >
              {isFetchingNews && (
                <Icons.spinner className="w-4 h-4 animate-spin" />
              )}
              Load more
            </Button>
          </div>
        )}
      </section>
    </div>
    <Footer />
    </>
  );
}
