"use client";
import BrandCard from "@/components/Custom-UI/Cards/BrandCard";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getBrands } from "@/lib/fetches";
import Image from "next/image";
import { Link } from "next-view-transitions";

const Brands = () => {
  const { data: brands } = useQuery(getBrands());

  const heroBrands = (brands ?? []).slice(0, 3);
  const brandCount = brands?.length ?? 0;

  const TextPanel = (
    <div className="rounded-2xl bg-darkBackground dark:bg-lightBackground text-white dark:text-black p-6 md:p-8 flex flex-col justify-center gap-3 md:col-span-2 md:row-span-2">
      <span className="text-xs font-medium uppercase tracking-wide opacity-60">
        The Directory
      </span>
      <h1 className="text-2xl md:text-4xl xl:text-5xl font-semibold leading-tight">
        One market,
        <br />
        every lane.
      </h1>
      <p className="text-sm md:text-base opacity-80 max-w-sm">
        {brandCount > 0
          ? `${brandCount} independent Nigerian brands, from streetwear to aso-oke to office-ready tailoring. No single aesthetic, no algorithm deciding for you.`
          : "Independent Nigerian brands, from streetwear to aso-oke to office-ready tailoring. No single aesthetic, no algorithm deciding for you."}
      </p>
    </div>
  );

  return (
    <main className="mt-19 flex flex-col h-full gap-4 md:gap-5">
      <section className="px-4 md:px-5">
        {heroBrands.length > 0 ? (
          <>
            {/* Mobile: text panel, then a row of thumbnails underneath */}
            <div className="flex flex-col gap-3 md:hidden">
              {TextPanel}
              <div className="grid grid-cols-3 gap-3 h-28">
                {heroBrands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brands/${brand.id}`}
                    prefetch={false}
                    className="relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900"
                  >
                    <Image
                      src={
                        brand.banner_image ??
                        brand.profile_picture ??
                        "/placeholder.svg"
                      }
                      alt={brand.name}
                      fill
                      sizes="33vw"
                      className="object-cover"
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-4 h-72 md:h-96 xl:h-128 rounded-2xl">
              {TextPanel}

              {heroBrands[0] && (
                <Link
                  href={`/brands/${heroBrands[0].id}`}
                  prefetch={false}
                  className="group relative row-start-1 col-start-3 col-span-2 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900"
                >
                  <Image
                    src={
                      heroBrands[0].banner_image ??
                      heroBrands[0].profile_picture ??
                      "/placeholder.svg"
                    }
                    alt={heroBrands[0].name}
                    fill
                    sizes="50vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </Link>
              )}

              {heroBrands[1] && (
                <Link
                  href={`/brands/${heroBrands[1].id}`}
                  prefetch={false}
                  className="group relative row-start-2 col-start-3 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900"
                >
                  <Image
                    src={
                      heroBrands[1].banner_image ??
                      heroBrands[1].profile_picture ??
                      "/placeholder.svg"
                    }
                    alt={heroBrands[1].name}
                    fill
                    sizes="25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </Link>
              )}

              {heroBrands[2] && (
                <Link
                  href={`/brands/${heroBrands[2].id}`}
                  prefetch={false}
                  className="group relative row-start-2 col-start-4 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900"
                >
                  <Image
                    src={
                      heroBrands[2].banner_image ??
                      heroBrands[2].profile_picture ??
                      "/placeholder.svg"
                    }
                    alt={heroBrands[2].name}
                    fill
                    sizes="25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-72 md:h-96 xl:h-128 rounded-2xl bg-darkBackground/5 dark:bg-lightBackground/5 animate-pulse" />
        )}
      </section>

      <section className="px-4 md:px-5 h-full">
        {!brands || brands.length === 0 ? (
          <LoadingSkeleton
            length={5}
            className="grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5"
          />
        ) : (
          <section className="pb-4 h-full overflow-y-scroll">
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {brands.map((brand) => (
                <BrandCard key={brand.id} item={brand} />
              ))}
            </section>
          </section>
        )}
      </section>
    </main>
  );
};
export default Brands;
