import React from "react";
import {
  BellIcon,
  Calendar,
  Home,
  ShoppingCart,
  Stars,
  User,
  UserCircle,
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
        url: "/combine",
        icon: React.createElement(GiPaintBucket),
        title: "Outfit Creator",
      },
      {
        id: "1-4",
        url: "/camera",
        icon: React.createElement(GiPhotoCamera),
        title: "Take a Photo",
      },
    ],
  },
  {
    id: "2",
    title: "Stay Active",
    links: [
      {
        id: "3-1",
        url: "/shop",
        icon: React.createElement(GiShoppingCart),
        title: "Shop Now",
      },
      {
        id: "3-2",
        url: "/news",
        icon: React.createElement(GiNewspaper),
        title: "Latest News",
      },
      {
        id: "3-3",
        url: "/events",
        icon: React.createElement(GiTicket),
        title: "Upcoming Events",
      },
      {
        id: "3-4",
        url: "/collections",
        icon: React.createElement(GiShirt),
        title: "Collection Gallery",
      },
    ],
  },
  {
    id: "4",
    title: "Dashboard",
    links: [
      {
        id: "4-1",
        title: "Profile",
        url: "/profile",
        icon: React.createElement(UserCircle),
      },
      {
        id: "4-2",
        title: "Your Cart",
        url: "/cart",
        icon: React.createElement(ShoppingCart),
      },
      {
        id: "4-3",
        title: "Calendar",
        url: "/calendar",
        icon: React.createElement(Calendar),
      },
      {
        id: "4-4",
        title: "Notifications",
        url: "/notifications",
        icon: React.createElement(BellIcon),
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
    name: "Profile",
    href: "/profile",
    icon: React.createElement(User),
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
