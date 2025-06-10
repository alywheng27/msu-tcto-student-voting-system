"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { candidates, parties, positions, colleges } from "@/lib/data2"
import { Camera } from "lucide-react"
// import { CandidateManagementModal } from "@/components/admin/candidates/Candidate-Management-Modal"

export default function CandidatesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState("add")
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading and ensure data is available
    if (candidates && Array.isArray(candidates)) {
      setIsLoading(false)
    }
  }, [])

  const openAddModal = () => {
    setModalMode("add")
    setSelectedCandidate(null)
    setModalOpen(true)
  }

  const openEditModal = (candidate) => {
    setModalMode("edit")
    setSelectedCandidate(candidate)
    setModalOpen(true)
  }

  const openDeleteModal = (candidate) => {
    setModalMode("delete")
    setSelectedCandidate(candidate)
    setModalOpen(true)
  }

  const handleModalSuccess = () => {
    // In a real app, this would refresh the data
    console.log("Modal operation successful - refreshing data")
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Candidates</h1>
            <p className="text-muted-foreground">Loading candidates...</p>
          </div>
        </div>
      </div>
    )
  }

  // Ensure candidates is an array before filtering
  const candidatesArray = Array.isArray(candidates) ? candidates : []

  // Group candidates by position type (SSC or College)
  const sscCandidates = candidatesArray.filter((candidate) => {
    const position = positions.find((p) => p.id === candidate.position)
    return position?.type === "ssc"
  })

  const collegeCandidates = candidatesArray.filter((candidate) => {
    const position = positions.find((p) => p.id === candidate.position)
    return position?.type === "college"
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Candidates</h1>
          <p className="text-muted-foreground">Add, edit, or remove candidates for the election.</p>
        </div>
        <Button onClick={openAddModal}>
          <Camera className="mr-2 h-4 w-4" /> Add Candidate
        </Button>
      </div>

      <Tabs defaultValue="ssc" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="ssc">SSC Candidates</TabsTrigger>
          <TabsTrigger value="college">College Candidates</TabsTrigger>
        </TabsList>

        <TabsContent value="ssc" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Supreme Student Council Candidates</CardTitle>
              <CardDescription>Manage candidates for SSC positions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Photo</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sscCandidates.map((candidate) => {
                    const position = positions.find((p) => p.id === candidate.position)
                    const party = parties.find((p) => p.id === candidate.party)

                    return (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">{candidate.name}</TableCell>
                        <TableCell>
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                            <img
                              src={candidate.photo || "/placeholder.svg?height=40&width=40"}
                              alt={candidate.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{position?.name || candidate.position}</TableCell>
                        <TableCell>
                          <Badge style={{ backgroundColor: party?.color || "#888" }}>
                            {party?.name || candidate.party}
                          </Badge>
                        </TableCell>
                        <TableCell>{candidate.votes}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(candidate)}>
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => openDeleteModal(candidate)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="college" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>College Candidates</CardTitle>
              <CardDescription>Manage candidates for college-specific positions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Photo</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collegeCandidates.map((candidate) => {
                    const position = positions.find((p) => p.id === candidate.position)
                    const party = parties.find((p) => p.id === candidate.party)
                    const college = colleges.find((c) => c.id === candidate.college)

                    return (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">{candidate.name}</TableCell>
                        <TableCell>
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                            <img
                              src={candidate.photo || "/placeholder.svg?height=40&width=40"}
                              alt={candidate.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{position?.name || candidate.position}</TableCell>
                        <TableCell>
                          <Badge variant="outline" style={{ borderColor: college?.color || "#888" }}>
                            {college?.shortName || candidate.college}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge style={{ backgroundColor: party?.color || "#888" }}>
                            {party?.name || candidate.party}
                          </Badge>
                        </TableCell>
                        <TableCell>{candidate.votes}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(candidate)}>
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => openDeleteModal(candidate)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* <CandidateManagementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        candidate={selectedCandidate}
        onSuccess={handleModalSuccess}
      /> */}
    </div>
  )
}
