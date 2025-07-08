"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/Shad-UI/button";
import { Badge } from "@/components/Shad-UI/badge";

// Mock data - replace with actual data fetching
const mockCollection = {
  brand_id: "brand-123",
  category: "Electronics",
  created_at: "2024-01-10T09:00:00Z",
  description:
    "Discover our curated selection of premium audio equipment designed for audiophiles and music enthusiasts. Each piece in this collection represents the pinnacle of sound engineering and craftsmanship.",
  display_image: "/placeholder.svg?height=800&width=1200",
  id: "collection-123",
  name: "Premium Audio Collection",
  slug: "premium-audio-collection",
  updated_at: "2024-01-15T16:45:00Z",
};

// Mock products in collection
const mockProducts = [
  {
    id: "1",
    name: "Wireless Headphones Pro",
    price: 299.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "2",
    name: "Studio Monitor Speakers",
    price: 599.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "3",
    name: "Premium DAC Amplifier",
    price: 899.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "4",
    name: "Audiophile Turntable",
    price: 1299.99,
    image: "/placeholder.svg?height=300&width=300",
  },
];

export default function CollectionPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-white pt-14">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <Image
          src={mockCollection.display_image || "/placeholder.svg"}
          alt={mockCollection.name}
          fill
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        <div className="absolute inset-0 flex items-center">
          <div className="px-4 md:px-5">
            <div
              className={`text-white transition-all duration-1000 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                {mockCollection.category}
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                {mockCollection.name}
              </h1>

              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Explore Collection
                <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-5">
        {/* Collection Info */}
        <div
          className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 transition-all duration-1000 hover:shadow-lg flex flex-col md:flex-row`}
        >
          <div className="w-full md:w-1/2"></div>
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Calendar className="w-4 h-4" />
              Collection created{" "}
              {new Date(mockCollection.created_at || "").toLocaleDateString()}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              About This Collection
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our {mockCollection.name} brings together the finest audio
              equipment from renowned manufacturers. Each piece represents years
              of research, development, and refinement to deliver an
              unparalleled listening experience. Whether you&apos;re a
              professional musician, audio engineer, or passionate enthusiast,
              this collection offers the tools to elevate your audio journey.
            </p>
          </div>
        </div>

        {/* Collection Details */}
        <div className="py-16">
          <div>
            <div className="text-center mb-16 max-w-4xl mx-auto">
              <h2
                className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-1000 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Curated Excellence
              </h2>
              <p
                className={`text-lg text-gray-600 leading-relaxed transition-all duration-1000 delay-200 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Every product in this collection has been carefully selected for
                its exceptional quality, innovative design, and superior
                performance. Experience the difference that premium
                craftsmanship makes.
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {mockProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <div>
                    <div className="h-64 relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 transition-all duration-500 group">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />

                      {/* Hover Overlay */}
                      <div
                        className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-all duration-300`}
                      >
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100">
                          <Eye className="w-6 h-6 text-gray-900" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold my-2">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-bold">${product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
