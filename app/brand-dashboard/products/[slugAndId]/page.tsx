"use client";

import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useQueryClient } from "@tanstack/react-query";
import { getProductForEdit } from "@/lib/fetches";
import { getItemId, invalidateTable } from "@/lib/utils";
import { useBrandProfile } from "@/components/Providers/UserProvider";
import { Icons } from "@/components/Custom-UI/icons";
import { supabase } from "@/lib/supabase/client";
import { ProductForm } from "../product-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/Shad-UI/alert-dialog";
import { Button } from "@/components/Shad-UI/button";
import { Trash2 } from "lucide-react";

export default function EditProductPage() {
  const pathname = usePathname();
  const productId = getItemId(pathname.split("/").pop() || "");
  const router = useTransitionRouter();
  const queryClient = useQueryClient();
  const brandProfile = useBrandProfile();

  const { data: product, isError } = useQuery(
    getProductForEdit(productId || ""),
    { enabled: !!productId }
  );

  if (!productId) {
    toast.error("Product ID is missing.");
    router.push("/brand-dashboard/products");
    return;
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="w-6 h-6 animate-spin" /> Loading
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to load product");
    router.push("/brand-dashboard/products");
    return;
  }

  // Client-side guard against editing another brand's product. This is a
  // convenience, not a security boundary - the real guarantee has to come
  // from an RLS policy on `products` restricting UPDATE/DELETE to rows
  // where brand_id = auth.uid(), which needs verifying separately.
  if (brandProfile && product.brand_id !== brandProfile.id) {
    toast.error("You don't have access to this product.");
    router.push("/brand-dashboard/products");
    return;
  }

  const handleDelete = async () => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      toast.error("Failed to delete product. Please try again.");
      return;
    }

    invalidateTable(queryClient, "products");
    toast.success("Product deleted.");
    router.push("/brand-dashboard/products");
  };

  return (
    <div className="space-y-8">
      <ProductForm initialData={product} />

      <div className="xl:max-w-screen-sm space-y-2 pt-6 border-t border-destructive/30">
        <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
        <p className="text-sm opacity-70">
          Deleting a product removes it permanently and cannot be undone.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4" />
              Delete Product
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this product?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete &quot;{product.name}&quot;. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
