import { Link } from "next-view-transitions";
import { Stars } from "lucide-react";
import {
  GiNewspaper,
  GiPhotoCamera,
  GiShirt,
  GiTicket,
} from "react-icons/gi";
import { Factory, ShoppingBag, User, ShoppingCart, LogIn } from "lucide-react";
import { Separator } from "@/components/Shad-UI/separator";

const columns = [
  {
    title: "Shop",
    links: [
      { name: "Shop", href: "/shop", icon: <ShoppingBag className="size-4" /> },
      { name: "Collections", href: "/collections", icon: <GiShirt className="size-4" /> },
      { name: "Brands", href: "/brands", icon: <Factory className="size-4" /> },
      { name: "Events", href: "/events", icon: <GiTicket className="size-4" /> },
    ],
  },
  {
    title: "Discover",
    links: [
      { name: "Butler A.I", href: "/butler", icon: <Stars className="size-4" /> },
      { name: "News", href: "/news", icon: <GiNewspaper className="size-4" /> },
      { name: "Camera", href: "/camera", icon: <GiPhotoCamera className="size-4" /> },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "Profile", href: "/profile", icon: <User className="size-4" /> },
      { name: "Cart", href: "/cart", icon: <ShoppingCart className="size-4" /> },
      { name: "Sign in", href: "/auth/login", icon: <LogIn className="size-4" /> },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-darkBackground dark:bg-lightBackground/5 dark:border-t dark:border-neutral-800">
      <div className="mx-auto max-w-(--breakpoint-xl) px-5 py-16 md:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 space-y-3 md:col-span-2">
            <Link href="/" className="text-2xl text-white">
              My <span className="text-brandDark">Butler</span>
            </Link>
            <p className="max-w-xs text-sm text-neutral-400">
              Fashion, curated by people and sharpened by your AI stylist.
              Discover brands, collections, and events made for you.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                {column.title}
              </p>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-neutral-300 transition-colors hover:text-brandDark"
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-neutral-800" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-neutral-500 md:flex-row">
          <p>&copy; {new Date().getFullYear()} My Butler. All rights reserved.</p>
          <p>Made for people who&rsquo;d rather let Butler decide.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
