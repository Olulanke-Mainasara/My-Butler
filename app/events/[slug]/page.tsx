"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Video,
  Ticket,
  Share2,
  Bell,
} from "lucide-react";
import { Button } from "@/components/Shad-UI/button";
import { Badge } from "@/components/Shad-UI/badge";
import { Card, CardContent } from "@/components/Shad-UI/card";

// Mock data - replace with actual data fetching
const mockEvent = {
  brand_id: "brand-123",
  created_at: "2024-01-10T12:00:00Z",
  description:
    "Join us for an exclusive showcase of the latest innovations in wireless audio technology. Experience hands-on demonstrations, meet industry experts, and be among the first to discover groundbreaking products that will shape the future of audio.",
  display_image: "/placeholder.svg?height=600&width=1200",
  end_date: "2024-03-15T18:00:00Z",
  id: "event-123",
  is_virtual: false,
  location: "Tech Convention Center, San Francisco, CA",
  start_date: "2024-03-15T10:00:00Z",
  title: "Future of Audio: Innovation Showcase 2024",
  updated_at: "2024-01-20T09:30:00Z",
};

export default function EventPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);

  const startDate = new Date(mockEvent.start_date || "");
  const endDate = new Date(mockEvent.end_date || "");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleRegister = async () => {
    setIsRegistering(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRegistered(true);
    setIsRegistering(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <Image
          src={mockEvent.display_image || "/placeholder.svg"}
          alt={mockEvent.title}
          fill
          className="object-cover transition-transform duration-[10s] hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-900/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div
              className={`max-w-3xl text-white transition-all duration-1000 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1 animate-in slide-in-from-left duration-700 delay-300">
                  {mockEvent.is_virtual ? (
                    <>
                      <Video className="w-4 h-4 mr-2" />
                      Virtual Event
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 mr-2" />
                      In-Person
                    </>
                  )}
                </Badge>
                <Badge className="bg-green-500/20 text-green-100 border-green-400/30 text-sm px-3 py-1 animate-in slide-in-from-left duration-700 delay-400">
                  Registration Open
                </Badge>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-in slide-in-from-left duration-700 delay-500">
                {mockEvent.title}
              </h1>

              <div className="flex flex-wrap gap-4 animate-in slide-in-from-left duration-700 delay-700">
                <Button
                  size="lg"
                  className="bg-white text-purple-900 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  onClick={handleRegister}
                  disabled={isRegistering || isRegistered}
                >
                  {isRegistering ? (
                    <div className="w-5 h-5 border-2 border-purple-900 border-t-transparent rounded-full animate-spin mr-2" />
                  ) : isRegistered ? (
                    <Ticket className="w-5 h-5 mr-2" />
                  ) : (
                    <Ticket className="w-5 h-5 mr-2" />
                  )}
                  {isRegistered
                    ? "Registered!"
                    : isRegistering
                    ? "Registering..."
                    : "Register Now"}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 bg-transparent"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Quick Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16 -mt-24 relative z-10">
            {[
              {
                icon: Calendar,
                title: "Date & Time",
                subtitle: "Event Schedule",
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
                color: "purple",
              },
              {
                icon: MapPin,
                title: "Location",
                subtitle: "Event Venue",
                content: mockEvent.location,
                detail: "Parking available on-site",
                color: "indigo",
              },
              {
                icon: Users,
                title: "Capacity",
                subtitle: "Expected Attendance",
                content: "500+ Attendees",
                detail: "Limited seats available",
                color: "green",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className={`bg-white/95 backdrop-blur-sm shadow-xl border-0 transition-all duration-700 hover:shadow-2xl hover:scale-105 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${800 + index * 200}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-12 h-12 bg-${item.color}-100 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110`}
                    >
                      <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">{item.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-gray-900 font-medium">{item.content}</p>
                  <p className="text-gray-600 text-sm">{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Event Description */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div
                className={`bg-white rounded-3xl p-8 md:p-12 shadow-sm border transition-all duration-1000 hover:shadow-md ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-in slide-in-from-left duration-700 delay-1400">
                  About This Event
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                  <p className="animate-in fade-in duration-700 delay-1600">
                    Experience the cutting edge of audio technology at our
                    exclusive innovation showcase. This premier event brings
                    together industry leaders, innovative startups, and audio
                    enthusiasts for a day of discovery and networking.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 animate-in slide-in-from-left duration-700 delay-1800">
                    What to Expect
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Live product demonstrations from leading audio brands",
                      "Keynote presentations from industry experts",
                      "Hands-on experience with unreleased products",
                      "Networking opportunities with fellow enthusiasts",
                      "Exclusive discounts on featured products",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className={`flex items-start gap-3 animate-in slide-in-from-left duration-500`}
                        style={{ animationDelay: `${2000 + index * 100}ms` }}
                      >
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 transition-transform duration-300 hover:scale-150"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 animate-in slide-in-from-left duration-700 delay-2500">
                    Featured Speakers
                  </h3>
                  <p className="animate-in fade-in duration-700 delay-2700">
                    Join renowned audio engineers, product designers, and
                    technology innovators as they share insights into the future
                    of wireless audio, spatial sound, and sustainable design
                    practices.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card
                className={`bg-gradient-to-br from-purple-50 to-indigo-50 border-0 transition-all duration-1000 hover:shadow-lg hover:scale-105 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Event Highlights
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: Clock, text: "8 hours of content" },
                      { icon: Users, text: "20+ exhibitors" },
                      { icon: Ticket, text: "Free admission" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 transition-all duration-300 hover:scale-105 cursor-pointer"
                      >
                        <item.icon className="w-5 h-5 text-purple-600" />
                        <span className="text-gray-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`bg-white border-0 shadow-sm transition-all duration-1000 hover:shadow-lg hover:scale-105 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {isRegistered ? "You're Registered!" : "Register Now"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {isRegistered
                      ? "Thank you for registering! We'll send you event updates and reminders."
                      : "Secure your spot at this exclusive event. Registration is free but space is limited."}
                  </p>

                  {isRegistered ? (
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105"
                        disabled
                      >
                        <Ticket className="w-4 h-4 mr-2" />
                        Registration Confirmed
                      </Button>
                      <Button
                        variant="outline"
                        className={`w-full transition-all duration-300 hover:scale-105 ${
                          reminderSet
                            ? "bg-blue-50 text-blue-600 border-blue-300"
                            : ""
                        }`}
                        onClick={() => setReminderSet(!reminderSet)}
                      >
                        <Bell
                          className={`w-4 h-4 mr-2 transition-all duration-300 ${
                            reminderSet ? "animate-pulse" : ""
                          }`}
                        />
                        {reminderSet ? "Reminder Set" : "Set Reminder"}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      onClick={handleRegister}
                      disabled={isRegistering}
                    >
                      {isRegistering ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Ticket className="w-4 h-4 mr-2" />
                      )}
                      {isRegistering ? "Registering..." : "Register for Free"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
