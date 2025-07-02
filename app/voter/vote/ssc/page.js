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

export default function SSCVotingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cookieValue, setCookieValue] = useState({})
  const [votingMode, setVotingMode] = useState("individual")
  const [selectedParty, setSelectedParty] = useState("")
  const [step, setStep] = useState("mode")
  const [selections, setSelections] = useState({
    president: "",
    vicePresident: "",
    senators: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [candidates, setCandidates] = useState({
    president: [],
    vicePresident: [],
    senators: [],
  })
  const [loadingCandidates, setLoadingCandidates] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [parties, setParties] = useState([])
  const [loadingParties, setLoadingParties] = useState(true)
  const [fetchPartiesError, setFetchPartiesError] = useState(null)

  const ssc = {
    id: "ssc",
    name: "Supreme Student Council",
    shortName: "SSC",
    color: "#1E90FF",
    logo: "/placeholder.svg?height=100&width=100",
  }

  function fetchCookies() {
    // Read cookies using js-cookie
    return {
      hasVotedSSC: Cookies.get("HasVotedSSC"),
      // Add more cookies if needed
    }
  }

  const alreadyVoted = useCallback(() => {
    if (cookieValue.hasVotedSSC === 'true') {
      router.replace("/voter/vote/voted")
    }
  }, [cookieValue.hasVotedSSC, router])

  useEffect(() => {
    fetchCandidates()
    fetchParties()
    setCookieValue(fetchCookies())
    alreadyVoted()
  }, [alreadyVoted])

  async function fetchCandidates() {
    setLoadingCandidates(true)
    setFetchError(null)
    try {
      const res = await fetch("/api/admin/candidates")
      if (!res.ok) throw new Error("Failed to fetch candidates")
      const data = await res.json()
      // I-map ang data base sa position
      const mapped = {
        president: [],
        vicePresident: [],
        senators: [],
      }
      data.forEach((c) => {
        if (c.Position?.toLowerCase() === "president") {
          mapped.president.push({
            id: c.CandidateID,
            name: `${c.FirstName} ${c.Surname}`,
            party: c.PartyID?.toString() || c.Party,
            photo: c.Photo || "/candidates/no-photo.png",
          })
        } else if (c.Position?.toLowerCase() === "vice president") {
          mapped.vicePresident.push({
            id: c.CandidateID,
            name: `${c.FirstName} ${c.Surname}`,
            party: c.PartyID?.toString() || c.Party,
            photo: c.Photo || "/candidates/no-photo.png",
          })
        } else if (c.Position?.toLowerCase() === "senator") {
          mapped.senators.push({
            id: c.CandidateID,
            name: `${c.FirstName} ${c.Surname}`,
            party: c.PartyID?.toString() || c.Party,
            photo: c.Photo || "/candidates/no-photo.png",
          })
        }
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
      const mapped = data.map((p) => ({
        id: p.PartyID?.toString() || p.Party,
        name: p.Party,
        color: p.PartyColor || "#2196F3",
        logo: p.Logo || "/parties/no-logo.png",
      }))
      setParties(mapped)
    } catch (err) {
      setFetchPartiesError(err.message)
    } finally {
      setLoadingParties(false)
    }
  }

  const handlePartySelect = (partyId) => {
    setSelectedParty(partyId)

    const presidentCandidate = candidates.president.find((c) => c.party === partyId)
    const vicePresidentCandidate = candidates.vicePresident.find((c) => c.party === partyId)
    const senatorCandidates = candidates.senators.filter((c) => c.party === partyId).slice(0, 10)

    setSelections({
      president: presidentCandidate?.id || "",
      vicePresident: vicePresidentCandidate?.id || "",
      senators: senatorCandidates.map((c) => c.id),
    })
  }

  const handleSelectCandidate = (position, candidateId) => {
    if (position === "senators") {
      setSelections((prev) => {
        if (prev.senators.includes(candidateId)) {
          return { ...prev, senators: prev.senators.filter((id) => id !== candidateId) }
        } else {
          if (prev.senators.length < 10) {
            return { ...prev, senators: [...prev.senators, candidateId] }
          }
          return prev
        }
      })
    } else {
      setSelections((prev) => ({ ...prev, [position]: candidateId }))
    }
  }

  const handleRemoveSelection = (position, candidateId = null) => {
    if (position === "senators" && candidateId) {
      setSelections((prev) => ({
        ...prev,
        senators: prev.senators.filter((id) => id !== candidateId),
      }))
    } else {
      setSelections((prev) => ({ ...prev, [position]: "" }))
    }
  }

  const handleEditPosition = (position) => {
    const stepMap = {
      president: "president",
      vicePresident: "vicePresident",
      senators: "senators",
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
      setStep("president")
    } else if (step === "president") {
      setStep("vicePresident")
    } else if (step === "vicePresident") {
      setStep("senators")
    } else if (step === "senators") {
      setStep("review")
    }
  }

  const handleBack = () => {
    if (step === "president") {
      setStep("mode")
    } else if (step === "vicePresident") {
      setStep("president")
    } else if (step === "senators") {
      setStep("vicePresident")
    } else if (step === "review") {
      setStep("senators")
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/voter/ssc", {
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

  const getSelectedCandidate = (type, id) => {
    return candidates[type].find((c) => c.id === id)
  }

  const getSelectedSenators = () => {
    return candidates.senators.filter((c) => selections.senators.includes(c.id))
  }

  const getPartyById = (id) => {
    return parties.find((p) => p.id === id)
  }

  const getTotalSelections = () => {
    let count = 0
    if (selections.president) count++
    if (selections.vicePresident) count++
    count += selections.senators.length
    return count
  }

  const getMaxPossibleSelections = () => {
    return 2 + 10 // 2 single positions + 10 senators
  }

  return (
    <div className="space-y-8 container mx-auto px-4">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: ssc.color }}>
          {ssc.name} Election
        </h1>
        <p className="text-muted-foreground">Cast your vote for the Supreme Student Council</p>
      </div>

      <div className="flex justify-between items-center overflow-x-auto pb-2">
        <div className="flex space-x-2 min-w-max">
          <Badge variant={step === "mode" ? "default" : "outline"}>Mode</Badge>
          <ChevronRight className="h-4 w-4" />
          <Badge variant={step === "president" ? "default" : "outline"}>President</Badge>
          <ChevronRight className="h-4 w-4" />
          <Badge variant={step === "vicePresident" ? "default" : "outline"}>Vice President</Badge>
          <ChevronRight className="h-4 w-4" />
          <Badge variant={step === "senators" ? "default" : "outline"}>Senators</Badge>
          <ChevronRight className="h-4 w-4" />
          <Badge variant={step === "review" ? "default" : "outline"}>Review</Badge>
        </div>
      </div>

      <Card>
        {step === "mode" && (
          <>
            <CardHeader>
              <CardTitle>Select Voting Mode</CardTitle>
              <CardDescription>Choose how you want to vote for the SSC election</CardDescription>
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

        {step === "president" && (
          <>
            <CardHeader>
              <CardTitle>Select President</CardTitle>
              <CardDescription>Choose one candidate for SSC President or skip this position</CardDescription>
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
              ) : candidates.president.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No candidates available for President position.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {candidates.president.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      party={getPartyById(candidate.party)}
                      isSelected={selections.president === candidate.id}
                      onSelect={() => handleSelectCandidate("president", candidate.id)}
                      selectionMode="single"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </>
        )}

        {step === "vicePresident" && (
          <>
            <CardHeader>
              <CardTitle>Select Vice President</CardTitle>
              <CardDescription>Choose one candidate for SSC Vice President or skip this position</CardDescription>
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
              ) : candidates.vicePresident.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No candidates available for Vice President position.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {candidates.vicePresident.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      party={getPartyById(candidate.party)}
                      isSelected={selections.vicePresident === candidate.id}
                      onSelect={() => handleSelectCandidate("vicePresident", candidate.id)}
                      selectionMode="single"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </>
        )}

        {step === "senators" && (
          <>
            <CardHeader>
              <CardTitle>Select Senators</CardTitle>
              <CardDescription>Choose up to 10 candidates for SSC Senators or skip this position</CardDescription>
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
              ) : candidates.senators.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No candidates available for Senators position.</p>
                </div>
              ) : (
                <>
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Selection Limit</AlertTitle>
                    <AlertDescription>
                      You have selected {selections.senators.length} of 10 possible senators.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {candidates.senators.map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        party={getPartyById(candidate.party)}
                        isSelected={selections.senators.includes(candidate.id)}
                        onSelect={() => handleSelectCandidate("senators", candidate.id)}
                        selectionMode="multiple"
                        disabled={selections.senators.length >= 10 && !selections.senators.includes(candidate.id)}
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
                    Please review your selections before submitting your vote for the Supreme Student Council
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: ssc.color }}>
                      {getTotalSelections()}
                    </div>
                    <div className="text-xs text-muted-foreground">of {getMaxPossibleSelections()} selected</div>
                  </div>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2" style={{ borderColor: ssc.color }}>
                    <Image
                      src={ssc.logo || "/placeholder.svg?height=48&width=48"}
                      alt={`${ssc.name} logo`}
                      className="w-full h-full object-contain"
                      width={48}
                      height={48}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* SSC Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border-2" style={{ borderColor: ssc.color }}>
                    <Image
                      src={ssc.logo || "/placeholder.svg?height=64&width=64"}
                      alt={`${ssc.name} logo`}
                      className="w-full h-full object-contain"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: ssc.color }}>
                      {ssc.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">University-wide Election Ballot</p>
                    <Badge variant="outline" style={{ borderColor: ssc.color, color: ssc.color }}>
                      {ssc.shortName}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Single Positions */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* President */}
                <ReviewSelectionCard
                  position="President"
                  candidate={selections.president ? getSelectedCandidate("president", selections.president) : null}
                  party={
                    selections.president
                      ? getPartyById(getSelectedCandidate("president", selections.president)?.party)
                      : null
                  }
                  college={ssc}
                  onEdit={() => handleEditPosition("president")}
                  onRemove={() => handleRemoveSelection("president")}
                  isSkipped={!selections.president}
                />

                {/* Vice President */}
                <ReviewSelectionCard
                  position="Vice President"
                  candidate={
                    selections.vicePresident ? getSelectedCandidate("vicePresident", selections.vicePresident) : null
                  }
                  party={
                    selections.vicePresident
                      ? getPartyById(getSelectedCandidate("vicePresident", selections.vicePresident)?.party)
                      : null
                  }
                  college={ssc}
                  onEdit={() => handleEditPosition("vicePresident")}
                  onRemove={() => handleRemoveSelection("vicePresident")}
                  isSkipped={!selections.vicePresident}
                />
              </div>

              {/* Senators */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Senators</h3>
                    <p className="text-sm text-muted-foreground">{selections.senators.length} of 10 selected</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditPosition("senators")}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>

                {selections.senators.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {getSelectedSenators().map((senator, index) => (
                      <div
                        key={senator.id}
                        className="relative group p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm">
                            <Image
                              src={senator.photo || "/placeholder.svg?height=48&width=48"}
                              alt={senator.name}
                              className="w-full h-full object-cover"
                              width={48}
                              height={48}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-1">{senator.name}</p>
                            <Badge
                              style={{ backgroundColor: getPartyById(senator.party)?.color }}
                              className="text-white text-xs"
                            >
                              {getPartyById(senator.party)?.name}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">#{index + 1} Senator</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                            onClick={() => handleRemoveSelection("senators", senator.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-muted-foreground italic">No senators selected</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => handleEditPosition("senators")}>
                      Select Senators
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
                      {3 - Object.values(selections).filter((s) => (Array.isArray(s) ? s.length > 0 : s !== "")).length}
                    </div>
                    <div className="text-xs text-orange-700">Positions Skipped</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: ssc.color }}>
                      {Math.round((getTotalSelections() / getMaxPossibleSelections()) * 100)}%
                    </div>
                    <div className="text-xs" style={{ color: ssc.color }}>
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
                  edit any position by clicking the &ldquo;Edit&ldquo; button above.
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
              <Button onClick={handleNext} style={{ backgroundColor: ssc.color }} disabled={isSubmitting}>
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
    </div>
  )
}
