"use client";

import { Button } from "@/components/Shad-UI/button";
import { PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import ProductCard from "@/components/Custom-UI/Cards/ProductCard";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        toast.error("Failed to fetch products.");
        return;
      }

      setProducts(data);
    }

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">Products</h1>
          <p className="opacity-70">Manage your published products.</p>
        </div>
        {products.length > 0 && (
          <Button asChild>
            <Link href="/brand/products/new" className="flex items-center">
              <PlusCircle />
              Add Product
            </Link>
          </Button>
        )}
      </div>

      {products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} item={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg text-xl flex flex-col gap-4 items-center">
          <p>No products found.</p>
          <Button asChild>
            <Link href="/brand/products/new" className="flex items-center">
              <PlusCircle />
              Create Product
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
