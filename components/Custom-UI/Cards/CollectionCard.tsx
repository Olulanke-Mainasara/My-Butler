import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/Shad-UI/card";
import { Button } from "@/components/Shad-UI/button";
import Image from "next/image";
import Link from "next/link";
import { Collection } from "@/types/Collection";

export default function CollectionCard({
  collection,
}: {
  collection: Collection;
}) {
  return (
    <Card className="rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <Link href={`/collections/${collection.slug + "&" + collection.id}`}>
        <Image
          src={collection.display_image ?? "/placeholder.svg"}
          alt={collection.name}
          width={500}
          height={300}
          className="w-full h-52 object-cover"
        />
      </Link>

      <CardHeader className="p-3">
        <CardTitle className="text-2xl">{collection.name}</CardTitle>
        {collection.description && (
          <CardDescription className="line-clamp-2 text-muted-foreground">
            {collection.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardFooter className="p-3 pt-0">
        <Link href={`/collections/${collection.slug}`} className="w-full">
          <Button className="w-full">View Collection</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
