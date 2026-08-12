import Image from "next/image";
import Variant1A from "@/public/Pages/Home/brand-story/variant-1-a.jpg";
import Variant1B from "@/public/Pages/Home/brand-story/variant-1-b.jpg";
import Variant1C from "@/public/Pages/Home/brand-story/variant-1-c.jpg";
import Variant2A from "@/public/Pages/Home/brand-story/variant-2-a.jpg";
import Variant2B from "@/public/Pages/Home/brand-story/variant-2-b.jpg";
import Variant2C from "@/public/Pages/Home/brand-story/variant-2-c.jpg";
import Variant3A from "@/public/Pages/Home/brand-story/variant-3-a.jpg";
import Variant3B from "@/public/Pages/Home/brand-story/variant-3-b.jpg";
import Variant3C from "@/public/Pages/Home/brand-story/variant-3-c.jpg";
import Variant4A from "@/public/Pages/Home/brand-story/variant-4-a.jpg";
import Variant4B from "@/public/Pages/Home/brand-story/variant-4-b.jpg";
import Variant4C from "@/public/Pages/Home/brand-story/variant-4-c.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/Shad-UI/carousel";
import type { StaticImageData } from "next/image";

type TextPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type Variant = {
  text: string;
  images: [StaticImageData, StaticImageData, StaticImageData];
  textPosition: TextPosition;
};

const variants: Variant[] = [
  {
    text: "Curated Brands, Uncompromising Craft",
    images: [Variant1A, Variant1B, Variant1C],
    textPosition: "top-left",
  },
  {
    text: "Bold Design, African Roots",
    images: [Variant2A, Variant2B, Variant2C],
    textPosition: "top-right",
  },
  {
    text: "Style That Tells A Story",
    images: [Variant3A, Variant3B, Variant3C],
    textPosition: "bottom-left",
  },
  {
    text: "Discover Before Everyone Else",
    images: [Variant4A, Variant4B, Variant4C],
    textPosition: "bottom-right",
  },
];

const textPositionClasses: Record<TextPosition, string> = {
  "top-left": "md:col-start-1 md:row-start-1",
  "top-right": "md:col-start-2 md:row-start-1",
  "bottom-left": "md:col-start-1 md:row-start-2",
  "bottom-right": "md:col-start-2 md:row-start-2",
};

function ImageCell({ image, alt }: { image: StaticImageData; alt: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image src={image} alt={alt} fill sizes="50vw" className="object-cover" />
    </div>
  );
}

function TextCell({
  text,
  textPosition,
}: {
  text: string;
  textPosition: TextPosition;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-darkBackground p-8 text-center dark:bg-lightBackground/50 ${textPositionClasses[textPosition]}`}
    >
      <p className="text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl dark:text-black">
        {text}
      </p>
    </div>
  );
}

function BrandStoryBlock({ text, images, textPosition }: Variant) {
  return (
    <div className="w-full max-h-[900px] md:h-screen">
      {/* Desktop: 2x2 grid */}
      <div className="hidden h-full w-full md:grid md:grid-cols-2 md:grid-rows-2 md:gap-2">
        <TextCell text={text} textPosition={textPosition} />
        {images.map((image, index) => (
          <ImageCell key={index} image={image} alt={text} />
        ))}
      </div>

      {/* Mobile: text, then image carousel */}
      <div className="flex h-full w-full flex-col justify-center gap-6 px-4 py-16 md:hidden">
        <p className="text-center text-4xl font-semibold tracking-tight">
          {text}
        </p>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="basis-[85%]">
                <div className="relative h-64 w-full overflow-hidden rounded-xl">
                  <Image
                    src={image}
                    alt={text}
                    fill
                    sizes="85vw"
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

export default function BrandStorySection() {
  return (
    <section className="space-y-4">
      {variants.map((variant) => (
        <BrandStoryBlock key={variant.text} {...variant} />
      ))}
    </section>
  );
}
