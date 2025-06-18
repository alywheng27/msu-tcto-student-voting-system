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
import { Trash2, AlertTriangle, Crown, Users } from "lucide-react"

export function DeletePositionDialog({ position, children, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Helper function to delete the position
  const deletePosition = async (positionID) => {
    const response = await fetch(`/api/admin/positions/${positionID}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to delete position.")
    }
    return true
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deletePosition(position.PositionID)
      onSuccess?.({
        title: "Success",
        description: `${position.Position} has been deleted successfully.`,
        variant: "success",
      })
      setIsOpen(false)
    } catch (error) {
      console.error("Error deleting position:", error)
      onSuccess?.({
        title: "Error",
        description: error.message || "Failed to delete position. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Position
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to <span className="text-red-600 font-bold">permanently delete</span> <strong>{position.Position}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 p-4 border rounded-lg bg-red-50 text-red-800">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100">
            {position.PositionType === "ssc" || position.PositionType === "SSC" ? (
              <Crown className="h-6 w-6 text-red-600" />
            ) : (
              <Users className="h-6 w-6 text-red-600" />
            )}
          </div>
          <div>
            <h4 className="font-medium">{position.Position}</h4>
            <p className="text-sm text-red-700">
              {position.PositionType === "ssc" || position.PositionType === "SSC" ? "SSC Position" : "College Position"} • Max selections: {position.MaximumSelection} • Order: {position.Decree}
            </p>
            <p className="text-xs text-red-600 mt-1">ID: {position.PositionID}</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-red-800 mb-1">Warning:</h4>
          <ul className="text-xs text-red-700 space-y-1">
            <li>• This position will be permanently removed from the system</li>
            <li>• All related data may be lost</li>
            <li>• This action cannot be undone</li>
          </ul>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-2 bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete Position"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 