"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/Shad-UI/button";
import { Input } from "@/components/Shad-UI/input";
import { Label } from "@/components/Shad-UI/label";

interface SpecificationsInputProps {
  value: Record<string, string> | null;
  onChange: (value: Record<string, string> | null) => void;
}

export function SpecificationsInput({
  value = {},
  onChange,
}: SpecificationsInputProps) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const specifications = value || {};

  const addSpecification = () => {
    if (newKey.trim() !== "") {
      onChange({
        ...specifications,
        [newKey.trim()]: newValue.trim(),
      });
      setNewKey("");
      setNewValue("");
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecifications = { ...specifications };
    delete newSpecifications[key];
    onChange(
      Object.keys(newSpecifications).length > 0 ? newSpecifications : null
    );
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="spec-key">Specification Key</Label>
          <Input
            id="spec-key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="e.g., Weight, Dimensions"
          />
        </div>
        <div>
          <Label htmlFor="spec-value">Specification Value</Label>
          <div className="flex gap-2">
            <Input
              id="spec-value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="e.g., 2.5kg, 10x15x5cm"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSpecification();
                }
              }}
            />
            <Button type="button" onClick={addSpecification} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {Object.entries(specifications).map(([key, value], index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 rounded-md border bg-black text-white dark:bg-white dark:text-black"
          >
            <span className="font-medium">{key}:</span>
            <span className="flex-1">{value}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeSpecification(key)}
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
