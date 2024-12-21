"use client";

import { Blog } from "@/types/Blog";
import Image from "next/image";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const NewsCard = ({ post, index }: { post: Blog; index: number }) => {
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
      className="h-full overflow-hidden rounded-xl border border-black dark:border-gray-400"
    >
      <div className="relative h-44 w-full overflow-hidden xl:h-48">
        <Image
          src={post.image.url}
          fill
          sizes="(max-width: 1200px) 50vw, 33vw"
          quality={50}
          className="object-cover"
          alt={post.image.alt ? post.image.alt : ""}
        />
      </div>

      <div className="p-6">
        <h1 className="mb-3 text-lg font-bold text-black dark:text-white">
          {post.title}
        </h1>

        <p className="mb-3 text-black opacity-70 dark:text-white">
          {post.description}
        </p>

        <a href={post.slug} className="flex items-center gap-2">
          Read more <FaArrowRight />
        </a>
      </div>
    </motion.div>
  );
};

export default NewsCard;
