import { Json } from "@/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export async function toggleBookmark(
  client: SupabaseClient,
  target_type: string,
  target_id: string
) {
  const { data, error } = await client.rpc("toggle_bookmark", {
    _target_type: target_type,
    _target_id: target_id,
  });

  if (error) {
    throw error;
  }

  return data as "added" | "removed";
}

export async function updateCustomerProfile(
  client: SupabaseClient,
  details: {
    supabase_user_id: string;
    display_name: string;
    profile_picture: string;
    email: string;
    location: string;
  }
) {
  const { error } = await client.rpc("update_customer_details", {
    _supabase_user_id: details.supabase_user_id,
    _display_name: details.display_name,
    _profile_picture: details.profile_picture,
    _email: details.email,
    _location: details.location,
  });

  if (error) {
    throw error;
  }
}

export async function updateBrandProfile(
  client: SupabaseClient,
  details: {
    supabase_user_id: string;
    name: string;
    email: string;
    location: string;
    url: string;
    contact: string;
    description: string;
    profile_picture: string;
  }
) {
  const { error } = await client.rpc("update_brand_details", {
    _supabase_user_id: details.supabase_user_id,
    _name: details.name,
    _email: details.email,
    _location: details.location,
    _url: details.url,
    _contact: details.contact,
    _description: details.description,
    _profile_picture: details.profile_picture,
  });

  if (error) {
    throw error;
  }
}

export async function toggleCart(
  client: SupabaseClient,
  item_id: string,
  quantity: number,
  item_type: string
) {
  const { data, error } = await client.rpc("toggle_cart", {
    _item_id: item_id,
    _quantity: quantity,
    _item_type: item_type,
  });

  if (error) {
    throw error;
  }

  return data as "added" | "removed";
}

export const deleteChat = async (client: SupabaseClient, chatId: string) => {
  return client.from("chats").delete().eq("id", chatId);
};

export async function saveChat({
  client,
  chatId,
  title,
  messages,
}: {
  client: SupabaseClient;
  chatId: string;
  title?: string;
  messages: Json[];
}) {
  if (title) {
    return client.from("chats").insert({
      id: chatId,
      title,
      messages,
    });
  }

  return client.from("chats").update({ messages }).eq("id", chatId);
}

export const deleteImage = async (
  client: SupabaseClient,
  imagePath: string
) => {
  return client.storage.from("camera-pictures").remove([imagePath]);
};
