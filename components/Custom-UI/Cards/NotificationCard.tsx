import { Notification } from "@/types/Notification";
import React from "react";

const NotificationCard = ({ item }: { item?: Notification }) => {
  console.log(item);
  return <div className="border-b p-8"></div>;
};

export default NotificationCard;
