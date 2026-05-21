"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Loader2, AlertTriangle } from "lucide-react"
import { DeletePartyDialog } from "@/components/admin/parties/Delete-Party-Dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import AddPartyForm from "@/components/admin/parties/AddPartyForm"
import EditPartyForm from "@/components/admin/parties/EditPartyForm"
import { Toaster } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export default function PartiesPage() {
  const { toast, dismiss, toasts } = useToast()
  const [parties, setParties] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedParty, setSelectedParty] = useState(null)

  const fetchParties = async () => {
    setLoading(true)
    const data = await fetch(`/api/admin/parties`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const parties = await data.json()
    setParties(parties)
    setLoading(false)
  }

  useEffect(() => {
    fetchParties()
  }, [])

  const handleAddSuccess = (msg) => {
    setOpen(false)
    fetchParties()
    if (msg) toast(msg)
  }

  const handleEditSuccess = (msg) => {
    setEditOpen(false)
    setSelectedParty(null)
    fetchParties()
    if (msg) toast(msg)
  }

  const handleDeleteSuccess = (msg) => {
    fetchParties()
    if (msg) toast(msg)
  }

  return (
    <div className="space-y-8 text-[#61063B]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Parties</h1>
          <p>Add, edit, or remove political parties for the election.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-[#61063B] hover:bg-white hover:text-[#61063B] border hover:border-[#61063B]">
          <Plus className="mr-2 h-4 w-4" /> Add Party
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>Add New Party</DialogTitle>
            <DialogDescription>Create a new political party for the election</DialogDescription>
          </DialogHeader>
          <AddPartyForm onSuccess={handleAddSuccess} onCancel={() => setOpen(false)} toast={toast} />
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) setSelectedParty(null) }}>
        <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>Edit Party</DialogTitle>
            <DialogDescription>Update information for the selected party</DialogDescription>
          </DialogHeader>
          {selectedParty && (
            <EditPartyForm party={selectedParty} onSuccess={handleEditSuccess} onCancel={() => { setEditOpen(false); setSelectedParty(null) }} toast={toast} />
          )}
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
        {loading ? (
          <div className="flex items-center justify-center min-h-[65vh] col-span-full">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Loading parties...</p>
            </div>
          </div>
        ) : parties.length > 0 ? parties.map((party) => (
          <Card key={party.PartyID} className="overflow-hidden bg-[#61063B] text-white">
            <div
              className="h-3"
              style={{
                backgroundColor: party.PartyColor,
              }}
            />
            <CardHeader className="pb-2">
              <CardTitle>{party.Party}</CardTitle>
              <CardDescription className="text-white">Party ID: {party.PartyID}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `${party.PartyColor}15` }}
                >
                  <Image
                    src={party.Logo || "/parties/no-logo.png"}
                    alt={`${party.Party} logo`}
                    className="w-12 h-12 object-contain"
                    width={250}
                    height={250}
                  />
                </div>
                <div>
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: party.PartyColor }}
                    title={`Party color: ${party.PartyColor}`}
                  />
                  <div className="text-xs mt-1">{party.PartyColor}</div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" size="sm" className="text-[#61063B]" onClick={() => {
                  setSelectedParty({
                    id: party.PartyID,
                    name: party.Party,
                    color: party.PartyColor,
                    logo: party.Logo,
                  });
                  setEditOpen(true);
                }}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </Button>
                <DeletePartyDialog party={party} toast={toast} onSuccess={handleDeleteSuccess}>
                  <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </DeletePartyDialog>
              </div>
            </CardContent>
          </Card>
        )) : 
        <div className="flex flex-1 min-h-[250px] items-center justify-center col-span-full">
          <div className="flex flex-col items-center gap-2 text-destructive">
            <AlertTriangle className="w-8 h-8 mb-1" />
            <h2 className="text-2xl font-semibold">0 data found.</h2>
          </div>
        </div>}
      </div>

      {!loading && parties.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-medium">No parties added yet</h3>
              <p className="text-muted-foreground">Add your first political party to get started.</p>
              <Button className="mt-2" onClick={() => setOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Party
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Toaster toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}
