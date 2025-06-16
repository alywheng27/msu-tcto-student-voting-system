"use client"

import { useState } from "react"
import Image from "next/image"
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
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react"

export function DeletePartyDialog({ party, children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [notification, setNotification] = useState(null)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      // In a real app, this would call an API to delete the party
      console.log("Deleting party:", party.PartyID)

      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000))
      const res = await fetch(`/api/admin/parties/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: party.PartyID }),
      })

      if (!res.ok) throw new Error('Failed to update party')
      setNotification({
        type: "success",
        message: `${party.Party} has been deleted successfully.`
      })

      setIsOpen(false)

      // In a real app, you would refresh the data or update the UI
      // For demo purposes, we'll just reload the page after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error("Error deleting party:", error)
      setNotification({
        type: "error",
        message: "Failed to delete party. Please try again."
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <p>{notification.message}</p>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Party
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{party.Party}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 p-4 border rounded-lg bg-red-50 text-red-800">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${party.PartyColor}20` }}
            >
              <Image
                src={party.Logo || "/parties/no-logo.png"}
                alt={`${party.Party} logo`}
                className="w-8 h-8 object-contain"
                width={250}
                height={250}
              />
            </div>
            <div>
              <h4 className="font-medium">{party.Party}</h4>
              <p className="text-sm text-red-700">Party ID: {party.PartyID}</p>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="gap-2">
              {isDeleting ? "Deleting..." : "Delete Party"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
