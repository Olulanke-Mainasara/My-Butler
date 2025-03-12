"use client";

import { CartPlaceholder } from "@/components/Custom-UI/Placeholders/CartPlaceholder";
import { useCart } from "@/components/Providers/AllProviders";
import CartItemCard from "@/components/Custom-UI/Cards/CartItemCard";

const Cart = () => {
  const cart = useCart();

  return (
    <div className="pt-16 md:pt-14 flex flex-col h-full">
      <h1 className="px-3 text-4xl">Your cart</h1>

      <hr className="mx-4 xl:mx-3 mt-8" />

      <section className="px-4 xl:px-3 h-full">
        {!cart || cart.length === 0 ? (
          <CartPlaceholder />
        ) : (
          cart.map((item, index) => <CartItemCard key={index} />)
        )}
      </section>
    </div>
  );
};

export default Cart;
