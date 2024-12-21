"use client";

import { CameraIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState("");

  useEffect(() => {
    const video = videoRef.current;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
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
  }, []);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get the image as a data URL
      const imageDataURL = canvas.toDataURL("image/png");
      setCapturedImage(imageDataURL);
    }
  };

  return (
    <div>
      <div id="cameraContainer">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-screen"
        ></video>
        <button
          onClick={capturePhoto}
          className="absolute left-1/2 -translate-x-1/2 bottom-8 p-4 rounded-full bg-white hover:bg-black text-black hover:text-white transition-colors z-20"
        >
          <CameraIcon size={40} className="text-6xl" />
        </button>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>

      {capturedImage !== "" && (
        <div className="absolute bottom-0 w-full px-6 pb-6">
          <Image
            src={capturedImage}
            alt="Captured image"
            width={300}
            height={300}
            className="w-full h-auto, max-w-xs rounded-lg"
          ></Image>
        </div>
      )}
    </div>
  );
};

export default Camera;
