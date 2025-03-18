"use client";

import React from "react";
import { CameraIcon, SwitchCamera } from "lucide-react";
import GalleryDrawerTrigger from "@/components/Custom-UI/Buttons/GalleryDrawerTrigger";

const CameraComponent = ({
  handleCapture,
  setDeleting,
}: {
  handleCapture: (image: string) => void;
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [cameraMode, setCameraMode] = React.useState("environment");

  const toggleCamera = () => {
    if (cameraMode === "environment") {
      setCameraMode("user");
    } else {
      setCameraMode("environment");
    }
  };

  React.useEffect(() => {
    const video = videoRef.current;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraMode },
        });
        if (video) {
          video.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };

    startCamera();

    return () => {
      if (video && video.srcObject instanceof MediaStream) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [cameraMode]);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get the image as a data URL
      const imageDataURL = canvas.toDataURL("image/png");
      handleCapture(imageDataURL);

      // Stop the video stream
      if (video.srcObject instanceof MediaStream) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
  };

  return (
    <div>
      <div id="cameraContainer">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-screen object-cover"
        ></video>
        <div className="absolute bottom-0 w-full p-4 z-20 flex items-center justify-center gap-20 text-white">
          <GalleryDrawerTrigger setDeleting={setDeleting} />
          <button
            onClick={capturePhoto}
            className="p-4 rounded-full bg-white hover:bg-black text-black hover:text-white transition-colors border"
          >
            <CameraIcon size={38} className="text-6xl" />
          </button>
          <button onClick={() => toggleCamera()}>
            <SwitchCamera size={30} />
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
};

export default CameraComponent;
