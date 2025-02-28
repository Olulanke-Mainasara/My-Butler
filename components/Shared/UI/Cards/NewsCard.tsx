"use client";

import { Blog } from "@/types/Blog";
import React from "react";
import { Zap } from "lucide-react";

const NewsCard = ({ item, trending }: { item?: Blog; trending: boolean }) => {
  console.log(item);
  return (
    <div className="md:px-[10px] xl:px-3 h-full">
      <div className="border flex items-center justify-center h-full rounded-3xl relative ">
        {trending && (
          <div className="p-1 pr-3 rounded-full absolute top-4 left-4 border flex items-center gap-2 bg-white text-black">
            <div className="p-2 bg-darkBackground rounded-full text-brandLight dark:text-brandDark">
              <Zap />
            </div>

            <p className="text-xl">Trending</p>
          </div>
        )}
        News
      </div>
    </div>
  );
};

export default NewsCard;
