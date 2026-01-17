import React from "react";
import { GiBowTie } from "react-icons/gi";

const Logo = ({ mode }: { mode: "normal" | "inverted" }) => {
  return mode === "normal" ? (
    <div
      className={`w-36 h-36 bg-lightBackground dark:bg-darkBackground flex items-center justify-center rounded-full overflow-hidden relative`}
    >
      <h1 className="text-[105px] text-black dark:text-white">B</h1>
      <div className="text-[75px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brandLight dark:text-brandDark bg-white dark:bg-black flex items-center justify-center h-4">
        <GiBowTie />
      </div>
    </div>
  ) : mode === "inverted" ? (
    <div
      className={`w-36 h-36 bg-darkBackground dark:bg-lightBackground flex items-center justify-center rounded-full overflow-hidden relative`}
    >
      <h1 className="text-[105px] text-white dark:text-black">B</h1>
      <div className="text-[75px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brandLight dark:text-brandDark bg-black dark:bg-white flex items-center justify-center h-4">
        <GiBowTie />
      </div>
    </div>
  ) : null;
};

export default Logo;
