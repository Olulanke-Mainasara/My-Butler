import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/Shad-UI/card";
import { Button } from "@/components/Shad-UI/button";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { Collection } from "@/types/Collection";
import { buildItemSlugId } from "@/lib/utils";

export default function CollectionCard({
  item,
  form,
}: {
  item?: Collection;
  form?: "static" | "carousel";
}) {
  if (!item) {
    return;
  }

  return (
    <Card
      className={`relative rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full`}
    >
      <Link
        href={`/collections/${buildItemSlugId(item.slug, item.id)}`}
        prefetch={false}
        className="basis-1/2"
      >
        <Image
          src={item.display_image ?? "/placeholder.svg"}
          alt={item.name}
          width={500}
          height={300}
          className={`w-full object-cover ${
            form === "carousel" ? "h-full" : ""
          }`}
        />
      </Link>

      <CardContent
        className={`p-3 flex flex-col justify-center gap-2 basis-1/2 ${
          form === "carousel"
            ? "absolute inset-0 backdrop-brightness-50 text-white"
            : ""
        }`}
      >
        <CardTitle className="md:text-xl">{item.name}</CardTitle>

        <CardDescription className={`${form === "carousel" ? "max-w-xs" : ""}`}>
          {item.description ?? "No description provided."}
        </CardDescription>

        <div className="flex items-center gap-2">
          <Button
            className={`w-full ${
              form === "carousel"
                ? "bg-white text-black hover:bg-neutral-300 w-fit"
                : ""
            } `}
            asChild
          >
            <Link
              href={`/collections/${buildItemSlugId(item.slug, item.id)}`}
              prefetch={false}
            >
              View Collection
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
