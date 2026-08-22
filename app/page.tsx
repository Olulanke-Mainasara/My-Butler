"use client";

import {
  getArticles,
  getBrands,
  getCollections,
  getEvents,
  getProducts,
} from "@/lib/fetches";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

import Footer from "@/components/Custom-UI/Footer";
import ShopByCategory from "@/components/Custom-UI/Home-Page/ShopByCategory";
import PagesBentoSection from "@/components/Custom-UI/Home-Page/PagesBentoSection";
import {
  MOCK_COLLECTIONS,
  MOCK_EVENTS,
  MOCK_ARTICLES,
  MOCK_BRANDS,
  MOCK_PRODUCTS,
} from "@/lib/mock-data";
import TopStoriesSection from "@/components/Custom-UI/Home-Page/TopStoriesSection";
import AnticipatedEventsSection from "@/components/Custom-UI/Home-Page/AnticipatedEventsSection";
import FeaturedBrandsSection from "@/components/Custom-UI/Home-Page/FeaturedBrandsSection";
import DiverseCollectionsSection from "@/components/Custom-UI/Home-Page/DiverseCollectionsSection";
import HeroSection from "@/components/Custom-UI/Home-Page/HeroSection";
import NewArrivalsSection from "@/components/Custom-UI/Home-Page/NewArrivalsSection";

export default function HomePage() {
  const { data: rawCollections, isLoading: isLoadingCollections } = useQuery(
    getCollections({ pageSize: 8 }),
  );
  const { data: rawEvents, isLoading: isLoadingEvents } = useQuery(
    getEvents({ pageSize: 4 }),
  );
  const { data: rawNews, isLoading: isLoadingNews } = useQuery(
    getArticles({ pageSize: 4 }),
  );
  const { data: rawBrands, isLoading: isLoadingBrands } = useQuery(
    getBrands({
      pageSize: 4,
    }),
  );
  const { data: rawProducts, isLoading: isLoadingProducts } = useQuery(
    getProducts({ pageSize: 8 }),
  );

  // Temporary: fall back to mock data when live data is empty/unreachable,
  const collections =
    rawCollections && rawCollections.length > 0
      ? rawCollections
      : MOCK_COLLECTIONS;
  const events = rawEvents && rawEvents.length > 0 ? rawEvents : MOCK_EVENTS;
  const news = rawNews && rawNews.length > 0 ? rawNews : MOCK_ARTICLES;
  const brands = rawBrands && rawBrands.length > 0 ? rawBrands : MOCK_BRANDS;
  const products =
    rawProducts && rawProducts.length > 0 ? rawProducts : MOCK_PRODUCTS;

  return (
    <>
      <div className="pb-5 space-y-16 md:space-y-20">
        <HeroSection collections={collections} />

        <ShopByCategory />

        <NewArrivalsSection
          products={products}
          isLoadingProducts={isLoadingProducts}
        />

        <DiverseCollectionsSection
          collections={collections}
          isLoadingCollections={isLoadingCollections}
        />

        <FeaturedBrandsSection
          brands={brands}
          isLoadingBrands={isLoadingBrands}
        />

        <AnticipatedEventsSection
          events={events}
          isLoadingEvents={isLoadingEvents}
        />

        <PagesBentoSection />

        <TopStoriesSection news={news} isLoadingNews={isLoadingNews} />
      </div>
      <Footer />
    </>
  );
}
