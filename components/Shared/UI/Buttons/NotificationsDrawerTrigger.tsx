import * as React from "react";

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
import { useIsMobile } from "@/hooks/use-mobile";
import { BellDot } from "lucide-react";
import NotificationCard from "../Cards/NotificationCard";
import { useNotifications } from "@/components/Providers/AllProviders";
import { NotificationsPlaceholder } from "../Placeholders/NotificationsPlaceholder";
export default function NotificationsDrawerTrigger() {
  const [open, setOpen] = React.useState(false);
  const notifications = useNotifications();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <BellDot />
        </DrawerTrigger>
        <DrawerContent className="h-full max-h-[90dvh]">
          <DrawerHeader className="text-left pb-0">
            <DrawerTitle>Notifications</DrawerTitle>
            <DrawerDescription>
              Preview your recent notifications.
            </DrawerDescription>
          </DrawerHeader>

          <section className="px-4 pb-4 h-full overflow-y-scroll">
            {!notifications || notifications.length === 0 ? (
              <NotificationsPlaceholder />
            ) : (
              notifications.map((_, index) => <NotificationCard key={index} />)
            )}
          </section>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        <BellDot />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px] h-full max-h-[80dvh] gap-0">
        <DialogHeader className="pb-0">
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            Preview your recent notifications.
          </DialogDescription>
        </DialogHeader>
        <section className="px-4 pb-4 h-full overflow-y-scroll">
          {!notifications || notifications.length === 0 ? (
            <NotificationsPlaceholder />
          ) : (
            notifications.map((_, index) => <NotificationCard key={index} />)
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
}
