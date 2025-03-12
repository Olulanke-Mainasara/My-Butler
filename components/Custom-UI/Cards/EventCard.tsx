import React from "react";

const EventCard = ({ item }: { item?: object }) => {
  console.log(item);
  return (
    <div className="md:px-[10px] xl:px-3 h-full">
      <div className="border flex items-center justify-center h-full rounded-3xl relative ">
        <div className="rounded-full absolute top-4 left-4 border flex items-center px-4 py-1 bg-white text-black">
          <p className="text-xl">Free</p>
        </div>
        Event
      </div>
    </div>
  );
};

export default EventCard;
