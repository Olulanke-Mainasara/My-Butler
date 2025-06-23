import { CartItem } from "@/types/CartItem";
import React from "react";

const CartItemCard = ({ item }: { item?: CartItem }) => {
  console.log(item);
  return <div className="border-b p-8"></div>;
};

export default CartItemCard;
