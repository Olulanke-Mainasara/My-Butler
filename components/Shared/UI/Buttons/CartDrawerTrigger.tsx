import * as React from "react";

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
import { useIsMobile } from "@/hooks/use-mobile";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/Providers/AllProviders";
import { CartPlaceholder } from "../Placeholders/CartPlaceholder";
import CartItemCard from "../Cards/CartItemCard";

export default function CartDrawerTrigger() {
  const [open, setOpen] = React.useState(false);
  const cart = useCart();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <ShoppingCart />
        </DrawerTrigger>
        <DrawerContent className="h-full max-h-[90dvh]">
          <DrawerHeader className="text-left pb-0">
            <DrawerTitle>Your cart</DrawerTitle>
            <DrawerDescription>
              Preview the items in your cart.
            </DrawerDescription>
          </DrawerHeader>
          <section className="px-4 pb-4 h-full overflow-y-scroll">
            {!cart || cart.length === 0 ? (
              <CartPlaceholder />
            ) : (
              cart.map((_, index) => <CartItemCard key={index} />)
            )}
          </section>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        <ShoppingCart />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px] h-full max-h-[80dvh] gap-0">
        <DialogHeader className="pb-0">
          <DialogTitle>Your cart</DialogTitle>
          <DialogDescription>Preview the items in your cart.</DialogDescription>
        </DialogHeader>
        <section className="px-4 pb-4 h-full overflow-y-scroll">
          {!cart || cart.length === 0 ? (
            <CartPlaceholder />
          ) : (
            cart.map((_, index) => <CartItemCard key={index} />)
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
}
