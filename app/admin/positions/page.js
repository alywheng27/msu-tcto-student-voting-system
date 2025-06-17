"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Archive, RotateCcw, Users, Crown, Loader2 } from "lucide-react"
import { ArchivePositionDialog } from "@/components/admin/positions/Archive-Position-Dialog"
import AddPositionModal from "@/components/admin/positions/AddPositionModal"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toast"

export default function PositionsPage() {
  const { toast, dismiss, toasts } = useToast()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState("ssc")
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch positions from API
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/positions')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setPositions(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching positions:', err)
        setError(err.message)
        toast({
          title: "Error",
          description: "Failed to fetch positions. Please try again.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPositions()
  }, [toast])

  // Separate positions by type
  const sscPositions = positions.filter((position) => position.PositionType === "ssc" || position.PositionType === "SSC")
  const collegePositions = positions.filter((position) => position.PositionType === "college" || position.PositionType === "College")

  // Mock archived positions for demonstration
  const archivedPositions = [
    {
      id: "secretary",
      name: "Secretary",
      type: "ssc",
      maxSelections: 1,
      description: "Handles official correspondence and documentation",
      requirements: "Must have excellent writing and organizational skills",
      isActive: false,
      archivedAt: "2024-01-15",
    },
  ]

  const handleAddPosition = (type = "ssc") => {
    setSelectedType(type)
    setIsAddModalOpen(true)
  }

  const PositionCard = ({ position, isArchived = false }) => (
    <Card key={position.PositionID} className={`overflow-hidden ${isArchived ? "opacity-60 bg-gray-50" : ""}`}>
      <div className={`h-3 ${(position.PositionType) === "ssc" || (position.PositionType) === "SSC" ? "bg-blue-500" : "bg-green-500"}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {(position.PositionType) === "ssc" || (position.PositionType) === "SSC" ? (
                <Crown className="h-5 w-5 text-blue-500" />
              ) : (
                <Users className="h-5 w-5 text-green-500" />
              )}
              {position.Position}
              {isArchived && <Badge variant="outline">Archived</Badge>}
            </CardTitle>
            <CardDescription className="mt-1">
              {(position.PositionType) === "ssc" || (position.PositionType) === "SSC" ? "Supreme Student Council" : "College Position"}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2">
            Max: {position.MaximumSelection}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={(position.PositionType) === "ssc" || (position.PositionType) === "SSC" ? "border-blue-200 text-blue-700" : "border-green-200 text-green-700"}
            >
              {(position.PositionType || "unknown").toUpperCase()}
            </Badge>
            <span className="text-xs text-gray-500">ID: {position.PositionID}</span>
          </div>

          <div className="flex gap-2">
            {!isArchived ? (
              <>
                <Link href={`/admin/positions/${position.PositionID}/edit`}>
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <ArchivePositionDialog position={position} onSuccess={toast}>
                  <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                </ArchivePositionDialog>
              </>
            ) : (
              <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading positions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading positions: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Positions</h1>
          <p className="text-muted-foreground">Create, edit, and manage election positions for SSC and colleges.</p>
        </div>
        <Button onClick={() => handleAddPosition()}>
          <Plus className="mr-2 h-4 w-4" /> Add Position
        </Button>
      </div>

      <Tabs defaultValue="ssc" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="ssc" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            SSC Positions
          </TabsTrigger>
          <TabsTrigger value="college" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            College Positions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ssc" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-blue-500" />
                Supreme Student Council Positions
              </CardTitle>
              <CardDescription>
                Manage positions for university-wide SSC elections. These positions are available to all students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sscPositions.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {sscPositions.map((position) => (
                    <PositionCard key={position.PositionID} position={position} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Crown className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No SSC positions found</h3>
                  <p className="text-gray-600 mb-4">Create your first SSC position to get started.</p>
                  <Button onClick={() => handleAddPosition("ssc")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add SSC Position
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="college" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                College Positions
              </CardTitle>
              <CardDescription>
                Manage positions for college-specific elections. These positions are available to students within each
                college.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {collegePositions.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {collegePositions.map((position) => (
                    <PositionCard key={position.PositionID} position={position} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No college positions found</h3>
                  <p className="text-gray-600 mb-4">Create your first college position to get started.</p>
                  <Button onClick={() => handleAddPosition("college")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add College Position
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Crown className="h-8 w-8 mx-auto text-blue-500 mb-2" />
            <div className="text-2xl font-bold text-blue-600">{sscPositions.length}</div>
            <div className="text-sm text-gray-600">SSC Positions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <div className="text-2xl font-bold text-green-600">{collegePositions.length}</div>
            <div className="text-sm text-gray-600">College Positions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Archive className="h-8 w-8 mx-auto text-gray-500 mb-2" />
            <div className="text-2xl font-bold text-gray-600">{archivedPositions.length}</div>
            <div className="text-sm text-gray-600">Archived</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Plus className="h-8 w-8 mx-auto text-purple-500 mb-2" />
            <div className="text-2xl font-bold text-purple-600">{sscPositions.length + collegePositions.length}</div>
            <div className="text-sm text-gray-600">Total Active</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Position Modal */}
      <AddPositionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType={selectedType}
        onSuccess={toast}
      />

      {/* Toast Notifications */}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}
