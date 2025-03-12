"use client";

import Logo from "@/components/Custom-UI/logo";
import NavLink from "@/components/Custom-UI/Links/NavLink";
import { navigation } from "@/static-data/navigation";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="absolute inset-0 bg-lightBackground dark:bg-darkBackground"></div>
      }
    >
      <Home />
    </Suspense>
  );
}

function Home() {
  const [splashCounter, setSplashCounter] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const splashed = searchParams.get("splashed");

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/", { scroll: false });
      setSplashCounter((prev) => prev + 1);
    }, 2800);

    return () => clearTimeout(timeout);
  }, [router]);

  const shouldDisplaySplash = !splashed && splashCounter === 0;

  return (
    <div className="h-full">
      {shouldDisplaySplash && (
        <motion.div
          animate={{
            opacity: 0,
            display: "none",
          }}
          transition={{
            default: { delay: 1.5, duration: 1 },
            display: { delay: 2 },
          }}
          className="absolute inset-0 bg-lightBackground dark:bg-darkBackground z-50"
        ></motion.div>
      )}

      <div className="h-full flex items-center justify-center">
        <div className="hidden w-96 h-96 border border-black dark:border-white rounded-full relative sm:flex items-center justify-center">
          <motion.div
            initial={shouldDisplaySplash && { scale: 1 }}
            animate={{ scale: 0.75 }}
            transition={{
              duration: 0.45,
              delay: shouldDisplaySplash ? 1.5 : 0,
            }}
            className="z-50 absolute"
          >
            <Logo scale="big" />
          </motion.div>
          <div className="grid grid-cols-3 grid-rows-6 w-full h-full ">
            {navigation.map((button, index) => (
              <NavLink
                key={button.id}
                button={button}
                index={index}
                shouldSplash={shouldDisplaySplash}
              />
            ))}
          </div>
        </div>

        <div className="sm:hidden w-72 h-72 border border-black dark:border-white rounded-full relative flex items-center justify-center">
          <motion.div
            initial={shouldDisplaySplash && { scale: 0.75 }}
            animate={{ scale: 0.5 }}
            transition={{
              duration: 0.5,
              delay: 1.5,
            }}
            className="z-50 absolute"
          >
            <Logo scale="big" />
          </motion.div>
          <div className="grid grid-cols-3 grid-rows-6 w-full h-full ">
            {navigation.map((button, index) => (
              <NavLink
                key={button.id}
                button={button}
                index={index}
                shouldSplash={shouldDisplaySplash}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
