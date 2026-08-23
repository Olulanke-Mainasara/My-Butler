import React from "react";
import { Card, CardTitle, CardContent } from "@/components/Shad-UI/card";
import { Button } from "@/components/Shad-UI/button";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { ArrowRight, User } from "lucide-react";
import { Brand } from "@/types/system-types/Brand";

const BrandCard = ({
  item,
  form,
}: {
  item?: Brand;
  form?: "static" | "carousel";
}) => {
  const href = `/brands/${item?.id}`;

  // Carousel cards are small and dense, so they stay a single image with
  // the name overlaid, rather than the fuller banner + avatar treatment.
  if (form === "carousel") {
    return (
      <Card className="group relative rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-fit p-0 gap-0 border-0">
        <Link href={href} prefetch={false} className="block relative h-32">
          {item?.banner_image || item?.profile_picture ? (
            <Image
              src={(item.banner_image ?? item.profile_picture) as string}
              alt={item?.name ?? "Brand"}
              width={500}
              height={300}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-darkBackground/15 via-darkBackground/5 to-transparent dark:from-lightBackground/20 dark:via-lightBackground/5" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
        </Link>

        <CardContent className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between gap-2 text-white">
          <CardTitle className="text-sm font-medium truncate">
            {item?.name}
          </CardTitle>
          <Button
            size="sm"
            className="bg-white text-black hover:bg-neutral-200 shrink-0"
            asChild
          >
            <Link href={href} prefetch={false}>
              View
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden h-fit flex flex-col p-0 gap-0">
      <Link
        href={href}
        prefetch={false}
        className="block relative aspect-16/10 overflow-hidden bg-neutral-100 dark:bg-neutral-900"
      >
        {item?.banner_image ? (
          <Image
            src={item.banner_image}
            alt={item?.name ?? "Brand"}
            width={500}
            height={300}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-darkBackground/10 via-darkBackground/5 to-transparent dark:from-lightBackground/15 dark:via-lightBackground/5" />
        )}
      </Link>

      <div className="px-4">
        <Link
          href={href}
          prefetch={false}
          className="relative -mt-6 block w-12 h-12 shrink-0"
        >
          {item?.profile_picture ? (
            <Image
              src={item.profile_picture}
              alt=""
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover border-3 border-background"
            />
          ) : (
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-darkBackground text-white dark:bg-lightBackground dark:text-black border-3 border-background">
              <User size={20} />
            </span>
          )}
        </Link>
      </div>

      <CardContent className="px-4 pt-2 pb-4 flex flex-col gap-2 grow">
        <CardTitle className="text-lg leading-tight truncate">
          {item?.name}
        </CardTitle>

        <Button
          variant="outline"
          size="sm"
          className="w-fit mt-1 gap-1.5 group-hover:gap-2.5 transition-all duration-300"
          asChild
        >
          <Link href={href} prefetch={false}>
            View brand
            <ArrowRight size={14} />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default BrandCard;
