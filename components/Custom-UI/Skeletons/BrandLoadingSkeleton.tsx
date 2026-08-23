import React from "react";

const BrandLoadingSkeleton = () => {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="w-full h-36 sm:h-48 md:h-64 xl:h-72 bg-neutral-200" />

      <div className="px-3 md:px-6">
        <div className="-mt-10 sm:-mt-12 md:-mt-14 relative z-10 inline-block">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-neutral-300 border-4 border-background" />
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-7 w-48 bg-neutral-200 rounded" />
          <div className="h-4 w-36 bg-neutral-200 rounded opacity-70" />
        </div>
      </div>

      <div className="px-3 md:px-6 mt-4 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="h-4 w-full max-w-md bg-neutral-200 rounded" />
        <div className="flex flex-wrap gap-4">
          <div className="h-4 w-32 bg-neutral-200 rounded" />
          <div className="h-4 w-28 bg-neutral-200 rounded" />
          <div className="h-4 w-32 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export default BrandLoadingSkeleton;
