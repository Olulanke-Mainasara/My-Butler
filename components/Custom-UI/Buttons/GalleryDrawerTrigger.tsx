import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Shad-UI/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/Shad-UI/drawer";
import { ImageIcon } from "lucide-react";
import PictureDialogTrigger from "./PictureDialogTrigger";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { GalleryPlaceholder } from "../Placeholders/GalleryPlaceholder";
import { LoginPlaceholder } from "../Placeholders/LoginPlaceholder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteImage } from "@/lib/mutations";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getImages } from "@/lib/fetches";
import LoadingSkeleton from "../Skeletons/LoadingSkeleton";

export default function GalleryDrawerTrigger({
  setDeleting,
}: {
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = React.useState(false);
  const [openMobile, setOpenMobile] = React.useState(false);
  const customerProfile = useCustomerProfile();
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
      setDeleting(false);
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
    <>
      <div className="md:hidden">
        <Drawer open={openMobile} onOpenChange={setOpenMobile}>
          <DrawerTrigger asChild>
            <ImageIcon size={30} />
          </DrawerTrigger>
          <DrawerContent className="h-[65dvh] max-h-[90dvh] pb-2">
            <DrawerHeader className="text-left px-2 pb-4">
              <DrawerTitle>Gallery</DrawerTitle>
              <DrawerDescription>View all your saved photos.</DrawerDescription>
            </DrawerHeader>
            {!customerProfile ? (
              <LoginPlaceholder
                info="your saved photos"
                close={setOpenMobile}
              />
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
              <section className="overflow-y-scroll grid grid-cols-3 gap-[2px] px-2">
                {images?.map((imageData, index) => (
                  <PictureDialogTrigger
                    image={imageData}
                    key={index}
                    handleDelete={handleDelete}
                  />
                ))}
              </section>
            )}
          </DrawerContent>
        </Drawer>
      </div>

      <div className="hidden md:block">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild className="cursor-pointer">
            <ImageIcon size={30} />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] h-fit max-h-[55dvh] xl:max-h-[70dvh] gap-0">
            <DialogHeader className="pb-4">
              <DialogTitle>Gallery</DialogTitle>
              <DialogDescription>View all your saved photos.</DialogDescription>
            </DialogHeader>
            {!customerProfile ? (
              <LoginPlaceholder info="your saved photos" close={setOpen} />
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
              <section className="h-full overflow-y-scroll grid grid-cols-3 gap-[2px] px-2">
                {images?.map((imageData, index) => (
                  <PictureDialogTrigger
                    image={imageData}
                    key={index}
                    handleDelete={handleDelete}
                  />
                ))}
              </section>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
