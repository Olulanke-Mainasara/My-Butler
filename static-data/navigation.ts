import React from "react";
import {
  BellIcon,
  Calendar,
  ForkKnifeCrossed,
  Home,
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
        title: "Butler A.I",
      },
      {
        id: "1-3",
        url: "/collections",
        icon: React.createElement(GiShirt),
        title: "Collection Gallery",
      },
      {
        id: "1-4",
        url: "/combine",
        icon: React.createElement(GiPaintBucket),
        title: "Outfit Creator",
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
        url: "/food",
        icon: React.createElement(ForkKnifeCrossed),
        title: "Tasty Cuisine",
      },
    ],
  },
  {
    id: "3",
    title: "Stay Active",
    links: [
      {
        id: "3-1",
        url: "/news",
        icon: React.createElement(GiNewspaper),
        title: "Latest News",
      },
      {
        id: "3-2",
        url: "/events",
        icon: React.createElement(GiTicket),
        title: "Upcoming Events",
      },
    ],
  },
  {
    id: "4",
    title: "User Dashboard",
    links: [
      {
        id: "4-1",
        title: "Your Cart",
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
    ],
  },
];

export const navigation = [
  {
    id: "1",
    name: "Butler A.I",
    href: "/butler",
    icon: React.createElement(Stars),
  },
  {
    id: "2",
    name: "Collections",
    href: "/collections",
    icon: React.createElement(GiShirt),
  },
  {
    id: "3",
    name: "Outfit Creator",
    href: "/combine",
    icon: React.createElement(GiPaintBucket),
  },
  {
    id: "4",
    name: "Camera",
    href: "/camera",
    icon: React.createElement(GiPhotoCamera),
  },
  {
    id: "5",
    name: "Food",
    href: "/food",
    icon: React.createElement(ForkKnifeCrossed),
  },
  {
    id: "6",
    name: "News",
    href: "/news",
    icon: React.createElement(GiNewspaper),
  },
  {
    id: "7",
    name: "Shop",
    href: "/shop",
    icon: React.createElement(GiShoppingCart),
  },
  {
    id: "8",
    name: "Events",
    href: "/events",
    icon: React.createElement(GiTicket),
  },
];
