import { Stars } from "lucide-react";
import {
  GiBigGear,
  GiNewspaper,
  GiPaintBucket,
  GiPhotoCamera,
  GiShirt,
  GiShoppingCart,
  GiTicket,
} from "react-icons/gi";

export const navigation = [
  {
    id: "1",
    name: "",
    href: "/butler",
    icon: <Stars size={30} />,
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
    icon: <GiBigGear />,
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
