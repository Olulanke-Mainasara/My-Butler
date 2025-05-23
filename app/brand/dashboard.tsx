"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Shad-UI/card";
import { Overview } from "./overview";
import { RecentSales } from "./resent-sales";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { useBrandProfile } from "@/components/Providers/UserProvider";

export default function DashboardPage() {
  const brandProfile = useBrandProfile();
  const [productNumbers, setProductNumbers] = useState(0);
  const [collectionNumbers, setCollectionNumbers] = useState(0);
  const [articleNumbers, setArticleNumbers] = useState(0);
  const [eventNumbers, setEventNumbers] = useState(0);

  const fetchMetrics = useCallback(async () => {
    if (!brandProfile) {
      toast.error("Brand profile not found.");
      return;
    }

    async function fetchProducts() {
      const { count, error } = await supabase
        .from("products")
        .select("id", {
          head: true,
          count: "estimated",
        })
        .eq("brand_id", brandProfile?.id ?? "");

      if (error) {
        toast.error("Failed to fetch products.");
        return;
      }

      setProductNumbers(count ?? 0);
    }

    async function fetchCollections() {
      const { count, error } = await supabase
        .from("collections")
        .select("id", {
          head: true,
          count: "estimated",
        })
        .eq("brand_id", brandProfile?.id ?? "");

      if (error) {
        toast.error("Failed to fetch collections.");
        return;
      }

      setCollectionNumbers(count ?? 0);
    }

    async function fetchArticles() {
      const { count, error } = await supabase
        .from("news")
        .select("id", {
          head: true,
          count: "estimated",
        })
        .eq("brand_id", brandProfile?.id ?? "");

      if (error) {
        toast.error("Failed to fetch articles.");
        return;
      }

      setArticleNumbers(count ?? 0);
    }

    async function fetchEvents() {
      const { count, error } = await supabase
        .from("events")
        .select("id", {
          head: true,
          count: "estimated",
        })
        .eq("brand_id", brandProfile?.id ?? "");

      if (error) {
        toast.error("Failed to fetch events.");
        return;
      }

      setEventNumbers(count ?? 0);
    }

    const promises = [
      fetchProducts,
      fetchCollections,
      fetchArticles,
      fetchEvents,
    ];
    await Promise.all(promises.map((promise) => promise()));
  }, [brandProfile]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <>
      <div className="flex-col md:flex">
        <div className="space-y-2 p-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-center lg:text-left">
              Dashboard
            </h2>
          </div>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="dark:bg-neutral-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Products
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{productNumbers}</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card className="dark:bg-neutral-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Collections
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{collectionNumbers}</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card className="dark:bg-neutral-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Articles
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{articleNumbers}</div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card className="dark:bg-neutral-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Events
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{eventNumbers}</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
