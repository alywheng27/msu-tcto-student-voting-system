"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ErrorComponent({ 
  error, 
  reset, 
  title = "Something went wrong", 
  description = "An error occurred while loading this content." 
}) {
  return (
    <Alert variant="destructive" className="max-w-md mx-auto">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="mt-2">
        <div className="font-medium">{title}</div>
        <div className="text-sm opacity-90 mt-1">{description}</div>
        {reset && (
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            className="mt-3"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
} 