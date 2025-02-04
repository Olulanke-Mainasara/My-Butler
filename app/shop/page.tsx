import ShopCard from "@/components/Shared/UI/Cards/ShopCard";
import { fashionItems } from "@/static-data/content";
import React from "react";

const Shop = () => {
  return (
    <div className="pt-4 md:pt-12">
      <h1 className="text-center text-4xl xl:text-8xl">Latest Drops</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 p-6 xl:p-12">
        {fashionItems.map((item, index) => (
          <ShopCard key={item._id} item={item} index={index} />
        ))}
      </section>
    </div>
  );
};

export default Shop;
