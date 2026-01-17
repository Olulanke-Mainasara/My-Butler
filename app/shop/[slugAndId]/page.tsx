"use client";

import Image from "next/image";
import {
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/Shad-UI/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/Shad-UI/tabs";
import React, { useState } from "react";
import AddToBookmarks from "@/components/Custom-UI/Buttons/AddToBookmarks";
import { usePathname } from "next/navigation";
import { getItemId } from "@/lib/utils";
import { toast } from "sonner";
import { useTransitionRouter } from "next-view-transitions";
import AddToCart from "@/components/Custom-UI/Buttons/AddToCart";
import { getProduct } from "@/lib/fetches";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Icons } from "@/components/Custom-UI/icons";

export default function ProductPage() {
  const pathname = usePathname();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const productId = getItemId(pathname.split("/").pop() || "");
  const router = useTransitionRouter();

  const { data: product, isError } = useQuery(getProduct(productId || ""), {
    enabled: !!productId,
  });

  if (!productId) {
    toast.error("Product ID is missing.");
    router.push("/shop");
    return;
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="w-6 h-6 animate-spin" /> Loading
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to load product");
    router.push("/shop");
    return;
  }

  return (
    <div className="min-h-screen md:h-screen pt-16 px-4 md:px-5 pb-5 flex flex-col md:flex-row gap-6 md:gap-5">
      {/* Product Images */}
      <div className="space-y-4 md:w-1/2 h-full flex flex-col">
        <div className="relative h-full md:h-1/2 xl:h-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 group">
          <Image
            src={product.product_images?.[selectedImage] || "/placeholder.svg"}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Image Navigation */}
          <button
            onClick={() =>
              setSelectedImage((prev) =>
                prev > 0 ? prev - 1 : product.product_images!.length - 1
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center xl:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-neutral-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() =>
              setSelectedImage((prev) =>
                prev < product.product_images!.length - 1 ? prev + 1 : 0
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center xl:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-neutral-800"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {product.product_images?.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedImage
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {product.product_images?.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square rounded-lg overflow-hidden bg-slate-100 transition-all duration-300 hover:scale-105 ${
                selectedImage === index
                  ? "ring-2 ring-blue-500 shadow-lg"
                  : "hover:ring-2 hover:ring-blue-300"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${product.name} view ${index + 1}`}
                width={150}
                height={150}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-6 md:w-1/2 lg:overflow-scroll h-full">
        <div>
          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 transition-all duration-300 hover:scale-110 ${
                    i < Math.floor(product.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm ml-2">
                {product.rating} ({product.reviews_count} reviews)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl xl:text-5xl font-bold">
              ${product.price.toFixed(2)}
            </span>
            <Badge
              variant={product.stock_quantity > 0 ? "default" : "destructive"}
              className={`transition-all duration-300 ${
                product.stock_quantity > 0
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "animate-pulse"
              }`}
            >
              {product.stock_quantity > 0
                ? `${product.stock_quantity} in stock`
                : "Out of stock"}
            </Badge>
          </div>
        </div>

        <p className="max-w-xl">{product.description}</p>

        {/* Features */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Key Features</h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {product.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-2"
                style={{ animationDelay: `${1000 + index * 100}ms` }}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full transition-all duration-300 hover:scale-150"></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4 mt-6">
          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 hover:bg-neutral-600 hover:text-white text-2xl transition-colors duration-200 rounded-l-lg"
              >
                -
              </button>
              <span className="px-4 py-1 border-x text-2xl">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 hover:bg-neutral-600 hover:text-white text-2xl transition-colors duration-200 rounded-r-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 items-center">
            <AddToCart
              item={product}
              quantity={quantity}
              itemType={"product"}
            />
            <AddToBookmarks item={product} targetType={"product"} />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center gap-6 pt-4 border-t">
          {[
            product.free_shipping && {
              icon: React.createElement(Truck),
              text: "Free shipping",
            },
            product.warranty_years &&
              product.warranty_years > 0 && {
                icon: React.createElement(Shield, { className: "w-4 h-4" }),
                text: `${product.warranty_years}-year warranty`,
              },
            product.return_days &&
              product.return_days > 0 && {
                icon: React.createElement(RotateCcw, { className: "w-4 h-4" }),
                text: `${product.return_days}-day returns`,
              },
          ]
            .filter((item) => item !== null && item !== 0 && item !== false)
            .map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
        </div>

        {/* Specifications */}
        <div className="w-full">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="specifications" className="mt-8">
              <div className="rounded-2xl p-8 border">
                <h3 className="text-2xl font-bold">Technical Specifications</h3>
                <hr className="mt-5 mb-4" />
                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Object.entries(
                    product.specifications as Record<string, string>
                  ).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 px-2">
                      <span className="font-bold first-letter:uppercase">
                        {key}
                      </span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-8">
              <div className="rounded-2xl p-8 shadow-sm border hover:shadow-md transition-shadow duration-300">
                <h3 className="text-2xl font-bold">Customer Reviews</h3>
                <hr className="mt-5 mb-4" />
                {/* {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-500">
                            {review.author}
                          </span>
                        </div>
                        <p>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No reviews yet. Be the first to review!</p>
                )} */}
                <p>No reviews yet. Be the first to review!</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
