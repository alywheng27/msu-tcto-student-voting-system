"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { candidates, parties, positions, colleges } from "@/lib/data2"
import { Camera } from "lucide-react"
import { CandidateManagementModal } from "@/components/admin/candidates/Candidate-Management-Modal"
import Image from "next/image"

export default function CandidatesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState("add")
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const itemsPerPage = 8

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

  // Add pagination functions
  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }

  const totalPages = (data) => Math.ceil(data.length / itemsPerPage)

  // Add search filter function
  const filterCandidates = (candidates) => {
    if (!searchQuery) return candidates;
    
    return candidates.filter((candidate) => {
      const position = positions.find((p) => p.id === candidate.position)
      const party = parties.find((p) => p.id === candidate.party)
      const college = colleges.find((c) => c.id === candidate.college)
      
      const searchLower = searchQuery.toLowerCase()
      return (
        candidate.name.toLowerCase().includes(searchLower) ||
        (position?.name || "").toLowerCase().includes(searchLower) ||
        (party?.name || "").toLowerCase().includes(searchLower) ||
        (college?.name || "").toLowerCase().includes(searchLower)
      )
    })
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
        <Button onClick={openAddModal} variant="outline">
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
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>Supreme Student Council Candidates</CardTitle>
                <CardDescription>Manage candidates for SSC positions</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1) // Reset to first page when searching
                    }}
                    className="w-[300px] px-4 py-2 rounded-md border border-input bg-background"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
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
                  {getPaginatedData(filterCandidates(sscCandidates)).map((candidate) => {
                    const position = positions.find((p) => p.id === candidate.position)
                    const party = parties.find((p) => p.id === candidate.party)

                    return (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">{candidate.name}</TableCell>
                        <TableCell>
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                            <Image
                              src={candidate.photo || "/placeholder.svg?height=40&width=40"}
                              alt={candidate.name}
                              className="w-full h-full object-cover"
                              width={250}
                              height={250}
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
              <div className="flex items-center justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages(filterCandidates(sscCandidates))}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages(filterCandidates(sscCandidates))}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="college" className="mt-6">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>College Candidates</CardTitle>
                <CardDescription>Manage candidates for college-specific positions</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1) // Reset to first page when searching
                    }}
                    className="w-[300px] px-4 py-2 rounded-md border border-input bg-background"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
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
                  {getPaginatedData(filterCandidates(collegeCandidates)).map((candidate) => {
                    const position = positions.find((p) => p.id === candidate.position)
                    const party = parties.find((p) => p.id === candidate.party)
                    const college = colleges.find((c) => c.id === candidate.college)

                    return (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">{candidate.name}</TableCell>
                        <TableCell>
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                            <Image
                              src={candidate.photo || "/placeholder.svg?height=40&width=40"}
                              alt={candidate.name}
                              className="w-full h-full object-cover"
                              width={250}
                              height={250}
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
              <div className="flex items-center justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages(filterCandidates(collegeCandidates))}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages(filterCandidates(collegeCandidates))}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CandidateManagementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        candidate={selectedCandidate}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}
