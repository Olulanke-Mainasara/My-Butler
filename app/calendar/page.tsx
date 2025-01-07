"use client";

import { Calendar } from "@/components/Shad-UI/calendar";
import React from "react";
const CalendarPage = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="pt-16 md:pt-12 flex flex-col gap-4 h-full">
      <h1 className="text-center text-4xl xl:text-8xl">Calendar</h1>
      <div className="flex grow">
        <div className="w-full flex items-center justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border scale-150"
          />
        </div>

        <div className="w-full flex items-center justify-center">
          <div className="w-4/5 max-w-lg space-y-4">
            <p className="text-center text-4xl">
              Events{" "}
              {date?.getDate() +
                " / " +
                date?.getMonth() +
                " / " +
                date?.getFullYear()}
            </p>
            <div className="min-h-40 border rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
