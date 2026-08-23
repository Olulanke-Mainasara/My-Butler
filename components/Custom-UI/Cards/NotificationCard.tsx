import { convertRawDateToReadableDate } from "@/lib/utils";
import { Notification } from "@/types/system-types/Notification";
import { PartyPopper } from "lucide-react";
import { usePathname } from "next/navigation";

const NotificationCard = ({ item }: { item?: Notification }) => {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer px-4 py-4 border-b">
      <div className="flex items-center gap-4">
        <PartyPopper className="w-6 h-6 text-brandLight dark:text-brandDark" />
        <p className="text-xl font-semibold">{item?.title}</p>
        {pathname.startsWith("/notifications") && (
          <p className="text-sm text-gray-500">{item?.message}</p>
        )}
      </div>
      <p className="text-sm text-gray-500">
        {convertRawDateToReadableDate(item?.created_at || "")}
      </p>
    </div>
  );
};

export default NotificationCard;
