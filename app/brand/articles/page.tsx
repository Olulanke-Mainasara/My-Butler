"use client";

import { Button } from "@/components/Shad-UI/button";
import { PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Article } from "@/types/Article";
import ArticleCard from "@/components/Custom-UI/Cards/ArticleCard";

export default function Collections() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchNews() {
      const { data, error } = await supabase.from("news").select("*");

      if (error) {
        toast.error("Failed to fetch articles.");
        return;
      }

      setArticles(data);
    }

    fetchNews();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">Articles</h1>
          <p className="opacity-70">Manage your published Articles.</p>
        </div>
        {articles.length > 0 && (
          <Button asChild>
            <Link href="/brand/articles/new" className="flex items-center">
              <PlusCircle />
              Publish Article
            </Link>
          </Button>
        )}
      </div>

      {articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} item={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg text-xl flex flex-col gap-4 items-center">
          <p>No articles found.</p>
          <Button asChild>
            <Link href="/brand/articles/new" className="flex items-center">
              <PlusCircle />
              Publish Article
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
