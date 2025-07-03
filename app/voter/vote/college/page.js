"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, ChevronRight, Edit2, X } from "lucide-react"
import { CandidateCard } from "@/components/voter/ssc/Candidate-Card"
import { ReviewSelectionCard } from "@/components/voter/ssc/Review-Selection-Card"
import Cookies from "js-cookie"
import Image from "next/image"

export default function CollegeVotingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [votingMode, setVotingMode] = useState("individual")
  const [selectedParty, setSelectedParty] = useState("")
  const [step, setStep] = useState("mode")
  const [cookieValue, setCookieValue] = useState({})
  const [selections, setSelections] = useState({
    governor: "",
    viceGovernor: "",
    mayor: "",
    viceMayor: "",
    boardMembers: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parties, setParties] = useState([])
  const [colleges, setColleges] = useState([])
  const [candidates, setCandidates] = useState({
    governor: [],
    viceGovernor: [],
    mayor: [],
    viceMayor: [],
    boardMembers: [],
  })
  const [loadingCandidates, setLoadingCandidates] = useState(false)
  const [loadingParties, setLoadingParties] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [fetchPartiesError, setFetchPartiesError] = useState(null)
  const [loadingColleges, setLoadingColleges] = useState(true)
  const [fetchCollegesError, setFetchCollegesError] = useState(null)

  const collegeOffice = colleges.find((c) => c.id === cookieValue.collegeOfficeID)
  
  const college = collegeOffice ? {
    id: collegeOffice.id,
    name: collegeOffice.name,
    shortName: collegeOffice.code,
    color: collegeOffice.color,
    logo: "/parties/no-logo.png",
  } : {
    id: "",
    name: "",
    shortName: "",
    color: "#2196F3",
    logo: "/parties/no-logo.png",
  }

  function fetchCookies() {
    // Read cookies using js-cookie
    return {
      collegeOfficeID: Cookies.get("CollegeOfficeID"),
      hasVotedCollege: Cookies.get("HasVotedCollege"),
      // Add more cookies if needed
    }
  }

  const alreadyVoted = useCallback(() => {
    if (cookieValue.hasVotedCollege === 'true') {
      router.replace("/voter/vote/voted")
    }
  }, [cookieValue.hasVotedCollege, router])

  async function fetchColleges() {
    setLoadingColleges(true)
    setFetchCollegesError(null)
    try {
      const res = await fetch("/api/login/college")
      if (!res.ok) throw new Error("Failed to fetch colleges")
      const data = await res.json()
      setColleges(data.map((c) => ({
        id: c.CollegeOfficeID,
        name: c.CollegeOffice,
        color: c.CollegeOfficeColor || "#2196F3",
        code: c.CollegeOfficeCode,
      })))
    } catch (err) {
      setFetchCollegesError(err.message)
    } finally {
      setLoadingColleges(false)
    }
  }

  async function fetchCandidates() {
    setLoadingCandidates(true)
    setFetchError(null)
    try {
      const res = await fetch("/api/admin/candidates")
      if (!res.ok) throw new Error("Failed to fetch candidates")
      const data = await res.json()
      
      // Map candidates by position and filter by college
      const mapped = {
        governor: [],
        viceGovernor: [],
        mayor: [],
        viceMayor: [],
        boardMembers: [],
      }
      data.forEach((c) => {
        // if (c.CollegeOfficeCode?.toLowerCase() !== college.id) return
        const pos = c.Position?.toLowerCase()
        if (pos === "governor") mapped.governor.push({
          id: c.CandidateID,
          name: `${c.FirstName} ${c.Surname}`,
          party: c.PartyID?.toString() || c.Party,
          photo: c.Photo || "/candidates/no-photo.png",
        })
        else if (pos === "vice governor" || pos === "vice-governor") mapped.viceGovernor.push({
          id: c.CandidateID,
          name: `${c.FirstName} ${c.Surname}`,
          party: c.PartyID?.toString() || c.Party,
          photo: c.Photo || "/candidates/no-photo.png",
        })
        else if (pos === "mayor") mapped.mayor.push({
          id: c.CandidateID,
          name: `${c.FirstName} ${c.Surname}`,
          party: c.PartyID?.toString() || c.Party,
          photo: c.Photo || "/candidates/no-photo.png",
        })
        else if (pos === "vice mayor" || pos === "vice-mayor") mapped.viceMayor.push({
          id: c.CandidateID,
          name: `${c.FirstName} ${c.Surname}`,
          party: c.PartyID?.toString() || c.Party,
          photo: c.Photo || "/candidates/no-photo.png",
        })
        else if (pos === "board member" || pos === "board-member") mapped.boardMembers.push({
          id: c.CandidateID,
          name: `${c.FirstName} ${c.Surname}`,
          party: c.PartyID?.toString() || c.Party,
          photo: c.Photo || "/candidates/no-photo.png",
        })
      })
      
      setCandidates(mapped)
    } catch (err) {
      setFetchError(err.message)
    } finally {
      setLoadingCandidates(false)
    }
  }

  async function fetchParties() {
    setLoadingParties(true)
    setFetchPartiesError(null)
    try {
      const res = await fetch("/api/admin/parties")
      if (!res.ok) throw new Error("Failed to fetch parties")
      const data = await res.json()
      setParties(data.map((p) => ({
        id: p.PartyID?.toString() || p.Party,
        name: p.Party,
        color: p.PartyColor || "#2196F3",
        logo: p.Logo || "/parties/no-logo.png",
      })))
    } catch (err) {
      setFetchPartiesError(err.message)
    } finally {
      setLoadingParties(false)
    }
  }

  useEffect(() => {
    fetchCandidates()
    fetchParties()
    fetchColleges()
    setCookieValue(fetchCookies())
    alreadyVoted()
  }, [alreadyVoted])

  const positionLabels = {
    governor: "Governor",
    viceGovernor: "Vice Governor",
    mayor: "Mayor",
    viceMayor: "Vice Mayor",
    boardMembers: "Board Members",
  }

  const handlePartySelect = (partyId) => {
    setSelectedParty(partyId)

    const governorCandidate = candidates.governor.find((c) => c.party === partyId)
    const viceGovernorCandidate = candidates.viceGovernor.find((c) => c.party === partyId)
    const mayorCandidate = candidates.mayor.find((c) => c.party === partyId)
    const viceMayorCandidate = candidates.viceMayor.find((c) => c.party === partyId)
    const boardMemberCandidates = candidates.boardMembers.filter((c) => c.party === partyId).slice(0, 6)

    setSelections({
      governor: governorCandidate?.id || "",
      viceGovernor: viceGovernorCandidate?.id || "",
      mayor: mayorCandidate?.id || "",
      viceMayor: viceMayorCandidate?.id || "",
      boardMembers: boardMemberCandidates.map((c) => c.id),
    })
  }

  const handleSelectCandidate = (position, candidateId) => {
    if (position === "boardMembers") {
      setSelections((prev) => {
        if (prev.boardMembers.includes(candidateId)) {
          return { ...prev, boardMembers: prev.boardMembers.filter((id) => id !== candidateId) }
        } else {
          if (prev.boardMembers.length < 6) {
            return { ...prev, boardMembers: [...prev.boardMembers, candidateId] }
          }
          return prev
        }
      })
    } else {
      setSelections((prev) => ({ ...prev, [position]: candidateId }))
    }
  }

  const handleRemoveSelection = (position, candidateId = null) => {
    if (position === "boardMembers" && candidateId) {
      setSelections((prev) => ({
        ...prev,
        boardMembers: prev.boardMembers.filter((id) => id !== candidateId),
      }))
    } else {
      setSelections((prev) => ({ ...prev, [position]: "" }))
    }
  }

  const handleEditPosition = (position) => {
    const stepMap = {
      governor: "governor",
      viceGovernor: "viceGovernor",
      mayor: "mayor",
      viceMayor: "viceMayor",
      boardMembers: "boardMembers",
    }
    setStep(stepMap[position])
  }

  const handleNext = () => {
    if (step === "mode") {
      if (votingMode === "party" && !selectedParty) {
        toast({
          title: "Please select a party",
          description: "You must select a party to continue in Party Mode.",
          variant: "destructive",
        })
        return
      }
      setStep("governor")
    } else if (step === "governor") {
      setStep("viceGovernor")
    } else if (step === "viceGovernor") {
      setStep("mayor")
    } else if (step === "mayor") {
      setStep("viceMayor")
    } else if (step === "viceMayor") {
      setStep("boardMembers")
    } else if (step === "boardMembers") {
      setStep("review")
    }
  }

  const handleBack = () => {
    if (step === "governor") {
      setStep("mode")
    } else if (step === "viceGovernor") {
      setStep("governor")
    } else if (step === "mayor") {
      setStep("viceGovernor")
    } else if (step === "viceMayor") {
      setStep("mayor")
    } else if (step === "boardMembers") {
      setStep("viceMayor")
    } else if (step === "review") {
      setStep("boardMembers")
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/voter/college", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selections })
      })
      if (!res.ok) {
        const data = await res.json()
        toast({
          title: "Submission failed",
          description: data.message || "An error occurred while submitting your vote.",
          variant: "destructive"
        })
        setIsSubmitting(false)
        return
      }
      router.replace("/voter/vote/success")
    } catch (err) {
      toast({
        title: "Submission failed",
        description: err.message || "An error occurred while submitting your vote.",
        variant: "destructive"
      })
      setIsSubmitting(false)
    }
  }

  const getSelectedCandidate = (position, id) => {
    return candidates[position].find((c) => c.id === id)
  }

  const getSelectedBoardMembers = () => {
    return candidates.boardMembers.filter((c) => selections.boardMembers.includes(c.id))
  }

  const getPartyById = (id) => {
    return parties.find((p) => p.id === id)
  }

  const getTotalSelections = () => {
    let count = 0
    if (selections.governor) count++
    if (selections.viceGovernor) count++
    if (selections.mayor) count++
    if (selections.viceMayor) count++
    count += selections.boardMembers.length
    return count
  }

  const getMaxPossibleSelections = () => {
    return 4 + 6 // 4 single positions + 6 board members
  }

  return (
    <div className="space-y-8 container mx-auto px-4">
      {loadingColleges ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-muted-foreground">Loading college information...</p>
          </div>
        </div>
      ) : fetchCollegesError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading College Information</AlertTitle>
          <AlertDescription>
            {fetchCollegesError}. Please try refreshing the page or contact support if the problem persists.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: college.color }}>
              {college.name} Election
            </h1>
            <p className="text-muted-foreground">Cast your vote for your college representatives</p>
          </div>

          <div className="flex justify-between items-center overflow-x-auto pb-2">
            <div className="flex space-x-2 min-w-max">
              <Badge variant={step === "mode" ? "default" : "outline"}>Mode</Badge>
              <ChevronRight className="h-4 w-4" />
              <Badge variant={step === "governor" ? "default" : "outline"}>Governor</Badge>
              <ChevronRight className="h-4 w-4" />
              <Badge variant={step === "viceGovernor" ? "default" : "outline"}>Vice Governor</Badge>
              <ChevronRight className="h-4 w-4" />
              <Badge variant={step === "mayor" ? "default" : "outline"}>Mayor</Badge>
              <ChevronRight className="h-4 w-4" />
              <Badge variant={step === "viceMayor" ? "default" : "outline"}>Vice Mayor</Badge>
              <ChevronRight className="h-4 w-4" />
              <Badge variant={step === "boardMembers" ? "default" : "outline"}>Board Members</Badge>
              <ChevronRight className="h-4 w-4" />
              <Badge variant={step === "review" ? "default" : "outline"}>Review</Badge>
            </div>
          </div>

          <Card>
            {step === "mode" && (
              <>
                <CardHeader>
                  <CardTitle>Select Voting Mode</CardTitle>
                  <CardDescription>Choose how you want to vote for the College election</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="individual" onValueChange={(value) => setVotingMode(value)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="individual">Individual Mode</TabsTrigger>
                      <TabsTrigger value="party">Party Mode</TabsTrigger>
                    </TabsList>
                    <TabsContent value="individual" className="mt-4">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Individual Mode</AlertTitle>
                        <AlertDescription>
                          Select candidates individually for each position. You can choose candidates from different parties
                          or skip positions you don&apos;t want to vote for.
                        </AlertDescription>
                      </Alert>
                    </TabsContent>
                    <TabsContent value="party" className="mt-4">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Party Mode</AlertTitle>
                        <AlertDescription>
                          Select a party to automatically vote for all its candidates. You can still modify individual
                          selections or skip positions in the next steps.
                        </AlertDescription>
                      </Alert>

                      <div className="mt-4">
                        {loadingParties ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="text-center space-y-3">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                              <p className="text-muted-foreground">Loading parties...</p>
                            </div>
                          </div>
                        ) : fetchPartiesError ? (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error Loading Parties</AlertTitle>
                            <AlertDescription>
                              {fetchPartiesError}. Please try refreshing the page or contact support if the problem persists.
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <Select value={selectedParty} onValueChange={handlePartySelect}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a party" />
                            </SelectTrigger>
                            <SelectContent>
                              {parties.map((party) => (
                                <SelectItem key={party.id} value={party.id}>
                                  <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: party.color }}></div>
                                    {party.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </>
            )}

            {step === "governor" && (
              <>
                <CardHeader>
                  <CardTitle>Select Governor</CardTitle>
                  <CardDescription>Choose one candidate for College Governor or skip this position</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingCandidates ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-muted-foreground">Loading candidates...</p>
                      </div>
                    </div>
                  ) : fetchError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error Loading Candidates</AlertTitle>
                      <AlertDescription>
                        {fetchError}. Please try refreshing the page or contact support if the problem persists.
                      </AlertDescription>
                    </Alert>
                  ) : candidates.governor.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No candidates available for Governor position.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                      {candidates.governor.map((candidate) => (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          party={getPartyById(candidate.party)}
                          isSelected={selections.governor === candidate.id}
                          onSelect={() => handleSelectCandidate("governor", candidate.id)}
                          selectionMode="single"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </>
            )}

            {step === "viceGovernor" && (
              <>
                <CardHeader>
                  <CardTitle>Select Vice Governor</CardTitle>
                  <CardDescription>Choose one candidate for College Vice Governor or skip this position</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingCandidates ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-muted-foreground">Loading candidates...</p>
                      </div>
                    </div>
                  ) : fetchError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error Loading Candidates</AlertTitle>
                      <AlertDescription>
                        {fetchError}. Please try refreshing the page or contact support if the problem persists.
                      </AlertDescription>
                    </Alert>
                  ) : candidates.viceGovernor.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No candidates available for Vice Governor position.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                      {candidates.viceGovernor.map((candidate) => (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          party={getPartyById(candidate.party)}
                          isSelected={selections.viceGovernor === candidate.id}
                          onSelect={() => handleSelectCandidate("viceGovernor", candidate.id)}
                          selectionMode="single"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </>
            )}

            {step === "mayor" && (
              <>
                <CardHeader>
                  <CardTitle>Select Mayor</CardTitle>
                  <CardDescription>Choose one candidate for College Mayor or skip this position</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingCandidates ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-muted-foreground">Loading candidates...</p>
                      </div>
                    </div>
                  ) : fetchError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error Loading Candidates</AlertTitle>
                      <AlertDescription>
                        {fetchError}. Please try refreshing the page or contact support if the problem persists.
                      </AlertDescription>
                    </Alert>
                  ) : candidates.mayor.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No candidates available for Mayor position.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                      {candidates.mayor.map((candidate) => (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          party={getPartyById(candidate.party)}
                          isSelected={selections.mayor === candidate.id}
                          onSelect={() => handleSelectCandidate("mayor", candidate.id)}
                          selectionMode="single"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </>
            )}

            {step === "viceMayor" && (
              <>
                <CardHeader>
                  <CardTitle>Select Vice Mayor</CardTitle>
                  <CardDescription>Choose one candidate for College Vice Mayor or skip this position</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingCandidates ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-muted-foreground">Loading candidates...</p>
                      </div>
                    </div>
                  ) : fetchError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error Loading Candidates</AlertTitle>
                      <AlertDescription>
                        {fetchError}. Please try refreshing the page or contact support if the problem persists.
                      </AlertDescription>
                    </Alert>
                  ) : candidates.viceMayor.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No candidates available for Vice Mayor position.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                      {candidates.viceMayor.map((candidate) => (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          party={getPartyById(candidate.party)}
                          isSelected={selections.viceMayor === candidate.id}
                          onSelect={() => handleSelectCandidate("viceMayor", candidate.id)}
                          selectionMode="single"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </>
            )}

            {step === "boardMembers" && (
              <>
                <CardHeader>
                  <CardTitle>Select Board Members</CardTitle>
                  <CardDescription>
                    Choose up to 6 candidates for College Board Members or skip this position
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingCandidates ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-muted-foreground">Loading candidates...</p>
                      </div>
                    </div>
                  ) : fetchError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error Loading Candidates</AlertTitle>
                      <AlertDescription>
                        {fetchError}. Please try refreshing the page or contact support if the problem persists.
                      </AlertDescription>
                    </Alert>
                  ) : candidates.boardMembers.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No candidates available for Board Members position.</p>
                    </div>
                  ) : (
                    <>
                      <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Selection Limit</AlertTitle>
                        <AlertDescription>
                          You have selected {selections.boardMembers.length} of 6 possible board members.
                        </AlertDescription>
                      </Alert>

                      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                        {candidates.boardMembers.map((candidate) => (
                          <CandidateCard
                            key={candidate.id}
                            candidate={candidate}
                            party={getPartyById(candidate.party)}
                            isSelected={selections.boardMembers.includes(candidate.id)}
                            onSelect={() => handleSelectCandidate("boardMembers", candidate.id)}
                            selectionMode="multiple"
                            disabled={selections.boardMembers.length >= 6 && !selections.boardMembers.includes(candidate.id)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </>
            )}

            {step === "review" && (
              <>
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl">Review Your Selections</CardTitle>
                      <CardDescription>
                        Please review your selections before submitting your vote for {college.name}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: college.color }}>
                          {getTotalSelections()}
                        </div>
                        <div className="text-xs text-muted-foreground">of {getMaxPossibleSelections()} selected</div>
                      </div>
                      <div
                        className="w-12 h-12 rounded-full overflow-hidden border-2"
                        style={{ borderColor: college.color }}
                      >
                        <Image
                          src={college.logo || "/placeholder.svg?height=48&width=48"}
                          alt={`${college.name} logo`}
                          className="w-full h-full object-contain"
                          width={48}
                          height={48}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* College Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border-2" style={{ borderColor: college.color }}>
                        <Image
                          src={college.logo || "/placeholder.svg?height=64&width=64"}
                          alt={`${college.name} logo`}
                          className="w-full h-full object-contain"
                          width={64}
                          height={64}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: college.color }}>
                          {college.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">College Election Ballot</p>
                        <Badge variant="outline" style={{ borderColor: college.color, color: college.color }}>
                          {college.shortName}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Single Positions */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Governor */}
                    <ReviewSelectionCard
                      position="Governor"
                      candidate={selections.governor ? getSelectedCandidate("governor", selections.governor) : null}
                      party={
                        selections.governor
                          ? getPartyById(getSelectedCandidate("governor", selections.governor)?.party)
                          : null
                      }
                      college={college}
                      onEdit={() => handleEditPosition("governor")}
                      onRemove={() => handleRemoveSelection("governor")}
                      isSkipped={!selections.governor}
                    />

                    {/* Vice Governor */}
                    <ReviewSelectionCard
                      position="Vice Governor"
                      candidate={
                        selections.viceGovernor ? getSelectedCandidate("viceGovernor", selections.viceGovernor) : null
                      }
                      party={
                        selections.viceGovernor
                          ? getPartyById(getSelectedCandidate("viceGovernor", selections.viceGovernor)?.party)
                          : null
                      }
                      college={college}
                      onEdit={() => handleEditPosition("viceGovernor")}
                      onRemove={() => handleRemoveSelection("viceGovernor")}
                      isSkipped={!selections.viceGovernor}
                    />

                    {/* Mayor */}
                    <ReviewSelectionCard
                      position="Mayor"
                      candidate={selections.mayor ? getSelectedCandidate("mayor", selections.mayor) : null}
                      party={selections.mayor ? getPartyById(getSelectedCandidate("mayor", selections.mayor)?.party) : null}
                      college={college}
                      onEdit={() => handleEditPosition("mayor")}
                      onRemove={() => handleRemoveSelection("mayor")}
                      isSkipped={!selections.mayor}
                    />

                    {/* Vice Mayor */}
                    <ReviewSelectionCard
                      position="Vice Mayor"
                      candidate={selections.viceMayor ? getSelectedCandidate("viceMayor", selections.viceMayor) : null}
                      party={
                        selections.viceMayor
                          ? getPartyById(getSelectedCandidate("viceMayor", selections.viceMayor)?.party)
                          : null
                      }
                      college={college}
                      onEdit={() => handleEditPosition("viceMayor")}
                      onRemove={() => handleRemoveSelection("viceMayor")}
                      isSkipped={!selections.viceMayor}
                    />
                  </div>

                  {/* Board Members */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium">Board Members</h3>
                        <p className="text-sm text-muted-foreground">{selections.boardMembers.length} of 6 selected</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditPosition("boardMembers")}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>

                    {selections.boardMembers.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {getSelectedBoardMembers().map((boardMember, index) => (
                          <div
                            key={boardMember.id}
                            className="relative group p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm">
                                <Image
                                  src={boardMember.photo || "/placeholder.svg?height=48&width=48"}
                                  alt={boardMember.name}
                                  className="w-full h-full object-cover"
                                  width={48}
                                  height={48}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm line-clamp-1">{boardMember.name}</p>
                                <Badge
                                  style={{ backgroundColor: getPartyById(boardMember.party)?.color }}
                                  className="text-white text-xs"
                                >
                                  {getPartyById(boardMember.party)?.name}
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">#{index + 1} Board Member</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                onClick={() => handleRemoveSelection("boardMembers", boardMember.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                        <p className="text-muted-foreground italic">No board members selected</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleEditPosition("boardMembers")}
                        >
                          Select Board Members
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Summary Statistics */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium mb-3 text-blue-900">Selection Summary</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{getTotalSelections()}</div>
                        <div className="text-xs text-blue-700">Total Selections</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {Object.values(selections).filter((s) => (Array.isArray(s) ? s.length > 0 : s !== "")).length}
                        </div>
                        <div className="text-xs text-green-700">Positions Filled</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {5 - Object.values(selections).filter((s) => (Array.isArray(s) ? s.length > 0 : s !== "")).length}
                        </div>
                        <div className="text-xs text-orange-700">Positions Skipped</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold" style={{ color: college.color }}>
                          {Math.round((getTotalSelections() / getMaxPossibleSelections()) * 100)}%
                        </div>
                        <div className="text-xs" style={{ color: college.color }}>
                          Completion
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Final Warning */}
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-600">Important Notice</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      Once submitted, your vote cannot be changed. Please ensure your selections are correct. You can still
                      edit any position by clicking the &ldquo;Edit&rdquo; button above.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </>
            )}

            <CardFooter className="flex justify-between">
              {step !== "mode" && (
                <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
                  Back
                </Button>
              )}

              <div className="flex gap-2">
                {step !== "mode" && step !== "review" && (
                  <Button variant="secondary" onClick={handleNext} disabled={isSubmitting}>
                    Skip
                  </Button>
                )}
                {step !== "review" ? (
                  <Button onClick={handleNext} style={{ backgroundColor: college.color }} disabled={isSubmitting}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Vote"}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}
