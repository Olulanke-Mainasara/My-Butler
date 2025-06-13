"use client";

import React from "react";
import { supabase } from "@/lib/supabase/client";
import { Search } from "lucide-react";
import { Table } from "@/types/Table";
import { toast } from "sonner";
import { Icons } from "../icons";
import { useRouter } from "next/navigation";

export default function FullTextSearchInput({
  table,
  column,
  handleSearchResult,
}: {
  table: Table;
  column: string;
  handleSearchResult: (result: unknown[]) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    router.push(`?search=${query}`);

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .textSearch(column, query, {
        config: "english",
      });

    if (error) {
      toast.error("Error fetching search results");
    }

    handleSearchResult(data || []);
    setSearching(false);
  };

  return (
    <>
      {searching && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full pointer-events-none bg-black/90">
          <p className="flex items-center gap-2 text-lg text-white">
            Searching <Icons.spinner className="animate-spin" />
          </p>
        </div>
      )}
      <div className="w-full items-center border border-black dark:border-white overflow-hidden rounded-3xl flex h-14">
        <div className="flex items-center p-3">
          <button onClick={handleSearch}>
            <Search className="" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="pr-3 outline-none bg-transparent pl-0 w-full text-lg md:text-xl h-full"
        />
      </div>
    </>
  );
}
