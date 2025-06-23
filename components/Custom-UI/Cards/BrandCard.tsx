import React from "react";
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/Shad-UI/card";
import { Button } from "@/components/Shad-UI/button";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { Brand } from "@/types/Brand";

const BrandCard = ({
  item,
  form,
}: {
  item?: Brand;
  form?: "static" | "carousel";
}) => {
  return (
    <Card
      className={`relative rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-[245px] flex flex-col`}
    >
      <Link
        href={`/brands/${item?.id}`}
        prefetch={false}
        className="h-2/5 xl:h-[48%]"
      >
        <Image
          src={item?.profile_picture ?? "/placeholder.svg"}
          alt={item?.name ?? "Brand"}
          width={500}
          height={300}
          className="w-full h-full object-cover"
        />
      </Link>

      <CardContent
        className={`p-3 flex flex-col justify-center gap-2 ${
          form === "carousel"
            ? "absolute inset-0 backdrop-brightness-50 text-white"
            : ""
        }`}
      >
        <CardTitle>{item?.name}</CardTitle>

        <CardDescription className={`${form === "carousel" ? "hidden" : ""}`}>
          {item?.description ?? "No description provided."}
        </CardDescription>

        <div className="flex items-center gap-2">
          <Button
            className={`w-full ${
              form === "carousel"
                ? "bg-white text-black hover:bg-neutral-300 w-fit"
                : ""
            } `}
            asChild
          >
            <Link href={`/brands/${item?.id}`} prefetch={false}>
              View Brand
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandCard;
