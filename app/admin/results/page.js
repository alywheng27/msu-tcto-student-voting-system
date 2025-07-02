import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CandidateResultCard } from "@/components/admin/results/Candidate-Result-Card"
import { getParties, getPositions, getElectionResults } from '@/lib/results'
import { getColleges } from "@/lib/voters"
import Image from "next/image"

// Helper function to detect draw votes for multi-winner positions
function getDrawVotes(positionResult, positionObj) {
  const maxSelections = positionObj?.MaximumSelection || positionObj?.MaxSelections || 1
  if (
    (positionResult.position === "Senator" || positionResult.position === "Board Member") &&
    positionResult.candidates.length > maxSelections
  ) {
    const lastWinnerVotes = positionResult.candidates[maxSelections - 1]?.votes
    const nextVotes = positionResult.candidates[maxSelections]?.votes
    if (nextVotes !== undefined && lastWinnerVotes === nextVotes) {
      return lastWinnerVotes
    }
  }
  return null
}

export default async function ResultsPage() {
  const [colleges, parties, positions, sscResults] = await Promise.all([getColleges(), getParties(), getPositions(), getElectionResults("ssc")])

  // Pre-fetch all college results
  const collegeResultsData = await Promise.all(
    colleges.map(async (college) => ({
      college,
      results: await getElectionResults("college", college.CollegeOfficeID),
    })),
  )

  // Reorder SSC results: Senator, Vice President, President, Secretary
  const reorderedSscResults = sscResults.sort((a, b) => {
    return b.decree - a.decree
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Election Results</h1>
        <p className="text-muted-foreground">View and analyze the current election results.</p>
      </div>

      <Tabs defaultValue="college" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="college">College Results</TabsTrigger>
          <TabsTrigger value="ssc">SSC Results</TabsTrigger>
        </TabsList>

        <TabsContent value="ssc" className="mt-6 space-y-6">
          {/* SSC Position Results with Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>SSC Position Results</CardTitle>
              <CardDescription>Detailed results for each SSC position</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="flex flex-wrap gap-1 h-auto p-1">
                  <TabsTrigger
                    value="overview"
                    className="flex-shrink-0 text-xs px-3 py-2"
                  >
                    Selection
                  </TabsTrigger>
                  {reorderedSscResults.map((positionResult) => (
                    <TabsTrigger
                      key={positionResult.positionId}
                      value={positionResult.positionId}
                      className="flex-shrink-0 text-xs px-3 py-2"
                    >
                      {positionResult.position}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Overview Tab - Shows nothing, just placeholder */}
                <TabsContent value="overview" className="mt-6">
                  <div className="text-center py-12">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Position</h3>
                    <p className="text-gray-500">Click on any position tab above to view the election results</p>
                  </div>
                </TabsContent>
                
                {reorderedSscResults.map((positionResult) => {
                  const totalVotes = positionResult.candidates.reduce((sum, candidate) => sum + candidate.votes, 0)
                  const positionObj = positions.find(p => p.PositionID === positionResult.positionId)
                  const maxSelections = positionObj.MaximumSelection
                  // Use helper for draw logic
                  const drawVotes = getDrawVotes(positionResult, positionObj)

                  // Draw logic: Only for single-slot positions (default)
                  const maxVotes = Math.max(...positionResult.candidates.map(c => c.votes))
                  const topCandidates = positionResult.candidates.filter(c => c.votes === maxVotes)
                  const isDraw = topCandidates.length > 1 && maxSelections === 1

                  return (
                    <TabsContent key={positionResult.positionId} value={positionResult.positionId} className="mt-6">
                      <div className="space-y-3">
                        {positionResult.candidates.map((candidate, index) => {
                          const party = parties.find((p) => p.PartyID === candidate.party.PartyID)
                          const isWinner = index === 0

                          // For senators, multiple winners
                          const isWinnerSenator = positionResult.position === "Senator" && index < maxSelections
                          const showAsWinner = positionResult.position === "Senator" ? isWinnerSenator : isWinner
                          // Use helper for draw logic
                          let showAsDraw = false
                          if (positionResult.position === "Senator" && drawVotes !== null) {
                            showAsDraw = candidate.votes === drawVotes
                          } else {
                            showAsDraw = isDraw && candidate.votes === maxVotes
                          }

                          return (
                            <CandidateResultCard
                              key={candidate.id}
                              candidate={candidate}
                              party={party}
                              rank={index + 1}
                              isWinner={showAsWinner}
                              isDraw={showAsDraw}
                              votes={candidate.votes}
                              totalVotes={totalVotes}
                            />
                          )
                        })}
                      </div>
                    </TabsContent>
                  )
                })}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="college" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>College Election Results</CardTitle>
              <CardDescription>View detailed results for each college&apos;s elections</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={colleges[0].CollegeOfficeID} className="w-full">
                <TabsList className="flex flex-wrap gap-1 h-auto p-1">
                  {colleges.map((college) => (
                    <TabsTrigger
                      key={college.CollegeOfficeID}
                      value={college.CollegeOfficeID}
                      className="flex-shrink-0 text-xs px-3 py-2"
                      style={{
                        borderColor: college.CollegeOfficeColor,
                        color: college.CollegeOfficeColor,
                      }}
                    >
                      {college.CollegeOfficeCode}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {collegeResultsData.map(({ college, results: collegeResults }) => {
                  // Reorder college results: Board Member, Vice Mayor, Mayor, Vice Governor, Governor
                  const reorderedCollegeResults = collegeResults.sort((a, b) => {
                    return b.decree - a.decree
                  })

                  return (
                    <TabsContent key={college.CollegeOfficeID} value={college.CollegeOfficeID} className="mt-6 space-y-6">
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <Image
                            src={college.Logo || "/candidates/no-photo.png"}
                            alt={`${college.CollegeOffice} logo`}
                            className="w-12 h-12 object-contain"
                            width={250}
                            height={250}
                          />
                          <h3 className="text-2xl font-bold" style={{ color: college.CollegeOfficeColor }}>
                            {college.CollegeOffice}
                          </h3>
                        </div>
                        {/* <p className="text-muted-foreground">{college.description}</p> */}
                      </div>

                      {/* College Position Results with Tabs */}
                      <Card>
                        <CardHeader>
                          <CardTitle style={{ color: college.CollegeOfficeColor }}>{college.CollegeOfficeCode} Position Results</CardTitle>
                          <CardDescription>Detailed results for each {college.CollegeOfficeCode} position</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="flex flex-wrap gap-1 h-auto p-1">
                              <TabsTrigger
                                value="overview"
                                className="flex-shrink-0 text-xs px-3 py-2"
                                style={{
                                  borderColor: college.CollegeOfficeColor,
                                  color: college.CollegeOfficeColor,
                                }}
                              >
                                Selection
                              </TabsTrigger>
                              {reorderedCollegeResults.map((positionResult) => (
                                <TabsTrigger
                                  key={positionResult.positionId}
                                  value={positionResult.positionId}
                                  className="flex-shrink-0 text-xs px-3 py-2"
                                  style={{
                                    borderColor: college.CollegeOfficeColor,
                                    color: college.CollegeOfficeColor,
                                  }}
                                >
                                  {positionResult.position}
                                </TabsTrigger>
                              ))}
                            </TabsList>

                            {/* College Overview Tab - Shows nothing, just placeholder */}
                            <TabsContent value="overview" className="mt-6">
                              <div className="text-center py-12">
                                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
                                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Position</h3>
                                <p className="text-gray-500">Click on any position tab above to view the election results</p>
                              </div>
                            </TabsContent>

                            {reorderedCollegeResults.map((positionResult) => {
                              const totalVotes = positionResult.candidates.reduce((sum, candidate) => sum + candidate.votes, 0)
                              const positionObj = positions.find(p => p.PositionID === positionResult.positionId)
                              const maxSelections = positionObj.MaximumSelection
                              // Use helper for draw logic
                              const drawVotes = getDrawVotes(positionResult, positionObj)

                              // Draw logic: Only for single-slot positions (default)
                              const maxVotes = Math.max(...positionResult.candidates.map(c => c.votes))
                              const topCandidates = positionResult.candidates.filter(c => c.votes === maxVotes)
                              const isDraw = topCandidates.length > 1 && maxSelections === 1

                              return (
                                <TabsContent key={positionResult.positionId} value={positionResult.positionId} className="mt-6">
                                  <div className="space-y-3">
                                    {positionResult.candidates.map((candidate, index) => {
                                      const party = parties.find((p) => p.PartyID === candidate.party.PartyID)
                                      const isWinner = index === 0

                                      // For board members, multiple winners (top N)
                                      const isBoardMemberWinner = positionResult.position === "Board Member" && index < maxSelections
                                      const showAsWinner = positionResult.position === "Board Member" ? isBoardMemberWinner : isWinner
                                      // Use helper for draw logic
                                      let showAsDraw = false
                                      if (positionResult.position === "Board Member" && drawVotes !== null) {
                                        showAsDraw = candidate.votes === drawVotes
                                      } else {
                                        showAsDraw = isDraw && candidate.votes === maxVotes
                                      }

                                      return (
                                        <CandidateResultCard
                                          key={candidate.id}
                                          candidate={candidate}
                                          party={party}
                                          rank={index + 1}
                                          isWinner={showAsWinner}
                                          isDraw={showAsDraw}
                                          votes={candidate.votes}
                                          totalVotes={totalVotes}
                                        />
                                      )
                                    })}
                                  </div>
                                </TabsContent>
                              )
                            })}
                          </Tabs>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )
                })}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
