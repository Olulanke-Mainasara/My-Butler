"use client";

import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useQueryClient } from "@tanstack/react-query";
import { getArticle } from "@/lib/fetches";
import { getItemId, invalidateTable } from "@/lib/utils";
import { useBrandProfile } from "@/components/Providers/UserProvider";
import { Icons } from "@/components/Custom-UI/icons";
import { supabase } from "@/lib/supabase/client";
import { ArticleForm } from "../article-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/Shad-UI/alert-dialog";
import { Button } from "@/components/Shad-UI/button";
import { Trash2 } from "lucide-react";

export default function EditArticlePage() {
  const pathname = usePathname();
  const articleId = getItemId(pathname.split("/").pop() || "");
  const router = useTransitionRouter();
  const queryClient = useQueryClient();
  const brandProfile = useBrandProfile();

  const { data: article, isError } = useQuery(getArticle(articleId || ""), {
    enabled: !!articleId,
  });

  if (!articleId) {
    toast.error("Article ID is missing.");
    router.push("/brand-dashboard/articles");
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
    router.push("/brand-dashboard/articles");
    return;
  }

  if (brandProfile && article.brand_id !== brandProfile.id) {
    toast.error("You don't have access to this article.");
    router.push("/brand-dashboard/articles");
    return;
  }

  const handleDelete = async () => {
    const { error } = await supabase
      .from("news")
      .delete()
      .eq("id", article.id);

    if (error) {
      toast.error("Failed to delete article. Please try again.");
      return;
    }

    invalidateTable(queryClient, "news");
    toast.success("Article deleted.");
    router.push("/brand-dashboard/articles");
  };

  return (
    <div className="space-y-8">
      <ArticleForm initialData={article} />

      <div className="xl:max-w-screen-sm space-y-2 pt-6 border-t border-destructive/30">
        <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
        <p className="text-sm opacity-70">
          Deleting an article removes it permanently and cannot be undone.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4" />
              Delete Article
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this article?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete &quot;{article.title}&quot;.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
