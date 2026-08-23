import { Button } from "@/components/Shad-UI/button";
import { GiShirt } from "react-icons/gi";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../Shad-UI/empty";
import LoadingSkeleton from "../Skeletons/LoadingSkeleton";
import CollectionCard from "../Cards/CollectionCard";
import { Collection } from "@/types/system-types/Collection";
import { Link } from "next-view-transitions";

const DiverseCollectionsSection = ({
  collections,
  isLoadingCollections,
}: {
  collections: Collection[];
  isLoadingCollections: boolean;
}) => {
  return (
    <section className="space-y-6 px-4 md:px-5">
      <div className="flex items-center justify-center gap-5">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter">
          Diverse Collections.
        </h2>
        <Button variant="outline" asChild>
          <Link href="/collections">View More</Link>
        </Button>
      </div>

      {isLoadingCollections ? (
        <LoadingSkeleton
          length={3}
          className="xl:grid-cols-3"
          height="h-96 xl:h-130"
        />
      ) : !collections || collections.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <GiShirt />
            </EmptyMedia>
            <EmptyTitle>No collections yet</EmptyTitle>
            <EmptyDescription>
              Brands are still building out their collections. Check back soon.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 xl:gap-8">
          {collections.slice(0, 8).map((collection, index) => (
            <CollectionCard item={collection} key={index} />
          ))}
        </div>
      )}
    </section>
  );
};

export default DiverseCollectionsSection;
