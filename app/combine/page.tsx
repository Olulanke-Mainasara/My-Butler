"use client";

import React from "react";
import { Button } from "@/components/Shad-UI/button";
import { Brain, User } from "lucide-react";
import { Link } from "next-view-transitions";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/Shad-UI/carousel";
import SlideTracker from "@/components/Shared/UI/Carousel/SlideTracker";

const Combine = () => {
  const links = [
    {
      id: 1,
      title: "Use our default 3D model",
      description:
        "Easily visualize your outfits with our pre-made 3D model. This option provides a professionally designed avatar that showcases different clothing combinations with accurate fit and proportions. Perfect for quick outfit previews, styling inspiration, and seamless customization.",
      url: "/combine/default",
      icon: <User size={80} className="text-brandLight dark:text-brandDark" />,
    },
    {
      id: 2,
      title: "Use your personal 3D model",
      description:
        "Upload and integrate your own 3D model for a more personalized experience. This allows you to see how outfits fit your unique body shape, ensuring better accuracy in styling decisions. Ideal for users who want a tailored digital wardrobe experience.",
      url: "/combine/personal",
      icon: <Brain size={80} className="text-brandLight dark:text-brandDark" />,
    },
  ];

  const bgIconSize = 700;

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <main className="h-screen dark:bg-slate-700">
      <div className="w-full h-full">
        <Carousel opts={{ align: "start" }} setApi={setApi} className="h-full">
          <CarouselContent className="h-full -ml-0">
            {links.map((link) => (
              <CarouselItem key={link.id} className="pl-0 h-full">
                <section className="h-full flex items-center justify-center relative">
                  <div className="w-full relative h-screen">
                    {React.cloneElement(link.icon, {
                      size: bgIconSize,
                      className: `text-brandLight dark:text-brandDark absolute top-1/2 -translate-y-1/2 ${
                        link.id === 1 ? "-left-[350px]" : "-right-[350px]"
                      }`,
                    })}
                  </div>
                  <div className="absolute inset-0 z-10 backdrop-brightness-[20%] dark:backdrop-brightness-[15%] h-full w-full space-y-4 flex flex-col justify-center items-center px-4 xl:px-0 text-white">
                    {link.icon}
                    <p className="text-2xl md:text-4xl font-bold">
                      {link.title}
                    </p>
                    <p className="text-center max-w-xl">{link.description}</p>
                    <Button
                      variant={"secondary"}
                      asChild
                      className="text-base bg-lightBackground text-black hover:opacity-70 dark:hover:bg-lightBackground dark:hover:text-black dark:hover:opacity-100"
                    >
                      <Link href={link.url}>Use this</Link>
                    </Button>
                  </div>
                </section>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 xl:left-12 disabled:hidden hidden md:flex" />
          <CarouselNext className="right-1 xl:right-12 disabled:hidden hidden md:flex" />
          <SlideTracker
            length={count}
            current={current}
            className="absolute bottom-10 left-0"
          />
        </Carousel>
      </div>
    </main>
  );
};

export default Combine;
