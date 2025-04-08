"use client";

import React, { useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { FBXLoader } from "three-stdlib";

// FBX Model Component
const Model = ({ color, scale }: { color: number[]; scale: number }) => {
  const scene = useLoader(FBXLoader, "/Models/standingIdle.fbx");
  const [mixer] = useState(() => new THREE.AnimationMixer(scene));
  console.log(color);

  // Play animations when available
  useEffect(() => {
    if (scene.animations.length > 0) {
      const action = mixer.clipAction(scene.animations[0]);
      action.play();
    } else {
      console.warn("No animations found in FBX file");
    }

    return () => {
      mixer.stopAllAction();
    };
  }, [scene, mixer]);

  // Update mixer on every frame
  useFrame((_, delta) => {
    mixer.update(delta);
  });

  // Clean up geometry and materials
  useEffect(() => {
    return () => {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose?.());
          } else {
            child.material.dispose?.();
          }
        }
      });
    };
  }, [scene]);

  return <primitive object={scene} scale={scale} position={[0, -2.5, 0]} />;
};

export default function Default() {
  const [rgbColor, setRgbColor] = useState([0, 0, 0]);
  const [hexColor, setHexColor] = useState("#000000");
  const [scale, setScale] = useState(0.03);

  // Convert HEX to RGB
  const hexToRgb = (hex: string): number[] => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setHexColor(hex);
    setRgbColor(hexToRgb(hex));
  };

  return (
    <div className="flex flex-col items-center h-full">
      {/* 3D Canvas */}
      <Canvas className="w-full h-screen">
        <ambientLight />
        <Model color={rgbColor} scale={scale} />
        <OrbitControls />
      </Canvas>

      {/* Controls */}
      <div className="absolute bottom-4 flex gap-4 bg-white p-4 rounded shadow">
        <div className="text-black flex gap-1 items-center">
          <label htmlFor="color">Color:</label>
          <input
            id="color"
            type="color"
            value={hexColor}
            onChange={handleColorChange}
          />
        </div>
        <div className="text-black flex gap-1 items-center">
          <label htmlFor="scale">Scale:</label>
          <input
            id="scale"
            type="range"
            min="0.1"
            max="3"
            step="0.01"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
