import { convertRawDateToReadableDate } from "@/lib/utils";
import { Notification } from "@/types/system-types/Notification";
import { PartyPopper } from "lucide-react";
import React from "react";

const NotificationCard = ({ item }: { item?: Notification }) => {
  return (
    <div className="flex items-center justify-between gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer px-4 py-4 border-b">
      <div className="flex items-center gap-4">
        <PartyPopper className="w-6 h-6 text-brandLight dark:text-brandDark" />
        <div>
          <p className="text-xl font-semibold">{item?.title}</p>
        </div>
      </div>
      <p className="text-sm text-gray-500">
        {convertRawDateToReadableDate(item?.created_at || "")}
      </p>
    </div>
  );
};

export default NotificationCard;
