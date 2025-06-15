import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { DeletePartyDialog } from "@/components/admin/parties/Delete-Party-Dialog"

export default async function PartiesPage() {
  const data = await fetch(`${process.env.MSSQL_PUBLIC_APP_URL}/api/admin/parties`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  
  const parties = await data.json()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Parties</h1>
          <p className="text-muted-foreground">Add, edit, or remove political parties for the election.</p>
        </div>
        <Link href="/admin/parties/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Party
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
        {parties.length > 0 ? parties.map((party) => (
          <Card key={party.PartyID} className="overflow-hidden">
            <div
              className="h-3"
              style={{
                backgroundColor: party.PartyColor,
              }}
            />
            <CardHeader className="pb-2">
              <CardTitle>{party.Party}</CardTitle>
              <CardDescription>Party ID: {party.PartyID}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `${party.PartyColor}15` }}
                >
                  <Image
                    src={party.Logo || "/placeholder.svg?height=64&width=64"}
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
                  <div className="text-xs text-muted-foreground mt-1">{party.PartyColor}</div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Link href={`/admin/parties/${party.PartyID}/edit`}>
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                  </Button>
                </Link>
                <DeletePartyDialog party={party}>
                  <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </DeletePartyDialog>
              </div>
            </CardContent>
          </Card>
        )) : <h2 className=" text-2xl">0 data found.</h2>}
      </div>

      {parties.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-medium">No parties added yet</h3>
              <p className="text-muted-foreground">Add your first political party to get started.</p>
              <Link href="/admin/parties/add">
                <Button className="mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Add Party
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
