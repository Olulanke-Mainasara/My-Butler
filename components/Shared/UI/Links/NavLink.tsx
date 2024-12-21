import React from "react";
import { motion } from "framer-motion";
import { Link } from "next-view-transitions";

type Button = {
  id: string;
  name: string;
  href: string;
  icon: JSX.Element;
};

const NavLink = ({
  button,
  index,
  shouldSplash,
}: {
  button: Button;
  index: number;
  shouldSplash: boolean;
}) => {
  const positionClasses: { [key: string]: string } = {
    "1": "col-start-2 flex justify-center row-span-2",
    "2": "row-span-2 flex items-center justify-end p-4",
    "3": "col-start-3 row-start-3 row-span-2 flex justify-end",
    "4": "col-start-3 row-start-5 row-span-2 flex items-center justify-end p-4",
    "5": "col-start-2 row-start-5 flex justify-center row-span-2",
    "6": "row-start-5 row-span-2 flex items-center p-4",
    "7": "col-start-1 row-span-2 row-start-3",
  };

  const anchorPositionClasses: { [key: string]: string } = {
    "1": "absolute left-1/2 -translate-x-1/2 -top-8",
    "3": "absolute top-1/2 -translate-y-1/2 -right-8",
    "5": "absolute left-1/2 -translate-x-1/2 -bottom-8",
    "7": "absolute top-1/2 -translate-y-1/2 -left-8",
  };

  return (
    <motion.div
      initial={shouldSplash && { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.15 + 2,
      }}
      className={`w-full h-full relative ${
        positionClasses[button.id] ||
        "col-start-1 row-start-1 row-span-2 flex items-center p-4"
      }`}
    >
      <Link
        href={button.href}
        className={`w-14 h-14 sm:w-16 sm:h-16 border border-black dark:border-white rounded-full text-3xl sm:text-4xl flex items-center justify-center bg-white text-black ${
          anchorPositionClasses[button.id] || ""
        }`}
      >
        {button.icon}
      </Link>
    </motion.div>
  );
};

export default NavLink;
