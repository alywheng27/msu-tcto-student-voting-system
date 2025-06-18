"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Pencil, X } from "lucide-react"
import EditPositionForm from "./EditPositionForm"

export default function EditPositionModal({ isOpen, onClose, position, onSuccess }) {
  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Position
            </div>
          </DialogTitle>
        </DialogHeader>

        <EditPositionForm
          position={position}
          onClose={handleClose}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  )
} 