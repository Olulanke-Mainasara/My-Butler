"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/Shad-UI/button";
import { CartItem } from "@/types/CartItem";
import { Product } from "@/types/Product";
import { supabase } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { buildItemSlugId, invalidateTable } from "@/lib/utils";
import { toast } from "sonner";

const CartItemCard = ({
  cartItem,
  product,
}: {
  cartItem: CartItem;
  product: Product;
}) => {
  const queryClient = useQueryClient();

  const { mutate: setQuantity, isPending: isUpdating } = useMutation({
    mutationFn: async (quantity: number) => {
      const { error } = await supabase
        .from("cart")
        .update({ quantity })
        .eq("id", cartItem.id);
      if (error) throw error;
    },
    onSuccess: () => invalidateTable(queryClient, "cart"),
    onError: () => toast.error("Failed to update quantity."),
  });

  const { mutate: removeItem, isPending: isRemoving } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("cart").delete().eq("id", cartItem.id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateTable(queryClient, "cart");
      toast("Removed from cart");
    },
    onError: () => toast.error("Failed to remove item."),
  });

  const isBusy = isUpdating || isRemoving;
  const itemLink = `/shop/${buildItemSlugId(product.slug, product.id)}`;

  return (
    <div className="flex items-center gap-4 border-b py-6">
      <Link
        href={itemLink}
        className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100"
      >
        <Image
          src={product.product_images?.[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={itemLink} className="hover:underline">
          <p className="text-lg truncate">{product.name}</p>
        </Link>
        <p className="opacity-70">${product.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center border rounded-lg">
        <button
          type="button"
          className="px-3 py-1 hover:bg-neutral-600 hover:text-white disabled:opacity-50"
          disabled={isBusy || cartItem.quantity <= 1}
          onClick={() => setQuantity(cartItem.quantity - 1)}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="px-4 min-w-10 text-center">{cartItem.quantity}</span>
        <button
          type="button"
          className="px-3 py-1 hover:bg-neutral-600 hover:text-white disabled:opacity-50"
          disabled={isBusy || cartItem.quantity >= product.stock_quantity}
          onClick={() => setQuantity(cartItem.quantity + 1)}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <p className="w-20 text-right shrink-0">
        ${(product.price * cartItem.quantity).toFixed(2)}
      </p>

      <Button
        variant="ghost"
        size="icon"
        disabled={isBusy}
        onClick={() => removeItem()}
        aria-label="Remove from cart"
      >
        <Trash2 className="w-4 h-4 text-destructive" />
      </Button>
    </div>
  );
};

export default CartItemCard;
