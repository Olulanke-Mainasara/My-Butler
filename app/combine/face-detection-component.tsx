import React, { useRef, useEffect, useState } from "react";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";
import { CameraIcon } from "lucide-react";

const FaceDetectionComponent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFaceAligned, setIsFaceAligned] = useState(false);
  const [capturedImage, setCapturedImage] = useState("");

  useEffect(() => {
    const video = videoRef.current;

    const startVideo = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (video) {
          video.srcObject = stream;
        }
      }
    };

    const loadModelAndDetectFaces = async () => {
      await tf.setBackend("webgl");
      await tf.ready();
      const model = await blazeface.load();

      const detectFaces = async () => {
        if (video) {
          const predictions = await model.estimateFaces(video, false);

          // Draw the overlay for visual debugging
          if (predictions.length > 0) {
            const { topLeft, bottomRight } = predictions[0];
            const [x1, y1] = Array.isArray(topLeft)
              ? topLeft
              : topLeft.arraySync();
            const [x2, y2] = Array.isArray(bottomRight)
              ? bottomRight
              : bottomRight.arraySync();
            const width = x2 - x1;
            const height = y2 - y1;

            // Determine if the detected face is aligned with a predefined overlay area
            const isHorizontallyAligned = x1 > 50 && x1 + width < 500;
            const isVerticallyAligned = y1 > 35 && y1 + height < 400;

            setIsFaceAligned(isHorizontallyAligned && isVerticallyAligned);
          } else {
            setIsFaceAligned(false);
          }

          requestAnimationFrame(detectFaces);
        }
      };

      detectFaces();
    };

    startVideo();
    loadModelAndDetectFaces();

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
    <>
      {!isFaceAligned && !capturedImage ? (
        <div className="absolute inset-0 flex items-center justify-center backdrop-brightness-[20%] z-30">
          <p className="text-4xl">
            Please align your face in the specified area
          </p>
        </div>
      ) : null}

      {capturedImage && (
        <div className="absolute inset-0 flex items-center justify-center backdrop-brightness-[10%] z-30">
          <p className="text-4xl">Processing: 50%</p>
        </div>
      )}

      <div className="relative before">
        <video
          ref={videoRef}
          autoPlay
          className="w-full object-cover h-screen"
        />
        <button
          onClick={capturePhoto}
          className="absolute left-1/2 -translate-x-1/2 bottom-8 p-4 rounded-full bg-white hover:bg-black text-black hover:text-white transition-colors z-20"
        >
          <CameraIcon size={40} className="text-6xl" />
        </button>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </>
  );
};

export default FaceDetectionComponent;
