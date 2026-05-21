import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getVotingStats } from "@/lib/dashboard"
import MainCard from "./Main-Card"
import VotingStatistics from "./Voting-Statistics"
import OverallVotingTurnout from "./Overall-Voting-Turnout"
import { Suspense } from "react"

export async function PublicStats() {
  const stats = await getVotingStats()

  function loading() {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
    
  if (!stats) {
    return <div>No statistics available</div>
  }

  const collegeData = stats.collegeStats.map((college) => ({
    name: college.name,
    voters: college.votersCount,
    nonVoters: college.totalStudents - college.votersCount,
  }))

  const collegeConfig = {
    voters: {
      label: "Voters",
      color: "var(--chart-3)",
    },
    nonVoters: {
      label: "Non Voters",
      color: "var(--chart-2)",
    },
  }

  const pieData = [
    { name: "Voted", value: stats.totalVoters },
    { name: "Not Voted", value: stats.totalStudents - stats.totalVoters },
  ]

  const pieConfig = {
    value: {
      label: "Value",
    },
    "Voted": {
      label: "Voted",
      color: "var(--chart-1)",
    },
    "Not Voted": {
      label: "Not Voted",
      color: "var(--chart-2)",
    },
  }
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={loading()}>
          <MainCard totalStudents={stats.totalStudents} totalVoters={stats.totalVoters} />
        </Suspense>
      </div>

      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="bar" className="text-[#61063B]">College Statistics</TabsTrigger>
          <TabsTrigger value="pie" className="text-[#61063B]">Overall Turnout</TabsTrigger>
        </TabsList>
        <TabsContent value="bar" className="mt-6">
          <Suspense fallback={loading()}>
            <VotingStatistics collegeConfig={collegeConfig} collegeData={collegeData} />
          </Suspense>
        </TabsContent>
        <TabsContent value="pie" className="mt-6">
          <Suspense fallback={loading()}>
            <OverallVotingTurnout pieConfig={pieConfig} pieData={pieData} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
