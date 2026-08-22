import React from "react";
import Image from "next/image";
import Link from "next/link";
import ButlerAIImage from "@/public/Pages/Home/butler-ai.jpg";
import CollectionsImage from "@/public/Pages/Home/collections.jpg";
import BrandsImage from "@/public/Pages/Home/brands.jpg";
import NewsImage from "@/public/Pages/Home/news.jpg";
import ShopImage from "@/public/Pages/Home/shop.jpg";
import EventsImage from "@/public/Pages/Home/events.jpg";
import CameraImage from "@/public/Pages/Home/camera.jpg";
import { Stars, Factory } from "lucide-react";
import {
  GiShirt,
  GiNewspaper,
  GiShoppingCart,
  GiTicket,
  GiPhotoCamera,
} from "react-icons/gi";
import Logo from "@/components/Custom-UI/logo";

const PagesBentoSection = () => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-6 xl:grid-cols-8 xl:grid-rows-9 gap-5 px-5 xl:max-h-screen w-full">
      <Link
        href={"/butler"}
        className="col-span-2 md:col-span-4 xl:row-span-3 rounded-md flex border border-neutral-500 relative overflow-hidden hover:border-brandLight dark:hover:border-brandDark duration-150 group md:h-56 lg:h-72 h-48 xl:h-full"
      >
        <div>
          <Image
            src={ButlerAIImage}
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
              Your intelligent virtual assistant, ready to help with scheduling,
              recommendations, and daily tasks.
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
            src={CollectionsImage}
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
            src={BrandsImage}
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
              Browse premium brands from around the world, curated just for you.
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
            src={NewsImage}
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
        <span className="text-[40px] md:text-5xl lg:text-7xl text-white dark:text-black hidden md:block font-semibold tracking-tighter">
          Discover, rock!
        </span>
      </div>
      <Link
        href={"/shop"}
        className="col-span-2 md:col-span-3 xl:row-span-3 rounded-md flex border border-neutral-500 relative overflow-hidden hover:border-brandLight dark:hover:border-brandDark duration-150 group md:h-56 lg:h-72 h-48 xl:h-full"
      >
        <div>
          <Image
            src={ShopImage}
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
            src={EventsImage}
            alt="Butler A.I"
            className="h-full object-cover scale-105 object-left"
          />
        </div>
        <div className="absolute inset-0 h-full bg-linear-to-r from-transparent via-lightBackground to-lightBackground dark:via-darkBackground dark:to-darkBackground">
          <div className="absolute top-0 right-0 md:w-1/2 flex flex-col justify-center px-4 h-full gap-1">
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
            src={CameraImage}
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
  );
};

export default PagesBentoSection;
