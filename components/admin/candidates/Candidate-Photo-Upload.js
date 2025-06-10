"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Camera, Upload, X } from "lucide-react"

export function CandidatePhotoUpload({ value, onChange, className = "" }) {
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
      <Label htmlFor="photo">Candidate Photo</Label>

      {preview ? (
        <Card className="relative overflow-hidden">
          <CardContent className="p-0">
            <div className="relative group">
              <img src={preview || "/placeholder.svg"} alt="Candidate preview" className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-2">
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
                <p className="text-lg font-medium text-gray-900">Upload candidate photo</p>
                <p className="text-sm text-gray-500 mt-1">Drag and drop an image here, or click to select</p>
                <p className="text-xs text-gray-400 mt-2">Recommended: 300x300px, JPG or PNG, max 5MB</p>
              </div>
              <Button type="button" variant="outline" className="mt-4">
                <Camera className="h-4 w-4 mr-2" />
                Choose Photo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        id="photo"
      />
    </div>
  )
}
