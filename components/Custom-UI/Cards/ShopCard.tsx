"use client";

import React from "react";
import { Item } from "@/types/Item";

const ShopCard = ({ item }: { item?: Item }) => {
  console.log(item);
  return (
    <div className="md:px-[10px] xl:px-3 h-full">
      <div className="border flex items-center justify-center h-full rounded-3xl relative ">
        Item
      </div>
    </div>
  );
};

export default ShopCard;
