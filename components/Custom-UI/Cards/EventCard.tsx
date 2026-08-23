import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/Shad-UI/card";
import { Event } from "@/types/system-types/Event";
import { Link } from "next-view-transitions";
import {
  buildItemSlugId,
  convertRawDateToReadableDate,
  convertRawDateToReadableTime,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Clock, MapPin, Wifi } from "lucide-react";

export default function EventCard({
  item,
  form,
}: {
  item?: Event;
  form?: "static" | "carousel";
}) {
  const pathname = usePathname();

  if (!item) {
    return;
  }

  const relevantLink = pathname.startsWith("/brand-dashboard")
    ? `/brand-dashboard/events/${buildItemSlugId(item.slug, item.id)}`
    : `/events/${buildItemSlugId(item.slug, item.id)}`;

  const startDate = new Date(item.start_date);
  const badgeMonth = startDate.toLocaleDateString("en-US", { month: "short" });
  const badgeDay = startDate.getDate();

  const DateBadge = (
    <div className="absolute top-2 left-2 rounded-lg bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm px-2.5 py-1 text-center leading-none shadow-sm">
      <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {badgeMonth}
      </p>
      <p className="text-base font-semibold text-neutral-900 dark:text-white">
        {badgeDay}
      </p>
    </div>
  );

  const WhereRow = item.is_virtual ? (
    <span className="flex items-center gap-1.5">
      <Wifi size={14} className="shrink-0" />
      Online event
    </span>
  ) : (
    <span className="flex items-center gap-1.5 truncate">
      <MapPin size={14} className="shrink-0" />
      <span className="truncate">{item.location ?? "No location"}</span>
    </span>
  );

  if (form === "carousel") {
    return (
      <Card className="group relative overflow-hidden h-full rounded-xl border-none shadow-none p-0 gap-0 bg-transparent dark:bg-transparent">
        <Link
          href={relevantLink}
          prefetch={false}
          className="relative block w-full h-full"
        >
          <Image
            src={item.display_image ?? "/placeholder.svg"}
            alt={item.title}
            width={500}
            height={300}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          {DateBadge}
          <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col gap-1 text-white">
            <CardTitle className="text-base leading-snug line-clamp-2">
              {item.title}
            </CardTitle>
            <p className="flex items-center gap-1.5 text-xs opacity-90">
              {WhereRow}
            </p>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden h-fit flex flex-col bg-transparent dark:bg-transparent border-none shadow-none p-0 gap-0">
      <Link
        href={relevantLink}
        prefetch={false}
        className="relative block rounded-xl overflow-hidden aspect-4/3"
      >
        <Image
          src={item.display_image ?? "/placeholder.svg"}
          alt={item.title}
          width={500}
          height={300}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {DateBadge}
      </Link>

      <CardContent className="p-0 pt-3 flex flex-col gap-1.5">
        <Link href={relevantLink} prefetch={false}>
          <CardTitle className="text-lg leading-snug line-clamp-2">
            {item.title}
          </CardTitle>
        </Link>
        <p className="text-sm opacity-70">{WhereRow}</p>
        <p className="flex items-center gap-1.5 text-sm opacity-70">
          <Clock size={14} className="shrink-0" />
          {convertRawDateToReadableTime(item.start_date)}
          <span className="opacity-50">
            · {convertRawDateToReadableDate(item.start_date)}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
