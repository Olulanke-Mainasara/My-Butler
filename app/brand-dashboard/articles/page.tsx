"use client";

import { Button } from "@/components/Shad-UI/button";
import { PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import ArticleCard from "@/components/Custom-UI/Cards/ArticleCard";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { useBrandProfile } from "@/components/Providers/UserProvider";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getArticles } from "@/lib/fetches";

export default function Collections() {
  const brandProfile = useBrandProfile();

  const { data: articles } = useQuery(
    getArticles().eq("brand_id", brandProfile?.id || ""),
    {
      enabled: !!brandProfile?.id,
    }
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">Articles</h1>
          <p className="opacity-70">Manage your published Articles.</p>
        </div>
        {articles && articles.length > 0 && (
          <Button asChild>
            <Link
              href="/brand-dashboard/articles/new"
              className="flex items-center"
            >
              <PlusCircle />
              Publish Article
            </Link>
          </Button>
        )}
      </div>

      {articles && articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {articles.map((product) => (
            <ArticleCard key={product.id} item={product} />
          ))}
        </div>
      ) : articles && articles.length === 0 ? (
        <div className="text-center py-10 border rounded-lg text-xl flex flex-col gap-4 items-center">
          <p>No articles found.</p>
          <Button asChild>
            <Link
              href="/brand-dashboard/articles/new"
              className="flex items-center"
            >
              <PlusCircle />
              Create Article
            </Link>
          </Button>
        </div>
      ) : (
        <LoadingSkeleton />
      )}
    </div>
  );
}
