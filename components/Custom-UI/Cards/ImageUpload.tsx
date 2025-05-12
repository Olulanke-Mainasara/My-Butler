"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/Shad-UI/dropzone";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import React from "react";

export const ImageUpload = ({
  bucketName,
  path,
  maxFiles,
  maxFileSize,
  onUploadSuccess,
}: {
  bucketName: string;
  path: string;
  maxFiles: number;
  maxFileSize: number;
  onUploadSuccess: (imageNames: string[]) => void;
}) => {
  const props = useSupabaseUpload({
    bucketName,
    path,
    allowedMimeTypes: ["image/*"],
    maxFiles,
    maxFileSize,
  });

  const { successes } = props;

  // Call the onUploadSuccess function with the file paths when the files are successfully uploaded
  React.useEffect(() => {
    if (successes.length > 0) {
      onUploadSuccess(successes);
    }
  }, [onUploadSuccess, successes]);

  return (
    <div className="w-full p-10 md:p-20 bg-neutral-900 rounded-lg">
      <Dropzone {...props}>
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </div>
  );
};
