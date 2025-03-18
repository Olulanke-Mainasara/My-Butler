import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Shad-UI/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/Shad-UI/drawer";
import { SlidersHorizontal } from "lucide-react";
import { filter } from "@/static-data/filter";

export default function FilterDrawerTrigger() {
  const [open, setOpen] = React.useState(false);
  const [openMobile, setOpenMobile] = React.useState(false);
  const options = Object.entries(filter);

  return (
    <>
      <div className="md:hidden">
        <Drawer open={openMobile} onOpenChange={setOpenMobile}>
          <DrawerTrigger asChild>
            <SlidersHorizontal />
          </DrawerTrigger>
          <DrawerContent className="h-fit">
            <DrawerHeader className="text-left pb-4">
              <DrawerTitle>Filter</DrawerTitle>
              <DrawerDescription>
                Choose your preferences and options.
              </DrawerDescription>
            </DrawerHeader>
            <section className="px-4 pb-4 h-full overflow-y-scroll">
              {options.map((criteria, index) => (
                <div key={index} className="border-t py-8">
                  <h3 className="text-xl font-semibold">{criteria[0]}</h3>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {criteria[1].map((option, index) => (
                      <button
                        key={index}
                        className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 rounded-full"
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </section>
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
              {options.map((criteria, index) => (
                <div key={index} className="border-t first: py-8">
                  <h3 className="text-lg font-semibold">{criteria[0]}</h3>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {criteria[1].map((option, index) => (
                      <button
                        key={index}
                        className="px-4 py-2 text-sm text-gray-800 bg-gray-100 hover:bg-gray-300 dark:hover:opacity-70 rounded-full"
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
