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
import { useUserProfile } from "@/components/Providers/AllProviders";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { GalleryPlaceholder } from "../Placeholders/GalleryPlaceholder";
import { Image } from "@/types/Image";

export default function GalleryDrawerTrigger({
  setDeleting,
}: {
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = React.useState(false);
  const [openMobile, setOpenMobile] = React.useState(false);
  const [images, setImages] = React.useState<Image[]>([]);
  const userProfile = useUserProfile();

  const handleDelete = async (imagePath: string) => {
    setDeleting(true);

    const { error } = await supabase.storage
      .from("camera-pictures")
      .remove([imagePath]);

    if (error) {
      toast.error("Error deleting image, try again.");
      return;
    }

    setImages((prev) => prev.filter((image) => image.path !== imagePath));
    setDeleting(false);
    toast.success("Image deleted successfully.");
  };

  React.useEffect(() => {
    // Check if the user is logged in
    if (!userProfile) {
      return;
    }

    // Fetch the user's images from the database
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("camera_pictures")
        .select("*")
        .eq("user_id", userProfile?.id);

      if (error) {
        toast.error("Error fetching images");
      }

      if (data) {
        setImages(data);
      }
    };

    fetchImages();
  }, [userProfile]);

  if (!userProfile) {
    return;
  }

  return (
    <>
      <div className="md:hidden">
        <Drawer open={openMobile} onOpenChange={setOpenMobile}>
          <DrawerTrigger asChild>
            <ImageIcon size={30} />
          </DrawerTrigger>
          <DrawerContent className="h-fit max-h-[90dvh] pb-2">
            <DrawerHeader className="text-left px-2 pb-4">
              <DrawerTitle>Gallery</DrawerTitle>
              <DrawerDescription>View all your saved photos.</DrawerDescription>
            </DrawerHeader>
            {images.length === 0 ? (
              <section>
                <GalleryPlaceholder />
              </section>
            ) : (
              <section className="h-full overflow-y-scroll grid grid-cols-3 gap-[2px] px-2">
                {images.map((imageData, index) => (
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
            {images.length === 0 ? (
              <section>
                <GalleryPlaceholder />
              </section>
            ) : (
              <section className="h-full overflow-y-scroll grid grid-cols-4 gap-[2px]">
                {images.map((imageData, index) => (
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
