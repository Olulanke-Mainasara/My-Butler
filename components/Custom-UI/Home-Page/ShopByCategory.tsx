import { useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/Shad-UI/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/Shad-UI/carousel";
import type { StaticImageData } from "next/image";

import Variant1A from "@/public/Pages/Home/brand-story/variant-1-a.jpg";
import Variant1B from "@/public/Pages/Home/brand-story/variant-1-b.jpg";
import Variant1C from "@/public/Pages/Home/brand-story/variant-1-c.jpg";
import Variant2A from "@/public/Pages/Home/brand-story/variant-2-a.jpg";
import Variant2B from "@/public/Pages/Home/brand-story/variant-2-b.jpg";
import Variant2C from "@/public/Pages/Home/brand-story/variant-2-c.jpg";
import Variant3A from "@/public/Pages/Home/brand-story/variant-3-a.jpg";
import Variant3B from "@/public/Pages/Home/brand-story/variant-3-b.jpg";
import Variant4A from "@/public/Pages/Home/brand-story/variant-4-a.jpg";
import Variant4B from "@/public/Pages/Home/brand-story/variant-4-b.jpg";
import Collection from "@/public/Pages/Collections/collection.webp";
import Collection2 from "@/public/Pages/Collections/collection2.png";
import Collection3 from "@/public/Pages/Collections/collection3.jpeg";
import Collection4 from "@/public/Pages/Collections/collection4.webp";
import Collection5 from "@/public/Pages/Collections/collection5.webp";
import Collection6 from "@/public/Pages/Collections/collection6.jpg";

type ProductType = {
  name: string;
  image: StaticImageData;
};

const rows: ProductType[][] = [
  [
    { name: "Dresses", image: Variant1C },
    { name: "Tops", image: Variant1A },
    { name: "Bottoms", image: Variant1B },
    { name: "Outerwear", image: Variant3A },
    { name: "Shoes", image: Collection3 },
    { name: "Bags", image: Collection2 },
    { name: "Jewelry", image: Variant4A },
    { name: "Accessories", image: Variant4B },
  ],
  [
    { name: "Scarves", image: Variant2C },
    { name: "Hats", image: Variant2A },
    { name: "Belts", image: Variant2B },
    { name: "Sunglasses", image: Variant3B },
    { name: "Watches", image: Collection5 },
    { name: "Sets", image: Collection },
    { name: "Loungewear", image: Collection4 },
    { name: "Swimwear", image: Collection6 },
  ],
];

function ProductTypeCard({ name, image }: ProductType) {
  return (
    <Link
      href="/shop"
      className="relative block h-72 w-full overflow-hidden rounded-xl"
    >
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 767px) 50vw, 25vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/25 to-transparent" />
      <p className="absolute bottom-4 left-4 text-xl text-white md:text-2xl">
        {name}
      </p>
    </Link>
  );
}

export default function ShopByCategory() {
  const [api, setApi] = useState<CarouselApi>();

  return (
    <section className="px-4 md:px-5">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter flex items-center justify-center gap-5 mb-6">
        Shop by{" "}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => api?.scrollPrev()}
        >
          <ArrowUp className="size-4" />
        </Button>{" "}
        category
      </h2>

      <Carousel
        opts={{ align: "start" }}
        orientation="vertical"
        setApi={setApi}
        className="h-96 md:h-152.5 w-full"
      >
        <CarouselContent className="h-full space-y-5 mt-0">
          {rows.map((row, index) => (
            <CarouselItem key={index} className="pt-0">
              <div className="grid h-full grid-cols-2 gap-4 md:grid-cols-4 md:gap-5 xl:gap-8">
                {row.map((productType) => (
                  <ProductTypeCard key={productType.name} {...productType} />
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => api?.scrollNext()}
        >
          <ArrowDown className="size-4" />
        </Button>
      </div>
    </section>
  );
}
