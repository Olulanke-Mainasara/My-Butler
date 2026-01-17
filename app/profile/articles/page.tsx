"use client";

import { Button } from "@/components/Shad-UI/button";
import { Newspaper, PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getBookmarkedItems } from "@/lib/fetches";
import ArticleCard from "@/components/Custom-UI/Cards/ArticleCard";
import { Article } from "@/types/Article";
import { useBookmarks } from "@/components/Providers/AllProviders";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { useMemo } from "react";

export default function Articles() {
  const bookmarks = useBookmarks();

  // Filter bookmark IDs for articles
  const filteredBookmarkIds = useMemo(() => {
    if (!bookmarks) return [];
    return bookmarks
      .filter((item) => item.target_type === "article")
      .map((item) => item.target_id);
  }, [bookmarks]);

  const hasArticleBookmarks = filteredBookmarkIds.length > 0;

  // Fetch bookmarked articles using React Query
  const {
    data: bookmarkItems,
    isPending,
    isError,
  } = useQuery(getBookmarkedItems(filteredBookmarkIds, "news"), {
    // Only run query when we have bookmark IDs
    enabled: hasArticleBookmarks,
  });

  // Type-safe filter for articles
  const articles = useMemo(() => {
    if (!bookmarkItems) return [];
    return bookmarkItems.filter(
      (item): item is Article =>
        typeof item === "object" && item !== null && "author" in item
    );
  }, [bookmarkItems]);

  // Loading state: only show loading when we have bookmarks and query is pending
  const isLoading = hasArticleBookmarks && isPending;

  // No bookmarks at all (neither bookmarks loaded yet OR no article bookmarks)
  const showEmptyState = !bookmarks || !hasArticleBookmarks;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">Articles</h1>
          <p className="text-neutral-400">View all your bookmarked articles.</p>
        </div>
        <Button asChild>
          <Link href="/news" className="flex items-center">
            <PlusCircle />
            Add Article
          </Link>
        </Button>
      </div>

      {showEmptyState ? (
        <div className="text-center py-20 border rounded-lg text-xl flex justify-center items-center gap-2">
          <span className="text-brandLight dark:text-brandDark">
            <Newspaper />
          </span>
          <p>You have no bookmarked articles. Start adding some!</p>
        </div>
      ) : isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <div className="text-center py-20 border rounded-lg text-xl flex justify-center items-center gap-2">
          <p className="text-red-500">
            Error loading articles. Please try again.
          </p>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
          {articles.map((bookmark) => (
            <ArticleCard item={bookmark} key={bookmark.id} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border rounded-lg text-xl flex justify-center items-center gap-2">
          <span className="text-brandLight dark:text-brandDark">
            <Newspaper />
          </span>
          <p>No articles found.</p>
        </div>
      )}
    </div>
  );
}
