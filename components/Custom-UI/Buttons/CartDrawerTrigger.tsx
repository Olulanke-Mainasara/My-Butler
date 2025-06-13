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
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/Providers/AllProviders";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { CartPlaceholder } from "../Placeholders/CartPlaceholder";
import CartItemCard from "../Cards/CartItemCard";
import { LoginPlaceholder } from "../Placeholders/LoginPlaceholder";

export default function CartDrawerTrigger() {
  const [open, setOpen] = React.useState(false);
  const [openMobile, setOpenMobile] = React.useState(false);
  const customerProfile = useCustomerProfile();
  const cart = useCart();

  return (
    <>
      <div className="md:hidden">
        <Drawer open={openMobile} onOpenChange={setOpenMobile}>
          <DrawerTrigger asChild>
            <ShoppingCart />
          </DrawerTrigger>
          <DrawerContent className="h-[65dvh] max-h-[90dvh]">
            <DrawerHeader className="text-left pb-0">
              <DrawerTitle>Your cart</DrawerTitle>
              <DrawerDescription>
                Preview the items in your cart.
              </DrawerDescription>
            </DrawerHeader>
            {!customerProfile ? (
              <LoginPlaceholder
                info="the items in your cart"
                close={setOpenMobile}
              />
            ) : (
              <section className="px-4 pb-4 h-full overflow-y-scroll">
                {!cart || cart.length === 0 ? (
                  <CartPlaceholder />
                ) : (
                  cart.map((_, index) => <CartItemCard key={index} />)
                )}
              </section>
            )}
          </DrawerContent>
        </Drawer>
      </div>

      <div className="hidden md:block">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild className="cursor-pointer">
            <ShoppingCart />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[725px] h-fit max-h-[55dvh] xl:max-h-[70dvh] gap-0">
            <DialogHeader className="pb-0">
              <DialogTitle>Your cart</DialogTitle>
              <DialogDescription>
                Preview the items in your cart.
              </DialogDescription>
            </DialogHeader>
            {!customerProfile ? (
              <LoginPlaceholder info="the items in your cart" close={setOpen} />
            ) : (
              <section className="px-4 pb-4 h-full overflow-y-scroll">
                {!cart || cart.length === 0 ? (
                  <CartPlaceholder />
                ) : (
                  cart.map((_, index) => <CartItemCard key={index} />)
                )}
              </section>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
