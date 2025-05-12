"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/Shad-UI/card";
import { Button } from "@/components/Shad-UI/button";
import { Badge } from "@/components/Shad-UI/badge";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  product_images: string[] | null;
  rating: number | null;
  reviews_count: number | null;
  stock_quantity: number;
};

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const imageUrl = product.product_images?.[0] ?? "/placeholder.svg";
  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <Card className="overflow-hidden border shadow-sm transition hover:shadow-md">
      <Link href={`/products/${product.slug + "&" + product.id}`}>
        <Image
          src={imageUrl}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-52 object-cover rounded-b-none"
        />
      </Link>

      <CardHeader className="p-3">
        <CardTitle className="text-xl line-clamp-1">{product.name}</CardTitle>
        <p className="text-sm opacity-70 line-clamp-2">{product.description}</p>
      </CardHeader>

      <CardContent className="flex items-center justify-between p-3 pt-0">
        <span className="text-lg font-semibold">
          ${product.price.toFixed(2)}
        </span>
        {product.rating !== null && (
          <div className="flex items-center gap-1 text-sm text-yellow-500">
            <StarIcon className="w-4 h-4 fill-yellow-500" />
            {product.rating.toFixed(1)} ({product.reviews_count ?? 0})
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center p-3 pt-0">
        {isOutOfStock ? (
          <Badge variant="destructive">Out of Stock</Badge>
        ) : (
          <Badge variant="outline">{product.stock_quantity} left</Badge>
        )}

        <Link href={`/products/${product.slug}`}>
          <Button size="sm">View Product</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
