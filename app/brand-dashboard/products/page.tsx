"use client";

import { Button } from "@/components/Shad-UI/button";
import { PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import ProductCard from "@/components/Custom-UI/Cards/ProductCard";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { fetchProducts } from "@/lib/DatabaseFetches";
import { useBrandProfile } from "@/components/Providers/UserProvider";

export default function Products() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const brandProfile = useBrandProfile();

  useEffect(() => {
    if (!brandProfile) {
      return;
    }

    const fetchPageData = async () => {
      const [products] = await Promise.all([
        fetchProducts({ filters: { brand_id: brandProfile?.id ?? "" } }),
      ]);

      setProducts(Array.isArray(products) ? products : []);
    };

    fetchPageData();
  }, [brandProfile]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">Products</h1>
          <p className="opacity-70">Manage your published products.</p>
        </div>
        {products && products.length > 0 && (
          <Button asChild>
            <Link
              href="/brand-dashboard/products/new"
              className="flex items-center"
            >
              <PlusCircle />
              Add Product
            </Link>
          </Button>
        )}
      </div>

      {products && products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} item={product} />
          ))}
        </div>
      ) : products && products.length === 0 ? (
        <div className="text-center py-10 border rounded-lg text-xl flex flex-col gap-4 items-center">
          <p>No products found.</p>
          <Button asChild>
            <Link
              href="/brand-dashboard/products/new"
              className="flex items-center"
            >
              <PlusCircle />
              Create Product
            </Link>
          </Button>
        </div>
      ) : (
        <LoadingSkeleton />
      )}
    </div>
  );
}
