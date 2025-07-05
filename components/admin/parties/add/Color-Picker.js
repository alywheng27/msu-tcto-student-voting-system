"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"

export function ColorPicker({ color, onChange, id }) {
  const [isOpen, setIsOpen] = useState(false)

  const presetColors = [
    "#2196F3", // Blue
    "#4CAF50", // Green
    "#FF9800", // Orange
    "#9C27B0", // Purple
    "#F44336", // Red
    "#00BCD4", // Cyan
    "#795548", // Brown
    "#607D8B", // Blue Grey
    "#E91E63", // Pink
    "#FFEB3B", // Yellow
    "#673AB7", // Deep Purple
    "#3F51B5", // Indigo
  ]

  const handleColorChange = (e) => {
    onChange(e.target.value)
  }

  const handlePresetSelect = (presetColor) => {
    onChange(presetColor)
    setIsOpen(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            value={color}
            onChange={handleColorChange}
            id={id}
            placeholder="#RRGGBB"
            pattern="^#([A-Fa-f0-9]{6})$"
            title="Hex color code (e.g. #FF0000)"
          />
        </div>
        <div
          className="w-10 h-10 rounded-md border border-gray-200 cursor-pointer"
          style={{ backgroundColor: color }}
          onClick={() => document.getElementById(`color-picker-${id}`)?.click()}
        />
        <Input type="color" value={color} onChange={handleColorChange} id={`color-picker-${id}`} className="sr-only" />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Preset Colors</h4>
              <div className="grid grid-cols-6 gap-2">
                {presetColors.map((presetColor) => (
                  <div
                    key={presetColor}
                    className="w-8 h-8 rounded-md cursor-pointer relative flex items-center justify-center"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => handlePresetSelect(presetColor)}
                  >
                    {color === presetColor && <Check className="h-4 w-4 text-white drop-shadow-md" />}
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <p className="text-xs text-muted-foreground">Enter a hex color code (e.g. #FF0000) or use the color picker</p>
    </div>
  )
}
