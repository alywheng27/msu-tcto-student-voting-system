"use client"

import Image from "next/image"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload, X } from "lucide-react"

export function PartyLogoUpload({ value, onChange, className = "" }) {
  const [preview, setPreview] = useState(value || "")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target.result
        setPreview(result)
        onChange(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleRemovePhoto = () => {
    setPreview("")
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {preview ? (
        <Card className="relative overflow-hidden">
          <CardContent className="p-4 flex justify-center">
            <div className="relative group w-40 h-40 flex items-center justify-center bg-gray-50 rounded-lg">
              <Image
                src={preview || "/placeholder.svg"}
                alt="Party logo preview"
                className="max-w-full max-h-full object-contain"
                width={250}
                height={250}
              />
              <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-2 flex items-center justify-center">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white text-black hover:bg-gray-100"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Change
                  </Button>
                  <Button type="button" variant="destructive" size="sm" onClick={handleRemovePhoto}>
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Upload party logo</p>
                <p className="text-sm text-gray-500 mt-1">Drag and drop an image here, or click to select</p>
                <p className="text-xs text-gray-400 mt-2">Recommended: Square format, PNG with transparency, max 2MB</p>
              </div>
              <Button type="button" variant="outline" className="mt-4">
                <Camera className="h-4 w-4 mr-2" />
                Choose Logo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />
    </div>
  )
}
