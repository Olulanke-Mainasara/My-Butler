import { ArrowRight, Factory } from "lucide-react";
import { Link } from "next-view-transitions";
import { Brand } from "@/types/system-types/Brand";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { Button } from "@/components/Shad-UI/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/Shad-UI/empty";
import Image from "next/image";

const FeaturedBrandsSection = ({
  brands,
  isLoadingBrands,
}: {
  brands: Brand[];
  isLoadingBrands: boolean;
}) => {
  return (
    <section className="flex items-center justify-center">
      <div className="w-full max-w-(--breakpoint-xl) mx-auto px-4 md:px-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter">
            Brands Worth <br className="hidden md:block" />
            Discovering.
          </h2>
          <Link
            href="/brands"
            className="uppercase flex items-center gap-2 font-semibold"
          >
            see all{" "}
            <ArrowRight className="text-brandLight dark:text-brandDark" />
          </Link>
        </div>

        {isLoadingBrands ? (
          <LoadingSkeleton length={1} className="md:grid-cols-1 mt-8" />
        ) : !brands || brands.length === 0 ? (
          <Empty className="border mt-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Factory />
              </EmptyMedia>
              <EmptyTitle>No brands yet</EmptyTitle>
              <EmptyDescription>
                Vetted brands will be featured here as they join the platform.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          (() => {
            const featured = brands.slice(0, 4);
            const rows: [Brand, Brand | undefined][] = (
              [
                [featured[0], featured[1]],
                [featured[2], featured[3]],
              ] as [Brand | undefined, Brand | undefined][]
            ).filter(
              (row): row is [Brand, Brand | undefined] => row[0] !== undefined,
            );

            return rows.map(([brandA, brandB], rowIndex) => (
              <div
                key={rowIndex}
                className="mt-8 grid sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-3 gap-6 md:gap-20 items-center md:mb-20 last:mb-0"
              >
                <div className="bg-muted rounded-xl lg:p-6 col-span-1 md:col-span-2 lg:col-span-1">
                  <div className="md:hidden mb-6 aspect-video w-full bg-background rounded-xl overflow-hidden">
                    <Image
                      src={brandA.profile_picture || "/placeholder.svg"}
                      alt={brandA.name}
                      width={500}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <span className="text-3xl font-semibold tracking-tight">
                    {brandA.name}
                  </span>

                  <div className="flex items-start gap-3 mt-6">
                    <Factory className="shrink-0 text-brandLight dark:text-brandDark" />
                    <p className="-mt-0.5 text-xl md:text-base xl:text-2xl line-clamp-3">
                      {brandA.description}
                    </p>
                  </div>

                  <Link href={`/brands/${brandA.id}`}>
                    <Button className="mt-8 w-full py-6 text-lg cursor-pointer">
                      Visit brand{" "}
                      <ArrowRight className="size-6 text-brandLight dark:text-brandDark" />
                    </Button>
                  </Link>
                </div>

                <div className="hidden md:block bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2 overflow-hidden h-137.5 relative">
                  <Image
                    src={brandA.profile_picture || "/placeholder.svg"}
                    alt={brandA.name}
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                </div>

                {brandB && (
                  <>
                    <div className="hidden md:block bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2 overflow-hidden h-137.5 relative">
                      <Image
                        src={brandB.profile_picture || "/placeholder.svg"}
                        alt={brandB.name}
                        fill
                        sizes="33vw"
                        className="object-cover"
                      />
                    </div>

                    <div className="bg-muted rounded-xl p-4 lg:p-6 col-span-1 md:col-span-2 lg:col-span-1">
                      <div className="md:hidden mb-6 aspect-video w-full bg-background rounded-xl overflow-hidden">
                        <Image
                          src={brandB.profile_picture || "/placeholder.svg"}
                          alt={brandB.name}
                          width={500}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <span className="text-3xl font-semibold tracking-tight">
                        {brandB.name}
                      </span>

                      <div className="flex items-start gap-3 mt-6">
                        <Factory className="shrink-0 text-brandLight dark:text-brandDark" />
                        <p className="-mt-0.5 text-xl md:text-base xl:text-2xl line-clamp-3">
                          {brandB.description}
                        </p>
                      </div>

                      <Link href={`/brands/${brandB.id}`}>
                        <Button className="mt-8 w-full py-6 text-lg cursor-pointer">
                          Visit brand{" "}
                          <ArrowRight className="size-6 text-brandLight dark:text-brandDark" />
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            ));
          })()
        )}
      </div>
    </section>
  );
};

export default FeaturedBrandsSection;
