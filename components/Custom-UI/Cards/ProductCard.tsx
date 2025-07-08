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
  const relevantLink = pathname.startsWith("/brand-dashboard")
    ? `/products/${item.slug + "&" + item.id}`
    : `/shop/${item.slug + "&" + item.id}`;

  return (
    <Card
      className={`relative rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full ${
        form !== "carousel" && !pathname.startsWith("/brands")
          ? "flex md:flex-col"
          : ""
      }`}
    >
      <Link href={relevantLink} prefetch={false} className="basis-2/5">
        <Image
          src={item.product_images?.[0] ?? "/placeholder.svg"}
          alt={item.name}
          width={500}
          height={300}
          className="w-full object-cover h-full"
        />
      </Link>

      <CardContent
        className={`p-3 flex flex-col justify-center gap-2 basis-3/5 ${
          form === "carousel"
            ? "absolute inset-0 backdrop-brightness-50 text-white"
            : ""
        }`}
      >
        <CardTitle
          className={`${form === "carousel" ? "text-2xl" : "text-xl"}`}
        >
          {item.name}
        </CardTitle>

        <div
          className={`flex items-center  ${
            form === "carousel" ? "gap-2" : "justify-between"
          }`}
        >
          <span className="text-xl md:text-2xl lg:text-2xl dark:text-neutral-300">
            ${item.price.toFixed(2)}
          </span>

          {item.rating !== null && (
            <div className="items-center flex gap-1 text-yellow-500">
              <StarIcon className="w-4 h-4 fill-yellow-500" />
              {item.rating.toFixed(1)}{" "}
              <span className="hidden lg:block">({item.reviews_count})</span>
            </div>
          )}

          {item.stock_quantity <= 0 ? (
            <Badge variant="destructive" className="hidden md:block">
              Out of Stock
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className={`gap-1 ${
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
