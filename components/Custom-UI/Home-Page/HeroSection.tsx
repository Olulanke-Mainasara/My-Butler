import { useSyncExternalStore, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/Shad-UI/carousel";
import { Link } from "next-view-transitions";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/Shad-UI/button";
import Image from "next/image";
import Logo from "@/components/Custom-UI/logo";
import { motion } from "framer-motion";
import { Collection } from "@/types/system-types/Collection";

const HeroSection = ({ collections }: { collections: Collection[] }) => {
  const [api, setApi] = useState<CarouselApi>();

  const current = useSyncExternalStore(
    (onStoreChange) => {
      if (!api) return () => {};
      api.on("select", onStoreChange);
      return () => {
        api.off("select", onStoreChange);
      };
    },
    () => (api ? api.selectedScrollSnap() + 1 : 0),
    () => 0, // server snapshot
  );

  const collectionsToDisplay =
    collections && collections.length > 0 ? collections.slice(0, 4) : [];

  return (
    <section className="mt-16 h-[calc(100dvh-4rem)] w-full bg-white relative overflow-hidden">
      <Carousel
        opts={{ align: "start", loop: true }}
        setApi={setApi}
        className="h-full"
      >
        <CarouselContent className="ml-0 h-full">
          {collectionsToDisplay && collectionsToDisplay.length > 0 ? (
            collectionsToDisplay.map((collection) => (
              <CarouselItem key={collection.id} className="h-full pl-0">
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={collection.display_image || "/placeholder.svg"}
                    alt={collection.name}
                    fill
                    sizes="100vw"
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-16 left-8 md:left-12 flex max-w-xl flex-col justify-end text-left text-white">
                    <p className="text-4xl md:text-7xl font-semibold">
                      {collection.name}
                    </p>
                    <p className="mt-3 max-w-sm text-neutral-200 line-clamp-2">
                      {collection.description}
                    </p>
                    <Link
                      href={`/collections/${collection.id}`}
                      className="w-fit"
                    >
                      <Button className="mt-6 bg-white text-black hover:bg-neutral-300">
                        Visit collection <ArrowRight className="size-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className="h-full pl-0">
              <div className="h-full w-full bg-darkBackground dark:bg-lightBackground/50 flex flex-col items-center justify-center gap-6 text-center px-4">
                <Logo mode="normal" />
                <p className="text-4xl md:text-6xl text-white dark:text-black">
                  Discover, rock!
                </p>
                <Link href="/shop">
                  <Button className="bg-white text-black hover:bg-neutral-300">
                    Start Shopping <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <div className="text-center w-full flex gap-1 items-center justify-center h-8 absolute bottom-6">
          {Array.from({ length: collectionsToDisplay?.length || 1 }).map(
            (_, index) => (
              <motion.div
                key={index}
                animate={
                  current === index + 1
                    ? { width: 20, backgroundColor: "#65d1fd" }
                    : { width: 8 }
                }
                className="h-2 bg-white/40 rounded-full transition"
              ></motion.div>
            ),
          )}
        </div>
        <CarouselPrevious className="left-4 md:left-8 border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white hidden md:flex" />
        <CarouselNext className="right-4 md:right-8 border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white hidden md:flex" />
      </Carousel>
    </section>
  );
};

export default HeroSection;
