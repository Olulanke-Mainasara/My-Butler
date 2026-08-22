import { ThemeToggler } from "../Custom-UI/Buttons/ThemeToggler";
import NotificationsDrawerTrigger from "../Custom-UI/Buttons/NotificationsDrawerTrigger";
import CartDrawerTrigger from "../Custom-UI/Buttons/CartDrawerTrigger";
import { SidebarTrigger } from "../Shad-UI/sidebar";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useCustomerProfile } from "../Providers/UserProvider";
import Image from "next/image";
import { User } from "lucide-react";

const links = [
  {
    name: "Shop",
    href: "/shop",
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
    name: "Events",
    href: "/events",
  },
  {
    name: "News",
    href: "/news",
  },
];

const NavBar = () => {
  const pathname = usePathname();
  const customerProfile = useCustomerProfile();
  const isOverlayPage = pathname === "/camera";

  return (
    <header
      className={`fixed z-50 top-0 w-full h-16 ${
        isOverlayPage
          ? "backdrop-blur-2xl"
          : "bg-lightBackground dark:bg-transparent dark:backdrop-blur-2xl"
      }`}
    >
      <div className="flex items-center justify-between w-full h-full overflow-hidden py-3 px-4 md:px-5">
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

        {!pathname.startsWith("/brand-dashboard") ? (
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`${
                  pathname === link.href
                    ? "text-brandLight dark:text-brandDark"
                    : "text-lightText dark:text-darkText hover:text-brandLight dark:hover:text-brandDark"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        ) : null}

        <div
          className={`flex items-center gap-4 md:gap-5 ${
            pathname.startsWith("/butler") && customerProfile ? "pr-11" : ""
          } ${isOverlayPage ? "text-white" : ""}`}
        >
          {customerProfile ? (
            <Link href="/profile">
              <Image
                src={customerProfile.profile_picture || "/placeholder.svg"}
                alt="Profile"
                width={40}
                height={40}
                className="w-8 h-8 object-cover rounded-full"
              />
            </Link>
          ) : !customerProfile && !pathname.startsWith("/brand-dashboard") ? (
            <Link href="/auth/login">
              <User />
            </Link>
          ) : null}

          {pathname !== "/cart" && !pathname.startsWith("/brand-dashboard") ? (
            <CartDrawerTrigger />
          ) : null}

          {pathname.startsWith("/brand-dashboard") ? (
            <ThemeToggler />
          ) : (
            <NotificationsDrawerTrigger />
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
