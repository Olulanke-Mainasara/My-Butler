"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/Shad-UI/button";
import { Input } from "@/components/Shad-UI/input";

interface FeaturesInputProps {
  value: string[] | null;
  onChange: (value: string[] | null) => void;
}

export function FeaturesInput({ value = [], onChange }: FeaturesInputProps) {
  const [newFeature, setNewFeature] = useState("");
  const features = value || [];

  const addFeature = () => {
    if (newFeature.trim() !== "") {
      onChange([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    onChange(newFeatures.length > 0 ? newFeatures : null);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="Add a feature"
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addFeature();
            }
          }}
        />
        <Button type="button" onClick={addFeature} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 items-center">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 rounded-md border bg-black text-white dark:bg-white dark:text-black"
          >
            <span className="flex-1">{feature}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeFeature(index)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
