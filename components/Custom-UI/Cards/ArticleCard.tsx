import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/Shad-UI/card";
import { Article } from "@/types/Article";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

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

  const relevantLink = pathname.startsWith("/brand")
    ? `/items/${item.slug + "&" + item.id}`
    : `/news/${item.slug + "&" + item.id}`;

  return (
    <Card
      className={`overflow-hidden flex hover:shadow-md transition ${
        form !== "carousel" ? "flex-row md:flex-col" : "flex-row"
      }`}
    >
      <Link href={relevantLink} className="basis-1/2 overflow-hidden">
        <Image
          src={item.display_image ?? "/placeholder.svg"}
          alt={item.title}
          width={600}
          height={300}
          className="w-full h-52 object-cover hover:scale-110 duration-300"
        />
      </Link>

      <CardContent className="p-3 flex flex-col gap-2 basis-1/2 justify-center">
        <CardTitle className="line-clamp-1 text-2xl">{item.title}</CardTitle>

        <CardDescription className="line-clamp-2">
          {item.description ?? "No description provided."}
        </CardDescription>

        <span>
          <span className="opacity-70">By</span> {item.author ?? "Unknown"}{" "}
          <span className="opacity-70">•</span>{" "}
          {item.created_at?.split("T")[0] ?? "Unpublished"}
        </span>

        <div>
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
