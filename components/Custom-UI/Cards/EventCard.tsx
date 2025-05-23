import Image from "next/image";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/Shad-UI/card";
import { Event } from "@/types/Event";
import { Link } from "next-view-transitions";
import { ArrowRight } from "lucide-react";

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
      className={`hover:shadow-lg flex transition overflow-hidden ${
        form !== "carousel" ? "flex-row md:flex-col" : "flex-row"
      }`}
    >
      <Link
        href={item.slug + "&" + item.id}
        className="basis-1/2 overflow-hidden"
      >
        <Image
          src={item.display_image ?? "/placeholder.svg"}
          alt={item.title}
          width={600}
          height={300}
          className="w-full h-52 object-cover hover:scale-110 duration-300"
        />
      </Link>

      <CardContent className="flex flex-col gap-2 p-3 basis-1/2">
        <CardTitle className="text-2xl">{item.title}</CardTitle>

        <CardDescription>
          {item.description ?? "No description provided."}
        </CardDescription>

        <p>
          <span className="opacity-70">Location:</span>{" "}
          {item.is_virtual ? "Online Event" : item.location ?? "No location"}
        </p>

        <div className="flex flex-col text-sm">
          <p>
            <span className="opacity-70">Starts:</span>{" "}
            {new Date(item.start_date).toLocaleString()}
          </p>

          {item.end_date && (
            <p>
              <span className="opacity-70">Ends:</span>{" "}
              {new Date(item.end_date).toLocaleString()}
            </p>
          )}
        </div>

        <div>
          <Link
            href={`/items/${item.slug + "&" + item.id}`}
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
