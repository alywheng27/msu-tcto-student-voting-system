"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Archive, AlertTriangle, Crown, Users } from "lucide-react"

export function ArchivePositionDialog({ position, children, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)

  const handleArchive = async () => {
    setIsArchiving(true)

    try {
      // In a real app, this would call an API to archive the position
      console.log("Archiving position:", position.id)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSuccess?.({
        title: "Success",
        description: `${position.name} has been archived successfully.`,
        variant: "success",
      })

      setIsOpen(false)

      // In a real app, you would refresh the data or update the UI
      // For demo purposes, we'll just reload the page after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error("Error archiving position:", error)
      onSuccess?.({
        title: "Error",
        description: "Failed to archive position. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsArchiving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Archive Position
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to archive <strong>{position.name}</strong>? This will make the position unavailable
            for future elections, but it can be restored later if needed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 p-4 border rounded-lg bg-orange-50 text-orange-800">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100">
            {position.type === "ssc" ? (
              <Crown className="h-6 w-6 text-orange-600" />
            ) : (
              <Users className="h-6 w-6 text-orange-600" />
            )}
          </div>
          <div>
            <h4 className="font-medium">{position.name}</h4>
            <p className="text-sm text-orange-700">
              {position.type === "ssc" ? "SSC Position" : "College Position"} • Max selections: {position.maxSelections}
            </p>
            <p className="text-xs text-orange-600 mt-1">ID: {position.id}</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-yellow-800 mb-1">What happens when you archive a position?</h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• The position will no longer appear in active elections</li>
            <li>• Existing candidates for this position will be preserved</li>
            <li>• Historical voting data will remain intact</li>
            <li>• The position can be restored at any time</li>
          </ul>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isArchiving}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleArchive}
            disabled={isArchiving}
            className="gap-2 bg-orange-600 hover:bg-orange-700"
          >
            <Archive className="h-4 w-4" />
            {isArchiving ? "Archiving..." : "Archive Position"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
