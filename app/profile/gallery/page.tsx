"use client";

import { Dialog, DialogContent } from "@/components/Shad-UI/dialog";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { LoginPlaceholder } from "@/components/Custom-UI/Placeholders/LoginPlaceholder";
import { GalleryPlaceholder } from "@/components/Custom-UI/Placeholders/GalleryPlaceholder";
import PictureDialogTrigger from "@/components/Custom-UI/Buttons/PictureDialogTrigger";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Image } from "@/types/Image";
import { Icons } from "@/components/Custom-UI/icons";

const GalleryPage = () => {
  const [images, setImages] = useState<Image[]>([]);
  const customerProfile = useCustomerProfile();
  const [deleting, setDeleting] = useState(false);

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

  useEffect(() => {
    // Check if the user is logged in
    if (!customerProfile) {
      return;
    }

    // Fetch the user's images from the database
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("camera_pictures")
        .select("*")
        .eq("user_id", customerProfile?.id);

      if (error) {
        toast.error("Error fetching images");
      }

      if (data) {
        setImages(data);
      }
    };

    fetchImages();
  }, [customerProfile]);

  return (
    <div className="flex flex-col h-full space-y-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl">Your Gallery</h1>
        <p className="opacity-70">View and manage your saved photos</p>
      </div>

      {!customerProfile ? (
        <LoginPlaceholder info="your saved photos" />
      ) : images.length === 0 ? (
        <section>
          <GalleryPlaceholder />
        </section>
      ) : (
        <section className="h-full overflow-y-scroll grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-[2px]">
          {images.map((imageData, index) => (
            <PictureDialogTrigger
              image={imageData}
              key={index}
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
