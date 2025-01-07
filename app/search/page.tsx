"use client";

import { SearchIcon } from "lucide-react";
import React from "react";

const Search = () => {
  return (
    <div className="pt-16 md:pt-12 flex flex-col gap-8 h-full">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-center text-4xl xl:text-8xl">Search</h1>
        <div className="flex border rounded-2xl w-4/5 overflow-hidden">
          <div className="p-3">
            <SearchIcon className="text-2xl" />{" "}
          </div>

          <input type="search" className="w-full text-xl outline-none" />
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 p-6 xl:p-12 border flex-grow"></section>
    </div>
  );
};

export default Search;
