"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client"; // adjust path
import { toast } from "sonner";
import { Icons } from "@/components/Custom-UI/icons";
import { User } from "lucide-react";

interface Props {
  userId: string;
  currentImageUrl?: string;
  onUpload?: (newUrl: string) => void;
}

export const ProfilePictureUpload: React.FC<Props> = ({
  userId,
  currentImageUrl,
  onUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImageUrl || "");

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}.${fileExt}`;

    try {
      // Delete existing file first (if it exists)
      if (currentImageUrl) {
        const currentPath = currentImageUrl.split("/").pop();
        if (currentPath) {
          await supabase.storage.from("avatars").remove([currentPath]);
        }
      }

      if (imageUrl) {
        const currentPath = imageUrl.split("/").pop();
        if (currentPath) {
          await supabase.storage.from("avatars").remove([currentPath]);
        }
      }

      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = await supabase.storage.from("avatars").getPublicUrl(filePath);

      setImageUrl(publicUrl);
      onUpload?.(publicUrl);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className="relative w-28 h-28 rounded-full overflow-hidden border shadow cursor-pointer"
        onClick={handleImageClick}
      >
        {uploading ? (
          <div className="flex items-center justify-center h-full w-full bg-gray-100 dark:bg-black">
            <Icons.spinner className="animate-spin" />
          </div>
        ) : !currentImageUrl && !imageUrl ? (
          <div className="flex items-center justify-center bg-darkBackground text-white dark:bg-lightBackground dark:text-black w-full h-full">
            <User size={80} />
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt="Profile Picture"
            fill
            className="object-cover"
          />
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-lg opacity-70">Click the picture to update</p>
    </div>
  );
};
