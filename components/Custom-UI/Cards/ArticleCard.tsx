import { Card, CardContent, CardTitle } from "@/components/Shad-UI/card";
import { Article } from "@/types/Article";
import { Calendar, User } from "lucide-react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { buildItemSlugId, convertRawDateToReadableDate } from "@/lib/utils";

export default function ArticleCard({
  item,
  form,
}: {
  item?: Article;
  form?: "static" | "carousel";
}) {
  const pathname = usePathname();

  if (!item) {
    return;
  }

  const relevantLink = pathname.startsWith("/brand-dashboard")
    ? `/articles/${buildItemSlugId(item.slug, item.id)}`
    : `/news/${buildItemSlugId(item.slug, item.id)}`;

  return (
    <Card
      className={`relative overflow-hidden h-fit md:h-full bg-transparent dark:bg-transparent border-none p-0 gap-3 ${
        form !== "carousel" || !pathname.startsWith("/brands")
          ? "flex flex-col"
          : "rounded-xl"
      }`}
    >
      <Link
        href={relevantLink}
        prefetch={false}
        className={`rounded-xl overflow-hidden h-44 ${
          form === "carousel" ? "md:h-full" : ""
        }`}
      >
        <Image
          src={item.display_image ?? "/placeholder.svg"}
          alt={item.title}
          width={500}
          height={300}
          className={`w-full h-full object-cover`}
        />
      </Link>

      <CardContent
        className={`flex flex-col justify-center gap-2 ${
          form === "carousel"
            ? "absolute inset-0 backdrop-brightness-50 text-white p-3"
            : "p-0"
        }`}
      >
        <span
          className={`flex items-center gap-1  ${
            form === "carousel" ? "text-base" : "text-sm md:text-base"
          }`}
        >
          <Calendar size={16} />
          {item.created_at
            ? convertRawDateToReadableDate(item.created_at)
            : "Unpublished"}
        </span>

        <Link href={relevantLink} prefetch={false}>
          <CardTitle
            className={`${
              form === "carousel" ? "text-2xl" : "text-lg md:text-xl"
            }`}
          >
            {item.title}
          </CardTitle>
        </Link>

        <span
          className={`flex items-center gap-1  ${
            form === "carousel" ? "text-base" : "text-sm md:text-base"
          }`}
        >
          <User size={16} />
          {item.author ?? "Unknown"}
        </span>
      </CardContent>
    </Card>
  );
}
