"use client";

import Image from "next/image";
import { Badge } from "@/components/Shad-UI/badge";
import { toast } from "sonner";
import { useTransitionRouter } from "next-view-transitions";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getCollection, getProducts } from "@/lib/fetches";
import ProductCard from "@/components/Custom-UI/Cards/ProductCard";
import { getItemId } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/Custom-UI/icons";
import AddToBookmarks from "@/components/Custom-UI/Buttons/AddToBookmarks";

export default function CollectionPage() {
  const pathname = usePathname();
  const collectionId = getItemId(pathname.split("/").pop() || "");
  const router = useTransitionRouter();

  const { data: collection, isError: collectionError } = useQuery(
    getCollection(collectionId || ""),
    {
      enabled: !!collectionId,
    },
  );

  const { data: products, isError: productsError } = useQuery(
    getProducts().eq("collection_id", collectionId || ""),
    {
      enabled: !!collectionId,
    },
  );

  if (!collectionId) {
    toast.error("Collection ID is missing.");
    router.push("/collections");
    return;
  }

  if (!collection || !products) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="w-6 h-6 animate-spin" /> Loading
      </div>
    );
  }

  if (collectionError || productsError) {
    toast.error("Failed to load collection");
    router.push("/collections");
    return;
  }

  return (
    <div className="xl:h-screen pt-14 flex flex-col xl:flex-row">
      {/* Hero Section */}
      <div className="relative h-[30vh] xl:h-full overflow-hidden w-full xl:w-1/2">
        <Image
          src={collection.display_image || "/placeholder.svg"}
          alt={collection.name}
          fill
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 to-black/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="px-4 pb-4 md:px-5 md:pb-5">
            <div className={`text-white`}>
              <div className="flex items-center gap-3">
                <AddToBookmarks item={collection} targetType={"collection"} />
                <Badge className="mb-2 bg-white/20 text-white border-white/30">
                  {collection.category_id?.name || "Uncategorized"}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight w-4/5">
                {collection.name}
              </h1>
              <p className="opacity-70">{collection.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-5 pt-2 w-full xl:w-1/2 overflow-scroll">
        {/* Collection Details */}
        <div>
          <div className="space-y-2">
            <h2
              className={`text-3xl md:text-4xl font-semibold tracking-tighter`}
            >
              Products
            </h2>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-5">
              {products?.map((product) => (
                <ProductCard item={product} key={product.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
