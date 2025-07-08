"use client";

import React, { useState } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Card, CardContent } from "@/components/Shad-UI/card";
import { Switch } from "@/components/Shad-UI/switch";
import { Label } from "@/components/Shad-UI/label";
import { Input } from "@/components/Shad-UI/input";
import { Canvas } from "@react-three/fiber";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  EyeOff,
  Paintbrush,
} from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export function ModelWithControls(props) {
  const { nodes, materials } = useGLTF("/Models/womanincloths.glb");
  const [controlOpen, setControlOpen] = useState(false);
  const isMobile = useIsMobile();

  const meshData = [
    {
      name: "Object_2",
      geometry: nodes.Object_2.geometry,
      material: materials.material_0,
    },
    {
      name: "Object_3",
      geometry: nodes.Object_3.geometry,
      material: materials.Angel_Top,
    },
    {
      name: "Object_4",
      geometry: nodes.Object_4.geometry,
      material: materials.Body,
    },
    {
      name: "Object_5",
      geometry: nodes.Object_5.geometry,
      material: materials.material,
    },
    {
      name: "Object_6",
      geometry: nodes.Object_6.geometry,
      material: materials.Executive_Hair,
    },
    {
      name: "Object_7",
      geometry: nodes.Object_7.geometry,
      material: materials.Executive_Hair,
    },
    {
      name: "Object_8",
      geometry: nodes.Object_8.geometry,
      material: materials.Face,
    },
    {
      name: "Object_9",
      geometry: nodes.Object_9.geometry,
      material: materials.Face,
    },
    {
      name: "Object_10",
      geometry: nodes.Object_10.geometry,
      material: materials.Face,
    },
    {
      name: "Object_11",
      geometry: nodes.Object_11.geometry,
      material: materials.Glasses,
    },
    {
      name: "Object_12",
      geometry: nodes.Object_12.geometry,
      material: materials.Lingerie,
    },
    {
      name: "Object_13",
      geometry: nodes.Object_13.geometry,
      material: materials.Scarpins_Strap,
    },
    {
      name: "Object_14",
      geometry: nodes.Object_14.geometry,
      material: materials.Scarpins_Strap,
    },
    {
      name: "Object_15",
      geometry: nodes.Object_15.geometry,
      material: materials.Skirt,
    },
    {
      name: "Object_16",
      geometry: nodes.Object_16.geometry,
      material: materials.Socks,
    },
    {
      name: "Object_17",
      geometry: nodes.Object_17.geometry,
      material: materials.Socks,
    },
    {
      name: "Object_18",
      geometry: nodes.Object_18.geometry,
      material: materials.Socks,
    },
    {
      name: "Object_19",
      geometry: nodes.Object_19.geometry,
      material: materials.Socks,
    },
    {
      name: "Object_20",
      geometry: nodes.Object_20.geometry,
      material: materials.Thong_Panties,
    },
    {
      name: "Object_21",
      geometry: nodes.Object_21.geometry,
      material: materials.Wristwatch,
    },
    {
      name: "Object_22",
      geometry: nodes.Object_22.geometry,
      material: materials.Wristwatch,
    },
  ];

  const [meshStates, setMeshStates] = useState(
    meshData.map(() => ({
      visible: true,
      color: "", // empty string means default
    }))
  );

  const handleToggle = (index) => {
    setMeshStates((prev) =>
      prev.map((s, i) => (i === index ? { ...s, visible: !s.visible } : s))
    );
  };

  const handleColorChange = (index, value) => {
    setMeshStates((prev) =>
      prev.map((s, i) => (i === index ? { ...s, color: value } : s))
    );
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row w-full h-full pt-12 relative">
      {/* UI Panel */}
      <motion.div
        animate={
          controlOpen
            ? isMobile
              ? { height: "100%", display: "grid" }
              : { width: "100%", height: "100%", display: "grid" }
            : isMobile
            ? { height: 0, display: "none" }
            : { width: 0, height: "100%", display: "none" }
        }
        className="lg:h-full h-1/2 hidden grid-cols-2 md:grid-cols-3 gap-5 overflow-y-auto p-4 absolute top-0"
      >
        {meshData.map((mesh, index) => (
          <Card
            key={mesh.name}
            className="border-none bg-neutral-900 text-white dark:bg-white dark:text-black"
          >
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold">{mesh.material.name}</h4>

                <div className="flex items-center justify-gap-2">
                  <Label
                    htmlFor={`visible-${index}`}
                    className="cursor-pointer"
                  >
                    {meshStates[index].visible ? <Eye /> : <EyeOff />}
                  </Label>
                  <Switch
                    id={`visible-${index}`}
                    checked={meshStates[index].visible}
                    onCheckedChange={() => handleToggle(index)}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor={`color-${index}`}>
                  <Paintbrush />
                </Label>
                <Input
                  id={`color-${index}`}
                  type="color"
                  value={meshStates[index].color || "#ffffff"}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="w-full h-8 p-0 border-none"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="flex items-center justify-center pb-4 lg:pb-0">
        {
          <button
            onClick={() => setControlOpen(!controlOpen)}
            className="bg-neutral-900 w-20 lg:w-auto lg:h-20 text-white dark:bg-white dark:text-black flex items-center justify-center rounded-tl-3xl rounded-tr-3xl lg:rounded-tl-none lg:rounded-br-3xl"
          >
            <span className="hidden lg:block">
              {controlOpen ? <ChevronLeft /> : <ChevronRight />}
            </span>
            <span className="lg:hidden">
              {controlOpen ? <ChevronDown /> : <ChevronUp />}
            </span>
          </button>
        }
      </div>

      <Canvas>
        <ambientLight intensity={0.5} />

        <group {...props} dispose={null}>
          <group
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -3, 0]}
            scale={3.3}
          >
            {meshData.map((mesh, index) => {
              const state = meshStates[index];
              if (!state.visible) return null;
              return (
                <mesh
                  key={mesh.name}
                  geometry={mesh.geometry}
                  material={mesh.material}
                  material-color={state.color || undefined}
                />
              );
            })}
          </group>
        </group>

        <OrbitControls />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/Models/womanincloths.glb");
