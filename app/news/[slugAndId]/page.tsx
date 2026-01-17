"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, User, Clock, Tag, Share2 } from "lucide-react";
import { Badge } from "@/components/Shad-UI/badge";
import { Button } from "@/components/Shad-UI/button";
import { Separator } from "@/components/Shad-UI/separator";
import { toast } from "sonner";
import { getArticle } from "@/lib/fetches";
import { getItemId } from "@/lib/utils";
import { useTransitionRouter } from "next-view-transitions";
import { usePathname } from "next/navigation";
import AddToBookmarks from "@/components/Custom-UI/Buttons/AddToBookmarks";
import { Markdown } from "@/app/butler/[chat]/markdown";
import { Icons } from "@/components/Custom-UI/icons";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export default function ArticlePage() {
  const pathname = usePathname();
  const [readingProgress, setReadingProgress] = useState(0);
  const articleId = getItemId(pathname.split("/").pop() || "");
  const router = useTransitionRouter();

  const { data: article, isError } = useQuery(getArticle(articleId || ""), {
    enabled: !!articleId,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!articleId) {
    toast.error("Article ID is missing.");
    router.push("/news");
    return;
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="w-6 h-6 animate-spin" /> Loading
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to load article");
    router.push("/news");
    return;
  }

  return (
    <div className="min-h-screen">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-brandLight dark:bg-brandDark transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src={article.display_image || "/placeholder.svg"}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      {/* Article Content */}
      <div className="px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div
            className={`bg-white dark:bg-neutral-900 border rounded-xl p-8 md:p-12 mb-12`}
          >
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags?.map((tag, index) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={`bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-300 hover:scale-105 cursor-pointer`}
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-neutral-600 dark:text-neutral-500 mb-8 leading-relaxed">
              {article.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>By {article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(article.created_at || "").toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{article.reading_time_minutes} min read</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <AddToBookmarks item={article} targetType="article" />
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className={`rounded-xl p-8 md:p-12 border`}>
            <Markdown>{article.content}</Markdown>

            <Separator className="my-12" />

            {/* Author Bio */}
            <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl transition-transform duration-300 hover:scale-110">
                {article.author?.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 transition-colors duration-300 hover:text-blue-600">
                  {article.author}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {article.author_bio || "No bio available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
