import Image from "next/image";
import noNotificationsDark from "@/public/No-Notifications/no-notifications-dark.svg";
import noNotificationsLight from "@/public/No-Notifications/no-notifications-light.svg";
import { useTheme } from "next-themes";

export function NotificationsPlaceholder() {
  const { theme } = useTheme();
  return (
    <section className="flex flex-col items-center justify-center h-full">
      <Image
        src={theme === "dark" ? noNotificationsDark : noNotificationsLight}
        alt="No notifications"
        className="size-64 md:size-80"
      />
      <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white">
        No notifications
      </h2>
      <p className="text-neutral-500 mt-2 text-center max-w-xs">
        Your notifications will show up here when you receive them
      </p>
    </section>
  );
}
