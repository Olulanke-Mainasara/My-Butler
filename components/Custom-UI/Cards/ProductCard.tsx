"use client";

import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/Shad-UI/card";
import { Button } from "@/components/Shad-UI/button";
import { Badge } from "@/components/Shad-UI/badge";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { Product } from "@/types/Product";
import { usePathname } from "next/navigation";

export default function ProductCard({
  item,
  form,
}: {
  item?: Product;
  form?: "static" | "carousel";
}) {
  const pathname = usePathname();

  if (!item) {
    return;
  }
  const relevantLink = pathname.startsWith("/brand")
    ? `/products/${item.slug + "&" + item.id}`
    : `/shop/${item.slug + "&" + item.id}`;
  const imageUrl = item.product_images?.[0] ?? "/placeholder.svg";
  const isOutOfStock = item.stock_quantity <= 0;

  return (
    <Card
      className={`overflow-hidden flex border shadow-sm transition hover:shadow-md h-full ${
        form !== "carousel" ? "flex-row md:flex-col" : "flex-row"
      }`}
    >
      <Link href={relevantLink} className="basis-1/2">
        <Image
          src={imageUrl}
          alt={item.name}
          width={400}
          height={300}
          className="w-full h-full object-cover"
        />
      </Link>

      <CardContent className="flex flex-col justify-center gap-3 p-3 basis-1/2">
        <div>
          <CardTitle className="text-2xl line-clamp-1">{item.name}</CardTitle>

          <CardDescription className="opacity-70 line-clamp-2">
            {item.description ?? "No description provided."}
          </CardDescription>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl md:text-3xl font-semibold">
            ${item.price.toFixed(2)}
          </span>

          {item.rating !== null && (
            <div className="flex items-center gap-1 text-xl text-yellow-500">
              <StarIcon className="w-4 h-4 fill-yellow-500" />
              {item.rating.toFixed(1)} ({item.reviews_count ?? 0})
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {isOutOfStock ? (
            <Badge variant="destructive">Out of Stock</Badge>
          ) : (
            <Badge variant="outline" className="gap-1">
              <span>{item.stock_quantity}</span> <span>left</span>
            </Badge>
          )}

          <Link href={relevantLink} className="w-full">
            <Button size="sm" className="w-full">
              View Product
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
