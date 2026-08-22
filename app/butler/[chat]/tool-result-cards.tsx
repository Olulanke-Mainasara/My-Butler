import Image from "next/image";
import { Link } from "next-view-transitions";
import { MapPin } from "lucide-react";
import { buildItemSlugId, convertRawPriceToReadablePrice } from "@/lib/utils";

type ProductResult = {
  id: string;
  slug: string;
  name: string;
  price: number;
  stock_quantity: number;
  product_images: string[] | null;
};

type CollectionResult = {
  id: string;
  slug: string;
  name: string;
  display_image: string | null;
};

type EventResult = {
  id: string;
  slug: string;
  title: string;
  start_date: string;
  location: string | null;
  is_virtual: boolean;
  display_image: string | null;
};

type BrandResult = {
  id: string;
  name: string;
  location: string | null;
  profile_picture: string | null;
};

function ResultRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-none py-1 -mx-1 px-1">
      {children}
    </div>
  );
}

function ResultCard({
  href,
  image,
  title,
  subtitle,
}: {
  href: string;
  image: string | null;
  title: string;
  subtitle?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="shrink-0 w-40 rounded-xl border overflow-hidden hover:shadow-md transition-shadow duration-300 bg-background"
    >
      <div className="relative w-full aspect-square bg-neutral-100 dark:bg-neutral-800">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-2 space-y-0.5">
        <p className="text-sm font-medium line-clamp-1">{title}</p>
        {subtitle && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {subtitle}
          </p>
        )}
      </div>
    </Link>
  );
}

export function ProductResults({ products }: { products: ProductResult[] }) {
  if (!products.length) return null;
  return (
    <ResultRow>
      {products.map((product) => (
        <ResultCard
          key={product.id}
          href={`/shop/${buildItemSlugId(product.slug, product.id)}`}
          image={product.product_images?.[0] ?? null}
          title={product.name}
          subtitle={
            <span className="flex items-center gap-1">
              {convertRawPriceToReadablePrice(product.price)}
              {product.stock_quantity <= 0 && (
                <span className="text-red-500">· Out of stock</span>
              )}
            </span>
          }
        />
      ))}
    </ResultRow>
  );
}

export function CollectionResults({
  collections,
}: {
  collections: CollectionResult[];
}) {
  if (!collections.length) return null;
  return (
    <ResultRow>
      {collections.map((collection) => (
        <ResultCard
          key={collection.id}
          href={`/collections/${buildItemSlugId(collection.slug, collection.id)}`}
          image={collection.display_image}
          title={collection.name}
        />
      ))}
    </ResultRow>
  );
}

export function EventResults({ events }: { events: EventResult[] }) {
  if (!events.length) return null;
  return (
    <ResultRow>
      {events.map((event) => (
        <ResultCard
          key={event.id}
          href={`/events/${buildItemSlugId(event.slug, event.id)}`}
          image={event.display_image}
          title={event.title}
          subtitle={
            event.is_virtual
              ? "Virtual"
              : event.location ||
                new Date(event.start_date).toLocaleDateString()
          }
        />
      ))}
    </ResultRow>
  );
}

export function BrandResults({ brands }: { brands: BrandResult[] }) {
  if (!brands.length) return null;
  return (
    <ResultRow>
      {brands.map((brand) => (
        <ResultCard
          key={brand.id}
          href={`/brands/${brand.id}`}
          image={brand.profile_picture}
          title={brand.name}
          subtitle={
            brand.location ? (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {brand.location}
              </span>
            ) : undefined
          }
        />
      ))}
    </ResultRow>
  );
}
