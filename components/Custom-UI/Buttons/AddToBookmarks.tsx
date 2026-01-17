"use client";

import { Button } from "@/components/Shad-UI/button";
import { cn } from "@/lib/utils";
import { Article } from "@/types/Article";
import { Collection } from "@/types/Collection";
import { Event } from "@/types/Event";
import { Product } from "@/types/Product";
import { BookmarkIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { toggleBookmark } from "@/lib/mutations";
import { toast } from "sonner";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { useBookmarks } from "@/components/Providers/AllProviders";

const AddToBookmarks = ({
  item,
  targetType,
}: {
  item: Collection | Product | Article | Event;
  targetType: string;
}) => {
  const queryClient = useQueryClient();
  const customerProfile = useCustomerProfile();
  const bookmarks = useBookmarks();

  const isBookmarked = bookmarks?.some(
    (bookmark) => bookmark.target_id === item.id
  );

  const { mutate: handleBookmark, isPending } = useMutation({
    mutationFn: () => toggleBookmark(supabase, targetType, item.id),

    onSuccess: (data) => {
      if (data === "added") {
        toast.success("Bookmarked!");
      } else {
        toast("Removed from bookmarks");
      }

      // Simply invalidate all bookmark queries
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey.includes("bookmarks"),
      });
    },

    onError: (error) => {
      toast.error("Error modifying bookmarks");
      console.error(error);
    },
  });

  const handleClick = () => {
    if (!customerProfile) {
      toast.info("You must be logged in to bookmark");
      return;
    }

    if (!item?.id) {
      toast.error("Invalid ID");
      return;
    }

    handleBookmark();
  };

  return (
    <Button
      variant={"outline"}
      size={"icon"}
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "min-w-10 hover:text-white transition-colors",
        isBookmarked
          ? "bg-brandLight hover:bg-brandLight/70 dark:bg-brandDark text-white dark:text-gray-900"
          : "bg-transparent dark:bg-transparent hover:bg-neutral-600",
        isPending && "opacity-50 cursor-not-allowed"
      )}
    >
      <BookmarkIcon
        className={cn("transition-transform", isPending && "animate-pulse")}
      />
    </Button>
  );
};

export default AddToBookmarks;
