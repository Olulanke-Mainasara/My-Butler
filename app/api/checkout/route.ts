import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { getURL } from "@/lib/utils";

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: cartItems, error: cartError } = await supabase
      .from("cart")
      .select("item_id, item_type, quantity")
      .eq("user_id", user.id);

    if (cartError) {
      return NextResponse.json({ error: cartError.message }, { status: 500 });
    }

    // Only products can be in the cart today (the only AddToCart call site
    // in the app passes itemType: "product"), but don't silently include
    // anything else if that ever changes without this route being updated.
    const productItems = (cartItems ?? []).filter(
      (item) => item.item_type === "product" && item.item_id
    );

    if (productItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const productIds = productItems.map((item) => item.item_id as string);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, brand_id, name, price, stock_quantity, product_images")
      .in("id", productIds);

    if (productsError) {
      return NextResponse.json(
        { error: productsError.message },
        { status: 500 }
      );
    }

    const productsById = new Map((products ?? []).map((p) => [p.id, p]));

    const lineItems: {
      productId: string;
      brandId: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }[] = [];

    for (const cartItem of productItems) {
      const product = productsById.get(cartItem.item_id as string);
      if (!product) continue; // product was deleted since being added to cart

      const quantity = Math.min(cartItem.quantity, product.stock_quantity);
      if (quantity <= 0) continue; // out of stock

      lineItems.push({
        productId: product.id,
        brandId: product.brand_id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.product_images?.[0],
      });
    }

    if (lineItems.length === 0) {
      return NextResponse.json(
        { error: "Nothing in your cart is currently available" },
        { status: 400 }
      );
    }

    const totalAmount = lineItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ customer_id: user.id, total_amount: totalAmount })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    const { error: orderItemsError } = await supabase.from("order_items").insert(
      lineItems.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        brand_id: item.brandId,
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
      }))
    );

    if (orderItemsError) {
      return NextResponse.json(
        { error: orderItemsError.message },
        { status: 500 }
      );
    }

    const stripe = getStripe();
    const baseUrl = getURL();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      line_items: lineItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : undefined,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${baseUrl}orders/${order.id}?checkout=success`,
      cancel_url: `${baseUrl}cart?checkout=cancelled`,
      metadata: { order_id: order.id },
    });

    await supabase
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to start checkout" },
      { status: 500 }
    );
  }
}
