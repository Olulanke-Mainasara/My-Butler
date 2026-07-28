import { ThemeToggler } from "../Custom-UI/Buttons/ThemeToggler";
import NotificationsDrawerTrigger from "../Custom-UI/Buttons/NotificationsDrawerTrigger";
import CartDrawerTrigger from "../Custom-UI/Buttons/CartDrawerTrigger";
import { SidebarTrigger } from "../Shad-UI/sidebar";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useCustomerProfile } from "../Providers/UserProvider";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { User } from "lucide-react";

const links = [
  {
    name: "Products",
    href: "/products",
  },
  {
    name: "Collections",
    href: "/collections",
  },
  {
    name: "Brands",
    href: "/brands",
  },
  {
    name: "Clothing",
    href: "/categories/clothing",
  },
  {
    name: "News",
    href: "/news",
  },
];

const NavBar = () => {
  const [top, setTop] = useState(true);
  const pathname = usePathname();
  const customerProfile = useCustomerProfile();
  const { theme } = useTheme();
  const isOverlayPage =
    pathname === "/camera" || pathname === "/combine/personal";

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (header) {
        if (window.scrollY > 0) {
          setTop(false);
        } else {
          setTop(true);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`fixed z-50 top-0 w-full`}>
      <motion.nav
        initial={{ top: 0, width: "100%" }}
        animate={{
          top: top ? 0 : 20,
          width: top ? "100%" : "98%",
          left: top ? 0 : "1%",
          backdropFilter: top ? "blur(0px)" : "blur(15px)",
          borderRadius: top ? 0 : 35,
          border: top
            ? "none"
            : theme === "dark"
              ? "1px solid rgba(48, 45, 45, 0.5)"
              : "1px solid rgba(255, 255, 255, 0.5)",
        }}
        className="flex items-center justify-between w-full absolute overflow-hidden py-3 px-4 md:px-5"
      >
        <div
          className={`flex items-center gap-4 md:gap-5 ${
            isOverlayPage ? "text-white" : ""
          }`}
        >
          {!pathname.startsWith("/brand-dashboard") ? (
            <SidebarTrigger />
          ) : (
            <></>
          )}

          <Link
            href={
              pathname.startsWith("/brand-dashboard") ? "/brand-dashboard" : "/"
            }
            className={`text-2xl ${pathname === "/camera" ? "hidden" : ""}`}
          >
            My{" "}
            <span className="text-brandLight dark:text-brandDark ">Butler</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`${
                pathname === link.href
                  ? "text-brandLight dark:text-brandDark font-semibold"
                  : "text-lightText dark:text-darkText hover:text-brandLight dark:hover:text-brandDark"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div
          className={`flex items-center gap-4 md:gap-5 ${
            pathname.startsWith("/butler") ? "pr-11" : ""
          } ${isOverlayPage ? "text-white" : ""}`}
        >
          {customerProfile ? (
            <Link href="/profile">
              <Image
                src={customerProfile.profile_picture || "/placeholder.svg"}
                alt="Profile"
                width={40}
                height={40}
                className="w-8 h-8 rounded-full"
              />
            </Link>
          ) : (
            <Link href="/login">
              <User />
            </Link>
          )}

          {pathname !== "/cart" && !pathname.startsWith("/brand-dashboard") ? (
            <CartDrawerTrigger />
          ) : null}

          {pathname.startsWith("/brand-dashboard") ? (
            <ThemeToggler />
          ) : (
            <NotificationsDrawerTrigger />
          )}
        </div>
      </motion.nav>
    </header>
  );
};

export default NavBar;
