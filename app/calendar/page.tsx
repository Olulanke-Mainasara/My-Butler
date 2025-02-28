"use client";

import { Calendar } from "@/components/Shad-UI/calendar";
import React from "react";
const CalendarPage = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="pt-16 md:pt-14 pb-4 xl:pb-5 flex flex-col md:flex-row md:gap-x-5 gap-y-4 justify-start grow px-4 xl:px-5 h-full">
      <div className="w-full h-full flex items-center justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border w-full h-full px-0 py-0 overflow-hidden"
        />
      </div>

      <div className="w-full basis-1/4 flex items-center justify-center">
        <div className="space-y-4 w-full">
          <p className="text-center text-3xl sm:text-2xl">
            Events{" "}
            {date
              ? `${date.getDate()} / ${
                  date.getMonth() + 1
                } / ${date.getFullYear()}`
              : "Date not available"}
          </p>
          <div className="min-h-40 border rounded-md flex items-center justify-center">
            <p className="text-center text-2xl sm:text-xl opacity-80">
              No events
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
