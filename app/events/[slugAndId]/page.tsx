"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Video,
  Ticket,
  Share2,
} from "lucide-react";
import { Button } from "@/components/Shad-UI/button";
import { Badge } from "@/components/Shad-UI/badge";
import { Card, CardContent } from "@/components/Shad-UI/card";
import { usePathname } from "next/navigation";
import { getItemId } from "@/lib/utils";
import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
import { getEvent } from "@/lib/fetches";
import { Icons } from "@/components/Custom-UI/icons";
import AddToBookmarks from "@/components/Custom-UI/Buttons/AddToBookmarks";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

// Mock data - replace with actual data fetching

export default function EventPage() {
  const pathname = usePathname();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const eventId = getItemId(pathname.split("/").pop() || "");
  const router = useTransitionRouter();

  const { data: event, isError } = useQuery(getEvent(eventId || ""), {
    enabled: !!eventId,
  });

  if (!eventId) {
    toast.error("Event ID is missing.");
    router.push("/events");
    return;
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="w-6 h-6 animate-spin" /> Loading
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to load event");
    router.push("/events");
    return;
  }

  const handleRegister = async () => {
    setIsRegistering(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRegistered(true);
    setIsRegistering(false);
  };

  const startDate = new Date(event.start_date || "");
  const endDate = new Date(event.end_date || "");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <Image
          src={event.display_image || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-black/70" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto px-4">
            <div className={`max-w-3xl text-white`}>
              <div className="flex items-center gap-3 mb-6">
                <Badge className="border border-neutral-600 text-sm px-3 py-1">
                  {event.is_virtual ? (
                    <>
                      <Video className="w-4 h-4 mr-2" />
                      Virtual Event
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 mr-2" />
                      In-Person Event
                    </>
                  )}
                </Badge>
                <Badge className="border border-neutral-600 text-sm px-3 py-1">
                  Registration Open
                </Badge>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {event.title}
              </h1>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-neutral-300"
                  onClick={handleRegister}
                  disabled={isRegistering || isRegistered}
                >
                  {isRegistering ? (
                    <Icons.spinner className="w-5 h-5 animate-spin" />
                  ) : isRegistered ? (
                    <Ticket className="w-5 h-5" />
                  ) : (
                    <Ticket className="w-5 h-5" />
                  )}
                  {isRegistered
                    ? "Registered!"
                    : isRegistering
                    ? "Registering..."
                    : "Register Now"}
                </Button>

                <Button size="icon" className="border hover:bg-neutral-600">
                  <Share2 className="w-5 h-5" />
                </Button>

                <AddToBookmarks item={event} targetType="event" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Quick Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16 -mt-24 relative z-10">
            {[
              {
                icon: Calendar,
                title: "Date & Time",
                content: startDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
                detail: `${startDate.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })} - ${endDate.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}`,
              },
              {
                icon: MapPin,
                title: "Location",
                content: event.location,
                detail: event.is_virtual
                  ? "Limited to Google Meet"
                  : event.parking_available
                  ? "Parking available on-site"
                  : "Limited parking available",
              },
              {
                icon: Users,
                title: "Capacity",
                subtitle: "Expected Attendance",
                content: `${event.capacity}+ attendees`,
                detail:
                  event.registration_basis || "First come, first served basis",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className={`dark:bg-neutral-900`}
                style={{ transitionDelay: `${800 + index * 200}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <item.icon
                        className={`w-6 h-6 transition-transform duration-300 hover:scale-110`}
                      />
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                    </div>
                  </div>
                  <p className="font-medium">{item.content}</p>
                  <p className="text-neutral-600 text-sm">{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Event Description */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div
                className={`rounded-xl md:p-12 shadow-sm md:border hover:shadow-md`}
              >
                <h2 className="text-3xl font-bold mb-6">About This Event</h2>
                <div className="prose prose-lg max-w-none leading-relaxed space-y-6">
                  <p className="animate-in fade-in duration-700 delay-1600">
                    {event.description}
                  </p>

                  <h3 className="text-xl font-semibold mt-8 mb-4">
                    What to Expect
                  </h3>
                  <ul className="space-y-3">
                    {event.what_to_expect?.map((item, index) => (
                      <li
                        key={index}
                        className={`flex items-start gap-3 animate-in slide-in-from-left duration-500`}
                        style={{ animationDelay: `${2000 + index * 100}ms` }}
                      >
                        <div className="w-2 h-2 bg-neutral-400 rounded-full mt-2 transition-transform duration-300 hover:scale-150"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-xl font-semibold mt-8 mb-4">
                    Featured Speakers
                  </h3>
                  <p className="animate-in fade-in duration-700 delay-2700">
                    {event.featured_speakers_description}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className={`dark:bg-neutral-900`}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Event Highlights</h3>
                  <div className="space-y-4">
                    {[
                      event.duration_hours && {
                        icon: React.createElement(Clock, {
                          className: "w-5 h-5",
                        }),
                        text: `${event.duration_hours} hours of content`,
                      },
                      event.exhibitor_count && {
                        icon: React.createElement(Users, {
                          className: "w-5 h-5",
                        }),
                        text: `${event.exhibitor_count}+ exhibitors`,
                      },
                      {
                        icon: React.createElement(Ticket, {
                          className: "w-5 h-5",
                        }),
                        text:
                          event.admission_price === 0 || !event.admission_price
                            ? "Free admission"
                            : `$${event.admission_price} admission`,
                      },
                    ]
                      .filter((item) => item !== null && item !== 0)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                          {item.icon}
                          <span>{item.text}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className={`dark:bg-neutral-900`}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">
                    {isRegistered ? "You're Registered!" : "Register Now"}
                  </h3>
                  <p className="mb-6">
                    {isRegistered
                      ? "Thank you for registering! We'll send you event updates and reminders."
                      : "Secure your spot at this exclusive event. Registration is free but space is limited."}
                  </p>

                  <Button onClick={handleRegister} disabled={isRegistering}>
                    {isRegistering ? (
                      <Icons.spinner className="w-4 h-4 animate-spin" />
                    ) : (
                      <Ticket className="w-4 h-4" />
                    )}
                    {isRegistering ? "Registering..." : "Register for Free"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
