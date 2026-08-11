"use client";

import { useState } from "react";
import { CartPlaceholder } from "@/components/Custom-UI/Placeholders/CartPlaceholder";
import { useCart } from "@/components/Providers/AllProviders";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import CartItemCard from "@/components/Custom-UI/Cards/CartItemCard";
import { LoginPlaceholder } from "@/components/Custom-UI/Placeholders/LoginPlaceholder";
import { getProductsByIds } from "@/lib/fetches";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Button } from "@/components/Shad-UI/button";
import { Icons } from "@/components/Custom-UI/icons";
import { toast } from "sonner";

const Cart = () => {
  const customerProfile = useCustomerProfile();
  const cart = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const productIds = (cart ?? [])
    .filter((item) => item.item_type === "product" && item.item_id)
    .map((item) => item.item_id as string);

  const { data: products } = useQuery(getProductsByIds(productIds), {
    enabled: productIds.length > 0,
  });

  const productsById = new Map((products ?? []).map((p) => [p.id, p]));

  const subtotal = (cart ?? []).reduce((sum, item) => {
    const product = productsById.get(item.item_id ?? "");
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.url) {
        toast.error(data.error || "Failed to start checkout.");
        setIsCheckingOut(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error("Failed to start checkout.");
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="pt-16 md:pt-14 flex flex-col h-full">
      <h1 className="px-3 text-4xl">Your cart</h1>

      <hr className="mx-4 xl:mx-3 mt-8" />

      <section className="px-4 xl:px-3 h-full">
        {!customerProfile ? (
          <LoginPlaceholder info="the items in your cart" />
        ) : (
          <section className="px-4 pb-4 h-full overflow-y-scroll">
            {!cart || cart.length === 0 ? (
              <CartPlaceholder />
            ) : (
              <div className="flex flex-col xl:flex-row gap-8 max-w-[theme(screens.lg)] mx-auto">
                <div className="flex-1">
                  {cart.map((item) => {
                    const product = productsById.get(item.item_id ?? "");
                    if (!product) return null;
                    return (
                      <CartItemCard
                        key={item.id}
                        cartItem={item}
                        product={product}
                      />
                    );
                  })}
                </div>

                <div className="xl:w-80 shrink-0 space-y-4 border rounded-xl p-6 h-fit">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-sm opacity-70">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <Button
                    className="w-full py-6 text-lg"
                    disabled={isCheckingOut || subtotal === 0}
                    onClick={handleCheckout}
                  >
                    {isCheckingOut ? (
                      <>
                        <Icons.spinner className="animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      "Checkout"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </section>
        )}
      </section>
    </div>
  );
};

export default Cart;
