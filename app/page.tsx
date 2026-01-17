"use client";

import Logo from "@/components/Custom-UI/logo";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { useSessionStorage } from "react-use";
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
import { Factory, Stars } from "lucide-react";
import {
  GiNewspaper,
  GiPhotoCamera,
  GiShirt,
  GiShoppingCart,
  GiTicket,
} from "react-icons/gi";
import { Link } from "next-view-transitions";
import { useTheme } from "next-themes";

export default function HomePage() {
  const [splashed, setSplashed] = useSessionStorage("splashed");
  const { theme } = useTheme();

  useEffect(() => {
    const timeOut = setTimeout(() => setSplashed("true"), 2500);
    window.addEventListener("beforeunload", () => setSplashed(""));

    return () => {
      clearTimeout(timeOut);
      window.removeEventListener("beforeunload", () => setSplashed(""));
    };
  }, [setSplashed]);

  return (
    <div className="h-screen overflow-scroll">
      {!splashed && (
        <motion.div
          animate={{
            opacity: 0,
            display: "none",
          }}
          transition={{
            default: { delay: 1.5, duration: 0.5 },
            display: { delay: 2 },
          }}
          suppressHydrationWarning
          className="absolute inset-0 bg-lightBackground dark:bg-darkBackground z-50 flex items-center justify-center gap-8 text-9xl"
        >
          <Logo mode="inverted" />{" "}
          <span>
            My{" "}
            <span className="text-brandLight dark:text-brandDark">Butler</span>
          </span>
        </motion.div>
      )}

      <div
        suppressHydrationWarning
        className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-center px-5 md:pl-4 xl:pl-3 pt-14 xl:pt-10 mb-5"
      >
        <h1
          suppressHydrationWarning
          className="text-5xl md:text-7xl lg:text-9xl"
        >
          My <span className="text-brandLight dark:text-brandDark">Butler</span>
        </h1>

        <p className="max-w-[400px] text-center md:text-right dark:text-neutral-300">
          Your personal butler service, reimagined for modern living. Experience
          luxury assistance tailored to your lifestyle, available whenever you
          need it.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 xl:grid-cols-8 xl:grid-rows-9 gap-5 px-5 xl:max-h-screen w-full pb-5">
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
          <div className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-lightBackground to-lightBackground dark:via-darkBackground dark:to-darkBackground">
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
          <div className="absolute inset-0 h-full bg-gradient-to-b from-transparent via-lightBackground to-lightBackground dark:via-darkBackground dark:to-darkBackground">
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
          <div className="absolute inset-0 h-full bg-gradient-to-t from-transparent via-lightBackground to-lightBackground dark:via-darkBackground dark:to-darkBackground">
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
          <div className="absolute inset-0 h-full bg-gradient-to-b from-transparent via-lightBackground to-lightBackground dark:via-darkBackground dark:to-darkBackground">
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
            Done, next?
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
          <div className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-lightBackground to-lightBackground dark:via-darkBackground dark:to-darkBackground">
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
          <div className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-lightBackground to-lightBackground dark:via-darkBackground dark:to-darkBackground">
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
          <div className="absolute inset-0 h-full bg-gradient-to-b from-transparent via-lightBackground dark:via-darkBackground via-70% to-lightBackground dark:to-darkBackground">
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
      </div>
    </div>
  );
}
