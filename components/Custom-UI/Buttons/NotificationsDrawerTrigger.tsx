import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Shad-UI/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/Shad-UI/drawer";
import { BellDot } from "lucide-react";
import NotificationCard from "../Cards/NotificationCard";
import {
  useNotifications,
  useUserProfile,
} from "@/components/Providers/AllProviders";
import { NotificationsPlaceholder } from "../Placeholders/NotificationsPlaceholder";
import { usePathname } from "next/navigation";
import { LoginPlaceholder } from "../Placeholders/LoginPlaceholder";
export default function NotificationsDrawerTrigger() {
  const [open, setOpen] = React.useState(false);
  const [openMobile, setOpenMobile] = React.useState(false);
  const userProfile = useUserProfile();
  const pathname = usePathname();
  const notifications = useNotifications();

  return (
    <>
      <div
        className={`md:hidden ${
          pathname === "/camera" || pathname === "/combine/personal"
            ? "hidden"
            : ""
        }`}
      >
        <Drawer open={openMobile} onOpenChange={setOpenMobile}>
          <DrawerTrigger asChild>
            <BellDot />
          </DrawerTrigger>
          <DrawerContent className="h-[65dvh] max-h-[90dvh]">
            <DrawerHeader className="text-left pb-0">
              <DrawerTitle>Notifications</DrawerTitle>
              <DrawerDescription>
                Preview your recent notifications.
              </DrawerDescription>
            </DrawerHeader>
            {!userProfile ? (
              <LoginPlaceholder info="your recent notifications" />
            ) : (
              <section className="px-4 pb-4 h-full overflow-y-scroll">
                {!notifications || notifications.length === 0 ? (
                  <NotificationsPlaceholder />
                ) : (
                  notifications.map((_, index) => (
                    <NotificationCard key={index} />
                  ))
                )}
              </section>
            )}
          </DrawerContent>
        </Drawer>
      </div>

      <div
        className={`hidden ${
          pathname === "/camera" || pathname === "/combine/personal"
            ? "md:hidden"
            : "md:block"
        }`}
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild className="cursor-pointer">
            <BellDot />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[725px] h-fit max-h-[55dvh] xl:max-h-[70dvh] gap-0">
            <DialogHeader className="pb-0">
              <DialogTitle>Notifications</DialogTitle>
              <DialogDescription>
                Preview your recent notifications.
              </DialogDescription>
            </DialogHeader>
            {!userProfile ? (
              <LoginPlaceholder info="your recent notifications" />
            ) : (
              <section className="px-4 pb-4 h-full overflow-y-scroll">
                {!notifications || notifications.length === 0 ? (
                  <NotificationsPlaceholder />
                ) : (
                  notifications.map((_, index) => (
                    <NotificationCard key={index} />
                  ))
                )}
              </section>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
