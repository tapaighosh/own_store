"use client";

import { useState, useRef } from "react";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface StockManagerProps {
  value: number;
  productId: string;
  field: "stock" | "lowStockThreshold";
  onChange: (id: string, field: "stock" | "lowStockThreshold", value: number) => void;
}

export function StockManager({ value, productId, field, onChange }: StockManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  const min = field === "stock" ? 0 : 1;

  const handleSave = () => {
    let parsed = parseInt(currentValue, 10);
    
    if (isNaN(parsed) || parsed < min) {
      parsed = min;
    }

    setCurrentValue(parsed.toString());
    setIsEditing(false);
    
    if (parsed !== value) {
      onChange(productId, field, parsed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setCurrentValue(value.toString());
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        type="number"
        min={min}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-24 h-8 text-sm"
        autoFocus
      />
    );
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-2 cursor-pointer p-1.5 -ml-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors w-24"
      )}
      onClick={() => {
        setCurrentValue(value.toString());
        setIsEditing(true);
      }}
    >
      <span className="font-mono text-sm">{value}</span>
      <Pencil className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
