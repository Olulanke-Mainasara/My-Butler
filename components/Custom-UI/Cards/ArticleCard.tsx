import { Card, CardContent, CardTitle } from "@/components/Shad-UI/card";
import { Article } from "@/types/Article";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { useBookmarks } from "@/components/Providers/AllProviders";
import BookmarkTrigger from "../Buttons/BookmarkTrigger";

export default function ArticleCard({
  item,
  form,
}: {
  item?: Article;
  form?: "static" | "carousel";
}) {
  const pathname = usePathname();
  const customerProfile = useCustomerProfile();
  const bookmarks = useBookmarks();

  if (!item) {
    return;
  }

  const relevantLink = pathname.startsWith("/brand")
    ? `/items/${item.slug + "&" + item.id}`
    : `/news/${item.slug + "&" + item.id}`;

  return (
    <Card
      className={`relative rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full`}
    >
      <Link href={relevantLink}>
        <Image
          src={item.display_image ?? "/placeholder.svg"}
          alt={item.title}
          width={500}
          height={300}
          className={`w-full object-cover ${
            form === "carousel" ? "h-full" : ""
          }`}
        />
      </Link>

      <CardContent
        className={`p-3 flex flex-col justify-center gap-2 ${
          form === "carousel"
            ? "absolute inset-0 backdrop-brightness-50 text-white"
            : ""
        }`}
      >
        <CardTitle>{item.title}</CardTitle>

        <span>
          <span className="opacity-70">By</span> {item.author ?? "Unknown"}{" "}
          <span className="opacity-70">•</span>{" "}
          {item.created_at?.split("T")[0] ?? "Unpublished"}
        </span>

        <div className="flex items-center gap-2">
          <BookmarkTrigger
            customerProfile={customerProfile}
            item={item}
            bookmarks={bookmarks}
            targetType={"article"}
          />
          <Link
            href={relevantLink}
            className="hover:underline flex items-center gap-1 text-sm"
          >
            Read More{" "}
            <span className="opacity-70">
              <ArrowRight />
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
