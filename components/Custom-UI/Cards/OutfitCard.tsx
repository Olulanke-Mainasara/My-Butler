import React from "react";

const OutfitCard = ({ item }: { item?: object }) => {
  console.log(item);
  return (
    <div className="md:px-[10px] xl:px-3 h-full">
      <div className="border flex items-center justify-center h-full rounded-3xl relative ">
        Outfit
      </div>
    </div>
  );
};

export default OutfitCard;
