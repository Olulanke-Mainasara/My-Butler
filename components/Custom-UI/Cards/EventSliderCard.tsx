import Image from "next/image";
import { Link } from "next-view-transitions";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/Shad-UI/badge";
import { Button } from "@/components/Shad-UI/button";
import { Event } from "@/types/Event";
import {
  buildItemSlugId,
  convertRawDateToReadableDate,
  convertRawDateToReadableTime,
} from "@/lib/utils";

export default function EventSliderCard({ item }: { item: Event }) {
  const eventLink = `/events/${buildItemSlugId(item.slug, item.id)}`;

  return (
    <Link
      href={eventLink}
      prefetch={false}
      className="relative block h-full w-full overflow-hidden rounded-xl text-white"
    >
      <Image
        className="object-cover"
        src={item.display_image || "/placeholder.svg"}
        fill
        sizes="(max-width: 767px) 85vw, 70vw"
        quality={90}
        alt={item.title}
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <Badge className="w-fit bg-white/10 text-white backdrop-blur-sm hover:bg-white/10">
          {convertRawDateToReadableDate(item.start_date)}
        </Badge>

        <div className="flex flex-col gap-2">
          <p className="text-3xl md:text-5xl">{item.title}</p>

          <p className="flex items-center gap-2 text-sm text-neutral-200">
            <MapPin className="size-4 shrink-0" />
            {item.is_virtual ? "Online Event" : item.location ?? "Location TBA"}
            <span className="text-neutral-400">·</span>
            <Clock className="size-4 shrink-0" />
            {convertRawDateToReadableTime(item.start_date)}
          </p>

          <Button className="mt-2 w-fit">
            View more <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
