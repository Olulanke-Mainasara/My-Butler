import { Card, CardContent, CardTitle } from "@/components/Shad-UI/card";
import { Button } from "@/components/Shad-UI/button";
import { Badge } from "@/components/Shad-UI/badge";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { Product } from "@/types/Product";
import { usePathname } from "next/navigation";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { useBookmarks } from "@/components/Providers/AllProviders";
import BookmarkTrigger from "../Buttons/BookmarkTrigger";

export default function ProductCard({
  item,
  form,
}: {
  item?: Product;
  form?: "static" | "carousel";
}) {
  const pathname = usePathname();
  const customerProfile = useCustomerProfile();
  const bookmarks = useBookmarks();

  if (!item) {
    return;
  }
  const relevantLink = pathname.startsWith("/brand")
    ? `/products/${item.slug + "&" + item.id}`
    : `/shop/${item.slug + "&" + item.id}`;

  return (
    <Card
      className={`relative rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full ${
        form !== "carousel" ? "flex md:flex-col " : ""
      }`}
    >
      <Link href={relevantLink} prefetch={false} className="basis-1/2">
        <Image
          src={item.product_images?.[0] ?? "/placeholder.svg"}
          alt={item.name}
          width={500}
          height={300}
          className="w-full object-cover h-full"
        />
      </Link>

      <CardContent
        className={`p-3 flex flex-col justify-center gap-2 basis-1/2 ${
          form === "carousel"
            ? "absolute inset-0 backdrop-brightness-50 text-white"
            : ""
        }`}
      >
        <CardTitle>{item.name}</CardTitle>

        <div
          className={`flex items-center  ${
            form === "carousel" ? "gap-4" : "justify-between"
          }`}
        >
          <span className="text-2xl md:text-3xl dark:text-neutral-300">
            ${item.price.toFixed(2)}
          </span>

          {item.rating !== null && (
            <div className="items-center gap-1 text-xl text-yellow-500 hidden lg:flex">
              <StarIcon className="w-4 h-4 fill-yellow-500" />
              {item.rating.toFixed(1)} ({item.reviews_count ?? 0})
            </div>
          )}

          {item.stock_quantity <= 0 ? (
            <Badge variant="destructive" className="hidden md:block">
              Out of Stock
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className={`gap-1 hidden md:block ${
                form === "carousel"
                  ? "text-white bg-black"
                  : "bg-black text-white dark:bg-white dark:text-black"
              }`}
            >
              <span>{item.stock_quantity}</span> <span>left</span>
            </Badge>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <Button
            size="sm"
            className={`w-full ${
              form === "carousel"
                ? "bg-white text-black hover:bg-neutral-300 w-fit"
                : ""
            } `}
            asChild
          >
            <Link href={relevantLink} prefetch={false}>
              View Product
            </Link>
          </Button>

          <BookmarkTrigger
            customerProfile={customerProfile}
            item={item}
            bookmarks={bookmarks}
            targetType={"product"}
          />
        </div>
      </CardContent>
    </Card>
  );
}
