"use client";

import { Button } from "@/components/Shad-UI/button";
import { cn } from "@/lib/utils";
import { Article } from "@/types/Article";
import { Collection } from "@/types/Collection";
import { Event } from "@/types/Event";
import { Product } from "@/types/Product";
import { ShoppingCart } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { toggleCart } from "@/lib/mutations";
import { toast } from "sonner";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { useCart } from "@/components/Providers/AllProviders";

const AddToCart = ({
  item,
  quantity,
  itemType,
}: {
  item: Collection | Product | Article | Event;
  quantity: number;
  itemType: string;
}) => {
  const customerProfile = useCustomerProfile();
  const cart = useCart();
  const queryClient = useQueryClient();

  const isInTheCart = cart?.some((cartItem) => cartItem.item_id === item.id);

  const { mutate: handleAddToCart, isPending } = useMutation({
    mutationFn: () => toggleCart(supabase, item.id, quantity, itemType),

    onSuccess: (data) => {
      if (data === "added") {
        toast.success("Added to cart!");
      } else {
        toast("Removed from cart");
      }

      // Simply invalidate all bookmark queries
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey.includes("cart"),
      });
    },

    onError: (error) => {
      toast.error("Error modifying cart");
      console.error(error);
    },
  });

  const handleClick = () => {
    if (!customerProfile) {
      toast.info("You must be logged in to add to cart");
      return;
    }

    if (!item?.id) {
      toast.error("Invalid ID");
      return;
    }

    handleAddToCart();
  };

  return (
    <Button
      variant={"outline"}
      size={"icon"}
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "min-w-10 hover:text-white transition-colors",
        isInTheCart
          ? "bg-brandLight hover:bg-brandLight/70 dark:bg-brandDark text-white dark:text-gray-900"
          : "bg-transparent dark:bg-transparent hover:bg-neutral-600",
        isPending && "opacity-50 cursor-not-allowed"
      )}
    >
      <ShoppingCart
        className={cn("transition-transform", isPending && "animate-pulse")}
      />
    </Button>
  );
};

export default AddToCart;
