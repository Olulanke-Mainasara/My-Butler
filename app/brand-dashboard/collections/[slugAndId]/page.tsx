"use client";

import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useQueryClient } from "@tanstack/react-query";
import { getCollectionForEdit } from "@/lib/fetches";
import {
  getItemId,
  getStoragePathFromPublicUrl,
  invalidateTable,
} from "@/lib/utils";
import { useBrandProfile } from "@/components/Providers/UserProvider";
import { Icons } from "@/components/Custom-UI/icons";
import { supabase } from "@/lib/supabase/client";
import { CollectionForm } from "../collection-form";
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

export default function EditCollectionPage() {
  const pathname = usePathname();
  const collectionId = getItemId(pathname.split("/").pop() || "");
  const router = useTransitionRouter();
  const queryClient = useQueryClient();
  const brandProfile = useBrandProfile();

  const { data: collection, isError } = useQuery(
    getCollectionForEdit(collectionId || ""),
    { enabled: !!collectionId }
  );

  if (!collectionId) {
    toast.error("Collection ID is missing.");
    router.push("/brand-dashboard/collections");
    return;
  }

  if (!collection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="w-6 h-6 animate-spin" /> Loading
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to load collection");
    router.push("/brand-dashboard/collections");
    return;
  }

  if (brandProfile && collection.brand_id !== brandProfile.id) {
    toast.error("You don't have access to this collection.");
    router.push("/brand-dashboard/collections");
    return;
  }

  const handleDelete = async () => {
    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", collection.id);

    if (error) {
      toast.error("Failed to delete collection. Please try again.");
      return;
    }

    const imagePath = collection.display_image
      ? getStoragePathFromPublicUrl(collection.display_image, "collections")
      : null;
    if (imagePath) {
      const { error: storageError } = await supabase.storage
        .from("collections")
        .remove([imagePath]);
      if (storageError) {
        console.error("Failed to clean up collection image:", storageError);
      }
    }

    invalidateTable(queryClient, "collections");
    toast.success("Collection deleted.");
    router.push("/brand-dashboard/collections");
  };

  return (
    <div className="space-y-8">
      <CollectionForm initialData={collection} />

      <div className="xl:max-w-screen-sm space-y-2 pt-6 border-t border-destructive/30">
        <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
        <p className="text-sm opacity-70">
          Deleting a collection removes it permanently and cannot be undone.
          Products already assigned to it won&apos;t be deleted, but their
          collection reference will point to nothing until you reassign them.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4" />
              Delete Collection
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this collection?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete &quot;{collection.name}&quot;.
                This action cannot be undone.
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
