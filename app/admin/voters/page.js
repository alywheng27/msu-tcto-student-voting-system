"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
// import { users } from "@/lib/data2"
import { Plus, Search } from "lucide-react"
import { VoterManagementModal } from "@/components/admin/voters/Voter-Management-Modal"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toast"
import { Loader2 } from "lucide-react"

export default function VotersPage() {
  const { toast, dismiss, toasts } = useToast()
  const [voters, setVoters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState("add")
  const [selectedVoter, setSelectedVoter] = useState(null)
  const [search, setSearch] = useState("")
  const [colleges, setColleges] = useState([])
  const [collegesLoading, setCollegesLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const showErrorToast = (message) => {
    toast({
      title: "Error",
      description: message || "Failed to fetch voters. Please try again.",
      variant: "destructive"
    })
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/admin/voters')
        if (!response.ok) {
          const errorMsg = `HTTP error! status: ${response.status}`
          showErrorToast(errorMsg)
          setVoters([])
          return
        }
        const data = await response.json()
        setVoters(data)
      } catch (error) {
        console.error("Error loading voters:", error)
        showErrorToast(error.message)
        setVoters([])
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [toast])

  useEffect(() => {
    const fetchColleges = async () => {
      setCollegesLoading(true)
      try {
        const response = await fetch('/api/login/college')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setColleges(data)
      } catch (error) {
        setColleges([])
      } finally {
        setCollegesLoading(false)
      }
    }
    fetchColleges()
  }, [])

  const handleAddVoter = () => {
    setSelectedVoter(null)
    setModalMode("add")
    setModalOpen(true)
  }

  const handleEditVoter = (voter) => {
    setSelectedVoter(voter)
    setModalMode("edit")
    setModalOpen(true)
  }

  const handleDeleteVoter = (voter) => {
    setSelectedVoter(voter)
    setModalMode("delete")
    setModalOpen(true)
  }

  const handleModalSuccess = () => {
    // Refresh data after successful operation
    const votersData = voters.filter((user) => user.role.toLowerCase() === "voter")
    setVoters(votersData)
  }

  // Filter voters based on search
  const filteredVoters = voters.filter((voter) => {
    const searchLower = search.toLowerCase()
    const nameMatch = voter.FirstName?.toLowerCase().includes(searchLower) || voter.MiddleName?.toLowerCase().includes(searchLower) || voter.Surname?.toLowerCase().includes(searchLower) || voter.ExtensionName?.toLowerCase().includes(searchLower)
    const usernameMatch = voter.Username?.toLowerCase().includes(searchLower)
    const collegeMatch = voter?.CollegeOffice.toLowerCase().includes(searchLower) || voter?.CollegeOfficeCode.toLowerCase().includes(searchLower)
    const sscVoteMatch = (searchLower === "voted" && voter?.HasVotedSSC) || (searchLower === "not voted" && !voter?.HasVotedSSC)
    const collegeVoteMatch = (searchLower === "voted" && voter?.HasVotedCollege) || (searchLower === "not voted" && !voter?.HasVotedCollege)
    return nameMatch || usernameMatch || collegeMatch || sscVoteMatch || collegeVoteMatch
  })

  // Pagination helpers
  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }

  const totalPages = (data) => Math.ceil(data.length / itemsPerPage)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading voters...</p>
        </div>
        <Toaster toasts={toasts} onDismiss={dismiss} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Voters</h1>
          <p className="text-muted-foreground">Add, edit, or remove voters for the election.</p>
        </div>
        <Button onClick={handleAddVoter}>
          <Plus className="mr-2 h-4 w-4" /> Add Voter
        </Button>
      </div>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Voters</CardTitle>
            <CardDescription>List of all registered voters in the system</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search voters..."
                className="w-full pl-8"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>College</TableHead>
                <TableHead>SSC Vote</TableHead>
                <TableHead>College Vote</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(filteredVoters)
                ? getPaginatedData(filteredVoters).map((voter) => {
                    return (
                      <TableRow key={voter.VoterID}>
                        <TableCell className="font-medium">{voter.FirstName} {voter.Surname}</TableCell>
                        <TableCell>{voter.Username}</TableCell>
                        <TableCell>
                            <Badge variant="outline" style={{ borderColor: voter.CollegeOfficeColor || '#ccc' }}>
                              {voter.CollegeOfficeCode}
                            </Badge>
                        </TableCell>
                        <TableCell>
                          {voter.HasVotedSSC ? (
                            <Badge variant="default" className="bg-green-500">
                              Voted
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Voted</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {voter.HasVotedCollege ? (
                            <Badge variant="default" className="bg-green-500">
                              Voted
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Voted</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditVoter(voter)}>
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleDeleteVoter(voter)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                : null}
            </TableBody>
          </Table>
          {/* Pagination Controls */}
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
              Page {currentPage} of {totalPages(filteredVoters)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages(filteredVoters) || totalPages(filteredVoters) === 0}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
      <VoterManagementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        voter={selectedVoter}
        onSuccess={handleModalSuccess}
      />
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}
