"use client";

import CameraComponent from "@/app/camera/camera-component";
import { Icons } from "@/components/Custom-UI/icons";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { toast } from "sonner";
import { base64ToFile } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { Download, Share, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useTransitionRouter } from "next-view-transitions";
import { Dialog, DialogContent } from "@/components/Shad-UI/dialog";

const Camera = () => {
  const customerProfile = useCustomerProfile();
  const [file, setFile] = React.useState<File | null>(null);
  const [savingPicture, setSavingPicture] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [capturedImage, setCapturedImage] = React.useState("");
  const router = useTransitionRouter();

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);

    // Convert Base64 string to a File object
    const file = base64ToFile(imageData, `IMG_${Date.now()}.png`);
    setFile(file);
  };

  const handleDirectShare = async () => {
    if (!file) {
      setSavingPicture(false);
      toast.error("No image to upload");
      return;
    }

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
      toast.info("Sharing is not supported on this device.");
    }
  };

  const handleSave = async () => {
    // Some relevant checks
    if (!customerProfile) {
      setSavingPicture(false);
      toast.info("You need to log in first", {
        action: {
          label: "Login",
          onClick: () => router.push("/auth/login"),
        },
      });
      return;
    }

    if (saved) {
      toast.info("Image already saved");
      return;
    }

    if (!file) {
      setSavingPicture(false);
      toast.error("No image to upload");
      return;
    }

    setSavingPicture(true);

    // Define storage path
    const filePath = `${customerProfile.id}/${file.name}`;

    // Upload the image to a supabase storage bucket
    const { data, error } = await supabase.storage
      .from("camera-pictures")
      .upload(filePath, file, { contentType: file.type });

    if (error) {
      toast.error("Upload error", {
        description: error.message,
      });
    } else {
      // Get the public url of the image
      const { data: urlData } = supabase.storage
        .from("camera-pictures")
        .getPublicUrl(data.path);

      // Insert the details & public url of the image in a database table
      const { error } = await supabase.from("camera_pictures").insert({
        id: data.id,
        image_url: urlData.publicUrl,
        full_path: data.fullPath,
        path: data.path,
      });

      // If there is an error in the insertion, remove the image from the storage bucket
      if (error) {
        await supabase.storage.from("camera_pictures").remove([data.path]);

        toast.error("Upload error", {
          description: error.message,
        });
      } else {
        toast.success("Image saved successfully");
        setSaved(true);
      }
    }

    setSavingPicture(false);
  };

  return capturedImage !== "" ? (
    <>
      <div className="absolute inset-0 w-full z-30">
        {savingPicture && (
          <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-brightness-50">
            <p className="flex gap-2 text-xl">
              <Icons.spinner className="animate-spin" />
              Saving
            </p>
          </div>
        )}

        <Image
          src={capturedImage}
          alt="Captured image"
          width={300}
          height={300}
          className="w-full h-full object-cover"
        />

        <div className="absolute w-full bottom-4 flex items-center justify-center gap-20 text-white">
          <a
            href={capturedImage}
            download={`IMG_${Date.now()}.png`}
            className="hidden xl:block"
          >
            <Download size={25} />
          </a>
          <button onClick={handleDirectShare} className="xl:hidden">
            <Download size={25} />
          </button>
          <button
            className="px-6 py-2 text-xl rounded-full bg-white hover:bg-black text-black hover:text-white transition-colors border"
            onClick={handleSave}
          >
            Save
          </button>
          <button onClick={handleDirectShare}>
            <Share size={25} />
          </button>
        </div>
      </div>

      <button
        className="absolute top-3 z-40 right-3 text-white"
        onClick={() => {
          setSaved(false);
          setCapturedImage("");
        }}
      >
        <X size={25} />
      </button>
    </>
  ) : (
    <>
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

      <CameraComponent
        handleCapture={handleCapture}
        setDeleting={setDeleting}
      />
    </>
  );
};

export default Camera;
