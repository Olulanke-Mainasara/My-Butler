"use client";

import React from "react";
import { motion } from "framer-motion";
import { Item } from "@/types/Item";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

const ShopCard = ({ item, index }: { item: Item; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.5,
          delay: index * 0.15,
        },
      }}
      className="h-full w-full rounded-xl border border-black duration-300 hover:border-brandLight dark:border-gray-400 dark:hover:border-brandLight"
    >
      {item.displayImage && (
        <div className="relative h-44 w-full overflow-hidden rounded-t-xl">
          <Image
            src={item.displayImage.url}
            fill
            sizes="(max-width: 1200px) 50vw, 33vw"
            quality={50}
            className="object-cover"
            alt={item.displayImage.alt ? item.displayImage.alt : ""}
          />
        </div>
      )}

      <div className="space-y-3 p-5">
        <div className="flex justify-between">
          <p className="first-letter:uppercase text-2xl">{item.name}</p>
          <a href={item.slug} className="flex items-center gap-2">
            Read more <FaArrowRight />
          </a>
        </div>

        <p className="text-lg opacity-70">{item.description}</p>
      </div>
    </motion.div>
  );
};

export default ShopCard;
