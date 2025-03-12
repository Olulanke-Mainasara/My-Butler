"use client";

import { NotificationsPlaceholder } from "@/components/Custom-UI/Placeholders/NotificationsPlaceholder";
import NotificationCard from "@/components/Custom-UI/Cards/NotificationCard";
import { useNotifications } from "@/components/Providers/AllProviders";
const Notifications = () => {
  const notifications = useNotifications();

  return (
    <div className="pt-16 md:pt-14 flex flex-col h-full">
      <h1 className="px-3 text-4xl">Notifications</h1>

      <hr className="mx-4 xl:mx-3 mt-8" />

      <section className="px-4 xl:px-3 h-full">
        {!notifications || notifications.length === 0 ? (
          <NotificationsPlaceholder />
        ) : (
          notifications.map((notification, index) => (
            <NotificationCard key={index} />
          ))
        )}
      </section>
    </div>
  );
};

export default Notifications;
