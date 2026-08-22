import Image from "next/image";
import { Link } from "next-view-transitions";
import { Collection } from "@/types/system-types/Collection";
import { buildItemSlugId } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function CollectionCard({ item }: { item?: Collection }) {
  const pathname = usePathname();

  if (!item) {
    return;
  }

  const relevantLink = pathname.startsWith("/brand-dashboard")
    ? `/brand-dashboard/collections/${buildItemSlugId(item.slug, item.id)}`
    : `/collections/${buildItemSlugId(item.slug, item.id)}`;

  return (
    <div>
      <Link href={relevantLink} prefetch={false} className="space-y-5">
        <div className="relative h-96 w-full rounded-xl overflow-hidden">
          <Image
            src={item.display_image ?? "/placeholder.svg"}
            alt={item.name}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-1">
          <p className="md:text-xl">{item.name}</p>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
      </Link>
    </div>
  );
}
