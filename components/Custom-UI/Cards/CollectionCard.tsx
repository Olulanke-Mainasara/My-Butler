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
      className={`rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full ${
        form === "carousel" ? "flex" : "flex md:block"
      }`}
    >
      <Link
        href={`/collections/${item.slug + "&" + item.id}`}
        className="basis-1/2"
      >
        <Image
          src={item.display_image ?? "/placeholder.svg"}
          alt={item.name}
          width={500}
          height={300}
          className="w-full object-cover h-full md:h-fit"
        />
      </Link>

      <CardContent className="p-3 flex flex-col justify-center gap-2 basis-1/2">
        <CardTitle className="text-2xl">{item.name}</CardTitle>

        <CardDescription className="line-clamp-2">
          {item.description ?? "No description provided."}
        </CardDescription>

        <div>
          <Link
            href={`/collections/${item.slug + "&" + item.id}`}
            className="w-full"
          >
            <Button className="w-full">View Collection</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
