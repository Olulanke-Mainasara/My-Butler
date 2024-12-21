import React from "react";
import { GiBowTie } from "react-icons/gi";

const Logo = ({ scale }: { scale: string }) => {
  return (
    <div
      className={`w-72 h-72 bg-black dark:bg-white flex items-center justify-center rounded-full overflow-hidden ${
        scale === "small" ? "scale-50" : scale === "medium" ? "scale-75" : ""
      }`}
    >
      <h1 className="text-[200px] text-white dark:text-black">B</h1>
      <div className="text-[150px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand bg-black dark:bg-white flex items-center justify-center h-8">
        <GiBowTie />
      </div>
    </div>
  );
};

export default Logo;
