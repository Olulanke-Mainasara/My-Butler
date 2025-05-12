"use client";

import React from "react";
import { Product } from "@/types/Product";

const ShopCard = ({ product }: { product?: Product }) => {
  console.log(product);
  return (
    <div className="md:px-[10px] xl:px-3 h-full">
      <div className="border flex items-center justify-center h-full rounded-3xl relative ">
        Product
      </div>
    </div>
  );
};

export default ShopCard;
