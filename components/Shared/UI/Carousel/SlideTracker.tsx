import React from "react";
import { motion } from "framer-motion";

const SlideTracker = ({
  length,
  current,
  className,
}: {
  length: number;
  current: number;
  className?: string;
}) => {
  return (
    <div
      className={`text-center w-full md:hidden flex gap-1 items-center justify-center h-8 ${className}`}
    >
      {Array.from({ length: length }).map((_, index) => (
        <motion.div
          key={index}
          animate={
            current === index + 1
              ? { width: 20, backgroundColor: "#65d1fd" }
              : { width: 8 }
          }
          className="h-2 bg-darkBackground dark:bg-white rounded-full transition"
        ></motion.div>
      ))}
    </div>
  );
};

export default SlideTracker;
