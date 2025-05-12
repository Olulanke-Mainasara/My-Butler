"use client";

import { CartPlaceholder } from "@/components/Custom-UI/Placeholders/CartPlaceholder";
import { useCart } from "@/components/Providers/AllProviders";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import CartItemCard from "@/components/Custom-UI/Cards/CartItemCard";
import { LoginPlaceholder } from "@/components/Custom-UI/Placeholders/LoginPlaceholder";

const Cart = () => {
  const customerProfile = useCustomerProfile();
  const cart = useCart();

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
              cart.map((_, index) => <CartItemCard key={index} />)
            )}
          </section>
        )}
      </section>
    </div>
  );
};

export default Cart;
