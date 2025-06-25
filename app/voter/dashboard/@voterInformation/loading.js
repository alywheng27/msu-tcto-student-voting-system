"use client"

import { Loader2 } from "lucide-react"

export default function LoadingComponent({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-gray-500 mb-2" />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  )
}
