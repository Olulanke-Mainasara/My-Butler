import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Shad-UI/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/Shad-UI/drawer";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/Shad-UI/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { Icons } from "../icons";
import { Table } from "@/types/Table";

export default function FilterDrawerTrigger({
  optionCollection,
  table,
  handleFilterResult,
}: {
  optionCollection: Record<string, { name: string; slug: string }[]>;
  table: Table;
  handleFilterResult: (result: unknown[]) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [openMobile, setOpenMobile] = React.useState(false);
  const [filters, setFilters] = React.useState<Record<string, string[]>>({});
  const [filterParams, setFilterParams] = React.useState("?");
  const [filtering, setFiltering] = React.useState(false);
  const options = Object.entries(optionCollection);
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchFilteredData = async (
    activeFilters: Record<string, string[]>,
    firstFetch?: boolean
  ) => {
    setFiltering(true);
    console.log(activeFilters);

    if (!firstFetch) {
      router.push(filterParams);
    }

    let query = supabase.from(table).select("*");
    for (const [key, values] of Object.entries(activeFilters)) {
      if (values.length === 1) {
        query = query.eq(key, values[0]);
      } else if (values.length > 1) {
        query = query.in(key, values);
      }
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Error fetching filter results");
    }

    handleFilterResult(data || []);
    setFiltering(false);
    setOpen(false);
    setOpenMobile(false);
  };

  React.useEffect(() => {
    const initialFilters: Record<string, string[]> = {};
    for (const [key] of options) {
      const values = searchParams.getAll(key);
      if (values.length) {
        initialFilters[key] = values;
      }
    }

    if (Object.keys(initialFilters).length === 0) {
      return;
    }

    setFilters(initialFilters);
    fetchFilteredData(initialFilters, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildFilterParams = (filters: Record<string, string[]>) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, values]) => {
      values.forEach((value) => params.append(key, value));
    });
    return `?${params.toString()}`;
  };

  const handleFilter = (criteria: string, value: string) => {
    setFilters((prev) => {
      const existing = prev[criteria] || [];
      const updated = existing.includes(value)
        ? existing.filter((v) => v !== value)
        : [...existing, value];
      const newFilters = { ...prev, [criteria]: updated.filter(Boolean) };
      if (!newFilters[criteria].length) delete newFilters[criteria];
      setFilterParams(buildFilterParams(newFilters));
      return newFilters;
    });
  };

  const handleClearFilters = () => {
    setFilters({});
    setFilterParams("?");
    handleFilterResult([]);
    setOpen(false);
    setOpenMobile(false);
    router.push("?");
  };

  const isSelected = (criteria: string, value: string) => {
    return filters[criteria]?.includes(value);
  };

  const renderOptions = () =>
    options.map(([criteria, opts], index) => (
      <div key={index} className="border-t py-8 last:pb-0 md:last:pb-8">
        <h3 className="text-lg font-semibold first-letter:uppercase">
          {criteria}
        </h3>
        <div className="flex flex-wrap gap-4 mt-4">
          {opts.map((option, i) => (
            <button
              key={i}
              onClick={() => handleFilter(criteria, option.slug)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                isSelected(criteria, option.slug)
                  ? "bg-brandLight dark:bg-brandDark text-white dark:text-gray-900"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-300 dark:hover:opacity-70"
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>
    ));

  return (
    <>
      {filtering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full pointer-events-none bg-black/90">
          <p className="flex items-center gap-2 text-lg text-white">
            Filtering <Icons.spinner className="animate-spin" />
          </p>
        </div>
      )}

      <div className="md:hidden">
        <Drawer open={openMobile} onOpenChange={setOpenMobile}>
          <DrawerTrigger asChild>
            <SlidersHorizontal />
          </DrawerTrigger>
          <DrawerContent className="h-[44.5dvh]">
            <DrawerHeader className="text-left pb-4">
              <DrawerTitle>Filter</DrawerTitle>
              <DrawerDescription>
                Choose your preferences and options.
              </DrawerDescription>
            </DrawerHeader>
            <section className="px-4 h-full overflow-y-scroll">
              {renderOptions()}
            </section>
            <DrawerFooter className="flex-row gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleClearFilters}
              >
                Clear filters
              </Button>
              <Button
                className="w-full"
                onClick={() => fetchFilteredData(filters)}
              >
                Apply filters
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="hidden md:block">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild className="cursor-pointer">
            <SlidersHorizontal />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px] h-fit max-h-[55dvh] xl:max-h-[70dvh] gap-0">
            <DialogHeader className="pb-4">
              <DialogTitle>Filter</DialogTitle>
              <DialogDescription>
                Choose your preferences and options.
              </DialogDescription>
            </DialogHeader>
            <section className="h-full overflow-y-scroll">
              {renderOptions()}
            </section>
            <DialogFooter className="flex-row gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleClearFilters}
              >
                Clear filters
              </Button>
              <Button
                className="w-full"
                onClick={() => fetchFilteredData(filters)}
              >
                Apply filters
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
