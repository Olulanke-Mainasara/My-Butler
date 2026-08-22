import { GiShirt } from "react-icons/gi";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../Shad-UI/empty";
import LoadingSkeleton from "../Skeletons/LoadingSkeleton";
import { Product } from "@/types/system-types/Product";
import ProductCard from "../Cards/ProductCard";

const NewArrivalsSection = ({
  products,
  isLoadingProducts,
}: {
  products: Product[];
  isLoadingProducts: boolean;
}) => {
  return (
    <section className="space-y-6 px-4 md:px-5">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter">
        New Arrivals.
      </h2>

      {isLoadingProducts ? (
        <LoadingSkeleton length={4} height="md:h-[450px]" />
      ) : !products || products.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <GiShirt />
            </EmptyMedia>
            <EmptyTitle>No products yet</EmptyTitle>
            <EmptyDescription>
              Brands are still putting out their products. Check back soon.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-8">
          {products.slice(0, 8).map((product, index) => (
            <ProductCard item={product} key={index} />
          ))}
        </div>
      )}
    </section>
  );
};

export default NewArrivalsSection;
