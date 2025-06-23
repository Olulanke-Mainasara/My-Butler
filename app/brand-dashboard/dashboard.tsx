"use client";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/Shad-UI/card";
// import { Overview } from "./overview";
// import { RecentSales } from "./resent-sales";
import { useEffect, useState } from "react";
import { useBrandProfile } from "@/components/Providers/UserProvider";
import { Link } from "next-view-transitions";
import { Button } from "@/components/Shad-UI/button";
import {
  fetchArticles,
  fetchCollections,
  fetchEvents,
  fetchProducts,
} from "@/lib/DatabaseFetches";

export default function DashboardPage() {
  const brandProfile = useBrandProfile();
  const [productNumbers, setProductNumbers] = useState(0);
  const [collectionNumbers, setCollectionNumbers] = useState(0);
  const [articleNumbers, setArticleNumbers] = useState(0);
  const [eventNumbers, setEventNumbers] = useState(0);

  useEffect(() => {
    if (!brandProfile) {
      return;
    }

    const fetchPageData = async () => {
      const [products, collections, articles, events] = await Promise.all([
        fetchProducts({
          filters: { brand_id: brandProfile?.id ?? "" },
          countOnly: true,
        }),
        fetchCollections({
          filters: { brand_id: brandProfile?.id ?? "" },
          countOnly: true,
        }),
        fetchArticles({
          filters: { brand_id: brandProfile?.id ?? "" },
          countOnly: true,
        }),
        fetchEvents({
          filters: { brand_id: brandProfile?.id ?? "" },
          countOnly: true,
        }),
      ]);

      setProductNumbers(
        Array.isArray(products) ? products.length : products ?? 0
      );
      setCollectionNumbers(
        Array.isArray(collections) ? collections.length : collections ?? 0
      );
      setArticleNumbers(
        Array.isArray(articles) ? articles.length : articles ?? 0
      );
      setEventNumbers(Array.isArray(events) ? events.length : events ?? 0);
    };

    fetchPageData();
  }, [brandProfile]);

  return (
    <>
      <div className="h-full">
        <div className="flex flex-col gap-2 h-full">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-center lg:text-left">
              Dashboard
            </h2>
          </div>
          <div className="space-y-4 grow">
            <div className="grid gap-4 grid-cols-2 xl:grid-cols-4 h-full">
              <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-4 flex flex-col items-center justify-center gap-3 rounded-lg h-full">
                <p className="text-lg">Total Products</p>
                {productNumbers === 0 ? (
                  <div className="w-28 h-36 bg-neutral-200 animate-pulse"></div>
                ) : (
                  <h3 className="text-9xl font-bold">{productNumbers}</h3>
                )}

                <Button asChild>
                  <Link href={"/brand-dashboard/products"}>View Products</Link>
                </Button>
              </div>
              <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-4 flex flex-col items-center justify-center gap-3 rounded-lg h-full">
                <p className="text-lg">Total Collections</p>
                {collectionNumbers === 0 ? (
                  <div className="w-28 h-36 bg-neutral-200 animate-pulse"></div>
                ) : (
                  <h3 className="text-9xl font-bold">{collectionNumbers}</h3>
                )}
                <Button asChild>
                  <Link href={"/brand-dashboard/collections"}>
                    View Collections
                  </Link>
                </Button>
              </div>
              <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-4 flex flex-col items-center justify-center gap-3 rounded-lg h-full">
                <p className="text-lg">Total Articles</p>
                {articleNumbers === 0 ? (
                  <div className="w-28 h-36 bg-neutral-200 animate-pulse"></div>
                ) : (
                  <h3 className="text-9xl font-bold">{articleNumbers}</h3>
                )}
                <Button asChild>
                  <Link href={"/brand-dashboard/articles"}>View Articles</Link>
                </Button>
              </div>
              <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-4 flex flex-col items-center justify-center gap-3 rounded-lg h-full">
                <p className="text-lg">Total Events</p>
                {eventNumbers === 0 ? (
                  <div className="w-28 h-36 bg-neutral-200 animate-pulse"></div>
                ) : (
                  <h3 className="text-9xl font-bold">{eventNumbers}</h3>
                )}
                <Button asChild>
                  <Link href={"/brand-dashboard/events"}>View Events</Link>
                </Button>
              </div>
            </div>
            {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
              <Card className="col-span-4 xl:col-span-5 dark:bg-neutral-900">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="w-full col-span-4 xl:col-span-3 dark:bg-neutral-900">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
