"use client";
import { Dialog, DialogContent } from "@/components/Shad-UI/dialog";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { LoginPlaceholder } from "@/components/Custom-UI/Placeholders/LoginPlaceholder";
import { GalleryPlaceholder } from "@/components/Custom-UI/Placeholders/GalleryPlaceholder";
import PictureDialogTrigger from "@/components/Custom-UI/Buttons/PictureDialogTrigger";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { Icons } from "@/components/Custom-UI/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingSkeleton from "@/components/Custom-UI/Skeletons/LoadingSkeleton";
import { getImages } from "@/lib/fetches";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { deleteImage } from "@/lib/mutations";

const GalleryPage = () => {
  const customerProfile = useCustomerProfile();
  const [deleting, setDeleting] = useState(false);
  const queryClient = useQueryClient();

  // Fetch images using React Query
  const {
    data: images,
    isPending,
    isError,
  } = useQuery(getImages(customerProfile?.id || ""), {
    enabled: !!customerProfile,
  });

  const { mutate: handleDelete } = useMutation({
    mutationFn: (imagePath: string) => deleteImage(supabase, imagePath),

    onSuccess: () => {
      toast.success("Image deleted successfully.");

      // Simply invalidate all image queries
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey.includes("camera_pictures"),
      });
    },

    onError: () => {
      toast.error("Error deleting image, try again.");
    },
  });

  const isLoading = customerProfile && isPending;

  const showEmptyState = images && images.length === 0;

  return (
    <div className="flex flex-col h-full space-y-2">
      <div className="flex flex-col items-center md:items-start gap-1">
        <h1 className="text-4xl">Your Gallery</h1>
        <p className="opacity-70">View and manage your saved photos</p>
      </div>

      {!customerProfile ? (
        <LoginPlaceholder info="your saved photos" />
      ) : isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <div className="text-center py-20 border rounded-lg">
          <p className="text-red-500">
            Error loading images. Please try again.
          </p>
        </div>
      ) : showEmptyState ? (
        <section>
          <GalleryPlaceholder />
        </section>
      ) : (
        <section className="overflow-y-scroll grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[2px]">
          {images?.map((imageData, index) => (
            <PictureDialogTrigger
              image={imageData}
              key={imageData.id || index}
              handleDelete={handleDelete}
            />
          ))}
        </section>
      )}

      {deleting && (
        <Dialog open={deleting} onOpenChange={setDeleting}>
          <DialogContent
            className="bg-transparent dark:bg-transparent border-none flex items-center justify-center"
            showX={false}
          >
            <p className="flex gap-2 text-xl">
              <Icons.spinner className="animate-spin" />
              Deleting
            </p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GalleryPage;
