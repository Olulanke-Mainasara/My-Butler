import LoadingSkeleton from "../Skeletons/LoadingSkeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/Shad-UI/empty";
import { GiNewspaper } from "react-icons/gi";
import ArticleCard from "../Cards/ArticleCard";
import { Article } from "@/types/system-types/Article";
import { Button } from "@/components/Shad-UI/button";
import { Link } from "next-view-transitions";

const TopStoriesSection = ({
  news,
  isLoadingNews,
}: {
  news: Article[];
  isLoadingNews: boolean;
}) => {
  return (
    <section className="space-y-4 px-4 md:px-5">
      <div className="flex items-center justify-between gap-5">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter">
          Top Stories.
        </h2>
        <Button variant="outline" asChild>
          <Link href="/news">View More</Link>
        </Button>
      </div>

      {isLoadingNews ? (
        <LoadingSkeleton
          length={4}
          height="md:h-96"
          className="md:grid-cols-3 xl:grid-cols-4"
        />
      ) : !news || news.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <GiNewspaper />
            </EmptyMedia>
            <EmptyTitle>No stories yet</EmptyTitle>
            <EmptyDescription>
              Fashion news and brand updates will land here first.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-8">
          {news.slice(0, 4).map((newsItem, index) => (
            <ArticleCard item={newsItem} key={index} />
          ))}
        </div>
      )}
    </section>
  );
};

export default TopStoriesSection;
