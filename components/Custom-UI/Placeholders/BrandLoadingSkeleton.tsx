import React from "react";

const BrandLoadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-6 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-14 h-14 rounded-full bg-neutral-200" />
        <div className="space-y-2">
          <div className="h-6 w-40 bg-neutral-200 rounded" />
          <div className="h-4 w-32 bg-neutral-200 rounded opacity-70" />
        </div>
      </div>

      <div className="md:flex flex-wrap">
        <div className="p-2 xl:px-6 border-l border-l-neutral-500">
          <div className="h-4 w-60 bg-neutral-200 rounded" />
        </div>
        <div className="p-2 xl:px-6 border-l border-l-neutral-500 hidden md:block">
          <div className="h-4 w-52 bg-neutral-200 rounded" />
        </div>
        <div className="p-2 xl:px-6 border-l border-l-neutral-500 hidden md:block">
          <div className="h-4 w-48 bg-neutral-200 rounded" />
        </div>
        <div className="p-2 xl:px-6 border-l border-l-neutral-500 hidden md:block">
          <div className="h-4 w-40 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export default BrandLoadingSkeleton;
