import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/Shad-UI/card";
import { Event } from "@/types/Event";
import { Link } from "next-view-transitions";
import { ArrowRight } from "lucide-react";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { useBookmarks } from "@/components/Providers/AllProviders";
import BookmarkTrigger from "../Buttons/BookmarkTrigger";
import {
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
  const customerProfile = useCustomerProfile();
  const bookmarks = useBookmarks();

  if (!item) {
    return;
  }

  return (
    <Card
      className={`relative rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full`}
    >
      <Link href={item.slug + "&" + item.id} prefetch={false}>
        <Image
          src={item.display_image ?? "/placeholder.svg"}
          alt={item.title}
          width={500}
          height={300}
          className={`w-full object-cover ${
            form === "carousel" ? "h-full" : ""
          }`}
        />
      </Link>

      <CardContent
        className={`p-3 flex flex-col justify-center gap-2 ${
          form === "carousel"
            ? "absolute inset-0 backdrop-brightness-50 text-white"
            : ""
        }`}
      >
        <CardTitle className="md:text-xl">{item.title}</CardTitle>

        <p>
          <span className="opacity-70">Location:</span>{" "}
          {item.is_virtual ? "Online Event" : item.location ?? "No location"}
        </p>

        <p>
          <span className="opacity-70">Date:</span>{" "}
          {convertRawDateToReadableDate(item.start_date)}
        </p>

        <p>
          <span className="opacity-70">Time:</span>{" "}
          {convertRawDateToReadableTime(item.start_date)}
        </p>

        <div className="flex items-center gap-2">
          <BookmarkTrigger
            customerProfile={customerProfile}
            item={item}
            bookmarks={bookmarks}
            targetType={"event"}
          />

          <Link
            href={`/events/${item.slug + "&" + item.id}`}
            prefetch={false}
            className="hover:underline flex items-center gap-1 text-sm"
          >
            View Details
            <span className="opacity-70">
              <ArrowRight />
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
