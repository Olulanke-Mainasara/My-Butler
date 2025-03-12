import React from "react";
import {
  BellIcon,
  Calendar,
  Home,
  Settings,
  ShoppingCart,
  Stars,
} from "lucide-react";
import {
  GiNewspaper,
  GiPaintBucket,
  GiPhotoCamera,
  GiShirt,
  GiShoppingCart,
  GiTicket,
} from "react-icons/gi";

export const groupedNavigation = [
  {
    id: "1",
    title: "Create & Explore",
    links: [
      {
        id: "1-1",
        url: "/?splashed=true",
        icon: React.createElement(Home),
        title: "Home",
      },
      {
        id: "1-2",
        url: "/butler",
        icon: React.createElement(Stars),
        title: "Butler Assistant",
      },
      {
        id: "1-3",
        url: "/outfits",
        icon: React.createElement(GiShirt),
        title: "Outfit Gallery",
      },
      {
        id: "1-4",
        url: "/combine",
        icon: React.createElement(GiPaintBucket),
        title: "Outfit Combiner",
      },
      {
        id: "1-5",
        url: "/camera",
        icon: React.createElement(GiPhotoCamera),
        title: "Take a Photo",
      },
    ],
  },
  {
    id: "2",
    title: "Shop & Events",
    links: [
      {
        id: "2-1",
        url: "/shop",
        icon: React.createElement(GiShoppingCart),
        title: "Shop Now",
      },
      {
        id: "2-2",
        url: "/events",
        icon: React.createElement(GiTicket),
        title: "Upcoming Events",
      },
    ],
  },
  {
    id: "3",
    title: "Stay Informed",
    links: [
      {
        id: "3-1",
        url: "/news",
        icon: React.createElement(GiNewspaper),
        title: "Latest News",
      },
    ],
  },
  {
    id: "4",
    title: "User Dashboard",
    links: [
      {
        id: "4-1",
        title: "Cart",
        url: "/cart",
        icon: React.createElement(ShoppingCart),
      },
      {
        id: "4-2",
        title: "Notifications",
        url: "/notifications",
        icon: React.createElement(BellIcon),
      },
      {
        id: "4-3",
        title: "Calendar",
        url: "/calendar",
        icon: React.createElement(Calendar),
      },
      {
        id: "4-4",
        title: "Settings",
        url: "/settings",
        icon: React.createElement(Settings),
      },
    ],
  },
];

export const navigation = [
  {
    id: "1",
    name: "",
    href: "/butler",
    icon: React.createElement(Stars),
  },
  {
    id: "2",
    name: "",
    href: "/outfits",
    icon: React.createElement(GiShirt),
  },
  {
    id: "3",
    name: "",
    href: "/combine",
    icon: React.createElement(GiPaintBucket),
  },
  {
    id: "4",
    name: "",
    href: "/camera",
    icon: React.createElement(GiPhotoCamera),
  },
  {
    id: "5",
    name: "",
    href: "/settings",
    icon: React.createElement(Settings),
  },
  {
    id: "6",
    name: "",
    href: "/news",
    icon: React.createElement(GiNewspaper),
  },
  {
    id: "7",
    name: "",
    href: "/shop",
    icon: React.createElement(GiShoppingCart),
  },
  {
    id: "8",
    name: "",
    href: "/events",
    icon: React.createElement(GiTicket),
  },
];
