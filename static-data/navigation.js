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
        icon: <Home />,
        title: "Home",
      },
      {
        id: "1-2",
        url: "/butler",
        icon: <Stars />,
        title: "Butler Assistant",
      },
      {
        id: "1-3",
        url: "/outfits",
        icon: <GiShirt />,
        title: "Outfit Gallery",
      },
      {
        id: "1-4",
        url: "/combine",
        icon: <GiPaintBucket />,
        title: "Outfit Combiner",
      },
      {
        id: "1-5",
        url: "/camera",
        icon: <GiPhotoCamera />,
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
        icon: <GiShoppingCart />,
        title: "Shop Now",
      },
      {
        id: "2-2",
        url: "/events",
        icon: <GiTicket />,
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
        icon: <GiNewspaper />,
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
        icon: <ShoppingCart />,
      },
      {
        id: "4-2",
        title: "Notifications",
        url: "/notifications",
        icon: <BellIcon />,
      },
      {
        id: "4-3",
        title: "Calendar",
        url: "/calendar",
        icon: <Calendar />,
      },
      {
        id: "4-4",
        title: "Settings",
        url: "/settings",
        icon: <Settings />,
      },
    ],
  },
];

export const navigation = [
  {
    id: "1",
    name: "",
    href: "/butler",
    icon: <Stars />,
  },
  {
    id: "2",
    name: "",
    href: "/outfits",
    icon: <GiShirt />,
  },
  {
    id: "3",
    name: "",
    href: "/combine",
    icon: <GiPaintBucket />,
  },
  {
    id: "4",
    name: "",
    href: "/camera",
    icon: <GiPhotoCamera />,
  },
  {
    id: "5",
    name: "",
    href: "/settings",
    icon: <Settings />,
  },
  {
    id: "6",
    name: "",
    href: "/news",
    icon: <GiNewspaper />,
  },
  {
    id: "7",
    name: "",
    href: "/shop",
    icon: <GiShoppingCart />,
  },
  {
    id: "8",
    name: "",
    href: "/events",
    icon: <GiTicket />,
  },
];
