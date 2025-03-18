import React from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/Shad-UI/dialog";
import Image from "next/image";
import { Image as ImageType } from "@/types/Image";
import { Share, Trash2 } from "lucide-react";
import { toast } from "sonner";

const PictureDialogTrigger = ({
  image,
  handleDelete,
}: {
  image: ImageType;
  handleDelete: (imagePath: string) => void;
}) => {
  const [open, setOpen] = React.useState(false);

  const deleteImage = async () => {
    await handleDelete(image.path);
    setOpen(false);
  };

  const handleDownload = async () => {
    try {
      if (!image.image_url) {
        toast.error("No image to download");
        return;
      }

      // Fetch the image as a Blob
      const response = await fetch(image.image_url);
      const blob = await response.blob();

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element and trigger a download
      const a = document.createElement("a");
      a.href = url;
      a.download = image.path.split("/").pop() || "downloaded-image.png";
      document.body.appendChild(a);
      a.click();

      // Clean up
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Error downloading the image.");
    }
  };

  const handleShare = async () => {
    if (!image.image_url) {
      toast.error("No image to share");
      return;
    }

    try {
      // Fetch the image as a Blob
      const response = await fetch(image.image_url);
      const blob = await response.blob();
      const fileName = image.path.split("/").pop() || "shared-image.png";

      // Convert Blob to File
      const file = new File([blob], fileName, { type: blob.type });

      // Check if Web Share API is available
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: "Check out this image!",
            text: "Here's an image I captured.",
            files: [file],
          });
          return;
        } catch {
          toast.info("Sharing canceled or failed.");
        }
      } else {
        toast.info("Sharing not supported on this device.");
      }
    } catch {
      toast.error("Error fetching or sharing the image.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        <Image
          src={image.image_url}
          alt="Picture"
          width={40}
          height={40}
          className="w-full h-full max-h-32 object-cover"
        />
      </DialogTrigger>
      <DialogContent className="w-[95%] max-h-[40dvh] sm:max-w-[85vw] h-full md:max-h-[55dvh] xl:max-h-[90dvh] p-0">
        <div className="flex items-center justify-center h-full overflow-hidden">
          <Image
            src={image.image_url}
            alt="Picture"
            width={800}
            height={800}
            className="w-full h-full"
          />

          <div className="absolute w-full bottom-4 flex items-center justify-center gap-20 text-white">
            <button onClick={handleShare}>
              <Share size={25} />
            </button>
            <button
              onClick={handleDownload}
              className="px-6 py-2 text-xl rounded-full bg-white hover:bg-black text-black hover:text-white transition-colors border"
            >
              Download
            </button>
            <button onClick={deleteImage}>
              <Trash2 size={25} />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PictureDialogTrigger;
