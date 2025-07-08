"use client";

import { Button } from "@/components/Shad-UI/button";
import { PlusCircle, ShoppingBag } from "lucide-react";
import { Link } from "next-view-transitions";
import ProductCard from "@/components/Custom-UI/Cards/ProductCard";
import { useEffect, useState } from "react";
import { getBookmarkedItems } from "@/lib/DatabaseFetches";
import { useBookmarks } from "@/components/Providers/AllProviders";
import { Product } from "@/types/Product";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";

export default function Products() {
  const [bookmarkItems, setBookmarkItems] = useState<Product[] | null>(null);
  const bookmarks = useBookmarks();

  const fetchPageData = async (filteredBookmarkIds: string[]) => {
    const [Bookmarks] = await Promise.all([
      getBookmarkedItems(filteredBookmarkIds, "products"),
    ]);

    setBookmarkItems(
      (Bookmarks || []).filter(
        (item): item is Product =>
          typeof item === "object" && item !== null && "price" in item
      )
    );
  };

  useEffect(() => {
    if (!bookmarks) {
      return;
    }

    const filteredBookmarkIds = bookmarks
      .filter((item) => item.target_type_name === "product")
      .map((item) => item.target_type_id);
    fetchPageData(filteredBookmarkIds);
  }, [bookmarks]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">Products</h1>
          <p className="text-neutral-400">View all your bookmarked products.</p>
        </div>
        <Button asChild>
          <Link href="/shop" className="flex items-center">
            <PlusCircle />
            Add Product
          </Link>
        </Button>
      </div>

      {!bookmarkItems ? (
        <LoadingSkeleton />
      ) : bookmarkItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
          {bookmarkItems.map((bookmark, index) => (
            <ProductCard item={bookmark} key={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border rounded-lg text-xl flex justify-center items-center gap-2">
          <span className="text-brandLight dark:text-brandDark">
            <ShoppingBag />
          </span>
          <p>No products found.</p>
        </div>
      )}
    </div>
  );
}
