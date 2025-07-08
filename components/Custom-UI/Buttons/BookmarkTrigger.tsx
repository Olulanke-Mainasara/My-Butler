import { Button } from "@/components/Shad-UI/button";
import { handleBookmark } from "@/lib/DatabaseFetches";
import { cn } from "@/lib/utils";
import { Article } from "@/types/Article";
import { Bookmark } from "@/types/Bookmark";
import { Collection } from "@/types/Collection";
import { CustomerProfile } from "@/types/CustomerProfile";
import { Event } from "@/types/Event";
import { Product } from "@/types/Product";
import { BookmarkIcon } from "lucide-react";
import React from "react";

const BookmarkTrigger = ({
  customerProfile,
  item,
  bookmarks,
  targetType,
}: {
  customerProfile: CustomerProfile | null;
  item: Collection | Product | Article | Event;
  bookmarks: Bookmark[] | null;
  targetType: string;
}) => {
  return (
    <Button
      variant={"outline"}
      size={"icon"}
      onClick={() => handleBookmark(customerProfile, item, targetType)}
      className={cn(
        "min-w-10 hover:text-white",
        bookmarks?.some((bookmark) => bookmark.target_type_id === item.id)
          ? "bg-brandLight hover:bg-brandLight/70 dark:bg-brandDark text-white dark:text-gray-900"
          : "bg-transparent dark:bg-transparent hover:bg-neutral-600"
      )}
    >
      <BookmarkIcon />
    </Button>
  );
};

export default BookmarkTrigger;
