"use client";

import { Button } from "@/components/Shad-UI/button";
import { PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import { useEffect, useState } from "react";
import { Article } from "@/types/Article";
import ArticleCard from "@/components/Custom-UI/Cards/ArticleCard";
import LoadingSkeleton from "@/components/Custom-UI/Placeholders/LoadingSkeleton";
import { fetchArticles } from "@/lib/DatabaseFetches";
import { useBrandProfile } from "@/components/Providers/UserProvider";

export default function Collections() {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const brandProfile = useBrandProfile();

  useEffect(() => {
    if (!brandProfile) {
      return;
    }

    const fetchPageData = async () => {
      const [articles] = await Promise.all([
        fetchArticles({ filters: { brand_id: brandProfile?.id ?? "" } }),
      ]);

      setArticles(Array.isArray(articles) ? articles : []);
    };

    fetchPageData();
  }, [brandProfile]);

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
