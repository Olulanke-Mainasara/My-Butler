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
import { useBrandProfile } from "@/components/Providers/UserProvider";
import { Link } from "next-view-transitions";
import { Button } from "@/components/Shad-UI/button";
import {
  getArticlesCount,
  getCollectionsCount,
  getEventsCount,
  getProductsCount,
} from "@/lib/fetches";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export default function DashboardPage() {
  const brandProfile = useBrandProfile();

  const { count: productNumbers } = useQuery(
    getProductsCount().eq("brand_id", brandProfile?.id || ""),
    {
      enabled: !!brandProfile?.id,
    }
  );
  const { count: collectionNumbers } = useQuery(
    getCollectionsCount().eq("brand_id", brandProfile?.id || ""),
    {
      enabled: !!brandProfile?.id,
    }
  );
  const { count: articleNumbers } = useQuery(
    getArticlesCount().eq("brand_id", brandProfile?.id || ""),
    {
      enabled: !!brandProfile?.id,
    }
  );
  const { count: eventNumbers } = useQuery(
    getEventsCount().eq("brand_id", brandProfile?.id || ""),
    {
      enabled: !!brandProfile?.id,
    }
  );

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
