"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Camera } from "lucide-react"
import { CandidateManagementModal } from "@/components/admin/candidates/Candidate-Management-Modal"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toast"
import { Loader2 } from "lucide-react"
import { AlertTriangle } from "lucide-react"

export default function CandidatesPage() {
  const { toast, dismiss, toasts } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState("add")
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const itemsPerPage = 10
  const [fetchError, setFetchError] = useState("")
  const [parties, setParties] = useState([])
  const [positions, setPositions] = useState([])
  const [colleges, setColleges] = useState([])

  const fetchCandidates = async () => {
    setIsLoading(true)
    setFetchError("")
    try {
      const res = await fetch("/api/admin/candidates")
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Failed to fetch candidates")
      }
      const data = await res.json()
      setCandidates(data)
    } catch (err) {
      setFetchError(err.message || "Failed to fetch candidates. Please try again.")
      setCandidates([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetch('/api/admin/parties')
      .then(res => res.json())
      .then(setParties)
    fetch('/api/admin/positions')
      .then(res => res.json())
      .then(setPositions)
    fetch('/api/login/college')
      .then(res => res.json())
      .then(setColleges)
  }, [])

  useEffect(() => {
    fetchCandidates()
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

  const handleModalSuccess = (result) => {
    if (!result || !result.action) return;
    if (result.action === 'add') {
      setCandidates((prev) => [...prev, result]);
      toast({
        title: 'Candidate Added',
        description: `${result.firstName || result.FirstName} ${result.surname || result.Surname} has been added.`,
        variant: 'success',
      });
    } else if (result.action === 'edit') {
      setCandidates((prev) => prev.map((c) =>
        c.CandidateID === selectedCandidate.CandidateID ? { ...c, ...result } : c
      ));
      toast({
        title: 'Candidate Updated',
        description: `${result.firstName || result.FirstName} ${result.surname || result.Surname} has been updated.`,
        variant: 'success',
      });
    } else if (result.action === 'delete') {
      setCandidates((prev) => prev.filter((c) => c.CandidateID !== selectedCandidate.CandidateID));
      toast({
        title: 'Candidate Deleted',
        description: `${result.firstName || result.FirstName} ${result.surname || result.Surname} has been deleted.`,
        variant: 'success',
      });
    }
    fetchCandidates();
  }

  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }

  const totalPages = (data) => Math.ceil(data.length / itemsPerPage)

  const filterCandidates = (candidates) => {
    if (!searchQuery) return candidates;
    
    return candidates.filter((candidate) => {
      const searchLower = searchQuery.toLowerCase()
      return (
        candidate.FirstName.toLowerCase().includes(searchLower) ||
        candidate.MiddleName.toLowerCase().includes(searchLower) ||
        candidate.Surname.toLowerCase().includes(searchLower) ||
        candidate.ExtensionName.toLowerCase().includes(searchLower) ||
        (candidate.Position || "").toLowerCase().includes(searchLower) ||
        (candidate.Party || "").toLowerCase().includes(searchLower) ||
        (candidate.CollegeOffice || "").toLowerCase().includes(searchLower)
      )
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading candidates...</p>
        </div>
        <Toaster toasts={toasts} onDismiss={dismiss} />
      </div>
    )
  }

  const sscCandidates = candidates.filter((candidate) => candidate.PositionType === "SSC")

  const collegeCandidates = candidates.filter((candidate) => candidate.PositionType === "College")

  return (
    <div className="space-y-8 text-[#61063B]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Candidates</h1>
          <p className="text-[#61063B]">Add, edit, or remove candidates for the election.</p>
        </div>
        <Button onClick={openAddModal} variant="outline" className="bg-[#61063B] text-white hover:text-[#61063B] border hover:border-[#61063B]">
          <Camera className="mr-2 h-4 w-4" /> Add Candidate
        </Button>
      </div>

      <Tabs defaultValue="ssc" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-[#61063B]">
          <TabsTrigger value="ssc" className="text-[#CA8A04]">SSC Candidates</TabsTrigger>
          <TabsTrigger value="college" className="text-[#CA8A04]">College Candidates</TabsTrigger>
        </TabsList>

        <TabsContent value="ssc" className="mt-6">
          <Card className="bg-[#61063B] text-white">
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>Supreme Student Council Candidates</CardTitle>
                <CardDescription className="text-white">Manage candidates for SSC positions</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-[300px] px-4 py-2 rounded-md border border-input bg-[#61063B]"
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
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Photo</TableHead>
                    <TableHead className="text-white">Position</TableHead>
                    <TableHead className="text-white">Party</TableHead>
                    <TableHead className="text-right text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className={fetchError ? "min-h-[300px] h-[300px]" : ""}>
                  {fetchError ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-destructive h-[300px] align-middle p-0">
                        <div className="flex flex-col justify-center items-center h-full w-full gap-2">
                          <AlertTriangle className="w-8 h-8 text-destructive mb-1" />
                          <span>{fetchError}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    getPaginatedData(filterCandidates(sscCandidates)).map((candidate) => {
                      return (
                        <TableRow key={candidate.CandidateID}>
                          <TableCell className="font-medium">{candidate.FirstName} {candidate.Surname}</TableCell>
                          <TableCell>
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                              <Image
                                src={candidate.Photo || "/candidates/no-photo.png"}
                                alt={candidate.Surname}
                                className="w-full h-full object-cover"
                                width={250}
                                height={250}
                              />
                            </div>
                          </TableCell>
                          <TableCell>{candidate.Position}</TableCell>
                          <TableCell>
                            <Badge style={{ backgroundColor: candidate.PartyColor || "#888" }}>
                              {candidate.Party}
                            </Badge>
                          </TableCell>
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
                    })
                  )}
                </TableBody>
              </Table>
              <div className="flex items-center justify-end space-x-2 mt-4 ">
                <Button
                  className="bg-[#61063B] text-white hover:bg-white hover:text-[#61063B]"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-white">
                  Page {currentPage} of {totalPages(filterCandidates(sscCandidates))}
                </span>
                <Button
                  className="bg-[#61063B] text-white hover:bg-white hover:text-[#61063B]"
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
                      setCurrentPage(1) 
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className={fetchError ? "min-h-[300px] h-[300px]" : ""}>
                  {fetchError ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-destructive h-[300px] align-middle p-0">
                        <div className="flex flex-col justify-center items-center h-full w-full gap-2">
                          <AlertTriangle className="w-8 h-8 text-destructive mb-1" />
                          <span>{fetchError}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    getPaginatedData(filterCandidates(collegeCandidates)).map((candidate) => {
                      const position = positions.find((p) => p.id === candidate.position)
                      const party = parties.find((p) => p.id === candidate.party)
                      const college = colleges.find((c) => c.id === candidate.college)

                      return (
                        <TableRow key={candidate.CandidateID}>
                          <TableCell className="font-medium">{candidate.FirstName} {candidate.Surname}</TableCell>
                          <TableCell>
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                              <Image
                                src={candidate.Photo || "/candidates/no-photo.png"}
                                alt={candidate.Surname}
                                className="w-full h-full object-cover"
                                width={250}
                                height={250}
                              />
                            </div>
                          </TableCell>
                          <TableCell>{candidate.Position}</TableCell>
                          <TableCell>
                            <Badge variant="outline" style={{ borderColor: candidate.CollegeOfficeColor || "#888" }}>
                              {candidate.CollegeOfficeCode}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge style={{ backgroundColor: candidate.PartyColor || "#888" }}>
                              {candidate.Party}
                            </Badge>
                          </TableCell>
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
                    })
                  )}
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
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
