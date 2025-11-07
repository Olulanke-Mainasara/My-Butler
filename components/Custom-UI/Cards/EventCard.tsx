import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/Shad-UI/card";
import { Event } from "@/types/Event";
import { Link } from "next-view-transitions";
import {
  buildItemSlugId,
  convertRawDateToReadableDate,
  convertRawDateToReadableTime,
} from "@/lib/utils";

export default function EventCard({
  item,
  form,
}: {
  item?: Event;
  form?: "static" | "carousel";
}) {
  if (!item) {
    return;
  }

  return (
    <Card
      className={`relative overflow-hidden h-fit md:h-full bg-transparent dark:bg-transparent border-none p-0 gap-3 ${
        form !== "carousel" ? "flex flex-col" : "rounded-xl"
      }`}
    >
      <Link
        href={`/events/${buildItemSlugId(item.slug, item.id)}`}
        prefetch={false}
        className={`rounded-xl overflow-hidden h-44 ${
          form === "carousel" ? "md:h-full" : ""
        }`}
      >
        <Image
          src={item.display_image ?? "/placeholder.svg"}
          alt={item.title}
          width={500}
          height={300}
          className={`w-full h-full object-cover`}
        />
      </Link>

      <CardContent
        className={`flex flex-col justify-center gap-2 ${
          form === "carousel"
            ? "absolute inset-0 backdrop-brightness-50 text-white p-3"
            : "p-0"
        }`}
      >
        <p>
          <span className="opacity-70">Date:</span>{" "}
          {convertRawDateToReadableDate(item.start_date)}
        </p>

        <Link
          href={`/events/${buildItemSlugId(item.slug, item.id)}`}
          prefetch={false}
        >
          <CardTitle className="text-xl">{item.title}</CardTitle>
        </Link>

        <p>
          <span className="opacity-70">Location:</span>{" "}
          {item.is_virtual ? "Online Event" : item.location ?? "No location"}
        </p>

        <p>
          <span className="opacity-70">Time:</span>{" "}
          {convertRawDateToReadableTime(item.start_date)}
        </p>
      </CardContent>
    </Card>
  );
}
