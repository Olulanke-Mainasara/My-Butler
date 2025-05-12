"use client";

import { NotificationsPlaceholder } from "@/components/Custom-UI/Placeholders/NotificationsPlaceholder";
import NotificationCard from "@/components/Custom-UI/Cards/NotificationCard";
import { useNotifications } from "@/components/Providers/AllProviders";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { LoginPlaceholder } from "@/components/Custom-UI/Placeholders/LoginPlaceholder";

const Notifications = () => {
  const customerProfile = useCustomerProfile();
  const notifications = useNotifications();

  return (
    <div className="pt-16 md:pt-14 flex flex-col h-full">
      <h1 className="px-3 text-4xl">Notifications</h1>

      <hr className="mx-4 xl:mx-3 mt-8" />

      <section className="px-4 xl:px-3 h-full">
        {!customerProfile ? (
          <LoginPlaceholder info="your recent notifications" />
        ) : (
          <section className="px-4 pb-4 h-full overflow-y-scroll">
            {!notifications || notifications.length === 0 ? (
              <NotificationsPlaceholder />
            ) : (
              notifications.map((_, index) => <NotificationCard key={index} />)
            )}
          </section>
        )}
      </section>
    </div>
  );
};

export default Notifications;
