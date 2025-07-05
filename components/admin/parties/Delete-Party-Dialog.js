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
import { AlertTriangle } from "lucide-react"

export function DeletePartyDialog({ party, children, toast, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteParty = async (partyID) => {
    const res = await fetch(`/api/admin/parties/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: partyID }),
    })
    if (!res.ok) throw new Error('Failed to delete party')
    return true
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteParty(party.PartyID)
      const msg = {
        title: "Success",
        description: `${party.Party} has been deleted successfully.`,
        variant: "success",
      }
      toast && toast(msg)
      setIsOpen(false)
      onSuccess && onSuccess(msg)
    } catch (error) {
      toast && toast({
        title: "Error",
        description: error.message || "Failed to delete party. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
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
  )
}
