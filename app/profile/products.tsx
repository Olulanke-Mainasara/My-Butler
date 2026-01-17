"use client";
import { Button } from "@/components/Shad-UI/button";
import { PlusCircle, ShoppingBag } from "lucide-react";
import { Link } from "next-view-transitions";
import ProductCard from "@/components/Custom-UI/Cards/ProductCard";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getBookmarkedItems } from "@/lib/fetches";
import { useBookmarks } from "@/components/Providers/AllProviders";
import { Product } from "@/types/Product";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { useMemo } from "react";

export default function Products() {
  const bookmarks = useBookmarks();

  // Filter bookmark IDs for products
  const filteredBookmarkIds = useMemo(() => {
    if (!bookmarks) return [];
    return bookmarks
      .filter((item) => item.target_type === "product")
      .map((item) => item.target_id);
  }, [bookmarks]);

  const hasProductBookmarks = filteredBookmarkIds.length > 0;

  // Fetch bookmarked products using React Query
  const {
    data: bookmarkItems,
    isPending,
    isError,
  } = useQuery(getBookmarkedItems(filteredBookmarkIds, "products"), {
    // Only run query when we have bookmark IDs
    enabled: hasProductBookmarks,
  });

  // Type-safe filter for products
  const products = useMemo(() => {
    if (!bookmarkItems) return [];
    return bookmarkItems.filter(
      (item): item is Product =>
        typeof item === "object" && item !== null && "price" in item
    );
  }, [bookmarkItems]);

  // Loading state: only show loading when we have bookmarks and query is pending
  const isLoading = hasProductBookmarks && isPending;

  // No bookmarks at all (neither bookmarks loaded yet OR no product bookmarks)
  const showEmptyState = !bookmarks || !hasProductBookmarks;

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

      {/* Show empty state if no bookmarks exist */}
      {showEmptyState ? (
        <div className="text-center py-20 border rounded-lg text-xl flex justify-center items-center gap-2">
          <span className="text-brandLight dark:text-brandDark">
            <ShoppingBag />
          </span>
          <p>You have no bookmarked products. Start adding some!</p>
        </div>
      ) : isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <div className="text-center py-20 border rounded-lg text-xl flex justify-center items-center gap-2">
          <p className="text-red-500">
            Error loading products. Please try again.
          </p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
          {products.map((bookmark, index) => (
            <ProductCard item={bookmark} key={bookmark.id || index} />
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
