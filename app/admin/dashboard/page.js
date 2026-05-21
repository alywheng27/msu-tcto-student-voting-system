import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Turnout from "@/components/admin/dashboard/Turnout"
import College from "@/components/admin/dashboard/College"
import Party from "@/components/admin/dashboard/Party"

import { getVotingStats, getPartyResults } from "@/lib/dashboard"

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const stats = await getVotingStats()
  const sscPartyResults = await getPartyResults("all")
  
  const collegeData = stats.collegeStats.map((college) => ({
    name: college.name,
    voters: college.votersCount,
    nonVoters: college.totalStudents - college.votersCount,
  }))

  const collegeConfig = {
    voters: {
      label: "Voters",
      color: "var(--chart-1)",
    },
    nonVoters: {
      label: "Non Voters",
      color: "var(--chart-2)",
    },
  }

  const pieData = [
    { name: "Voted", value: stats.totalVoters, fill: "var(--color-voted)" },
    { name: "Not Voted", value: stats.totalStudents - stats.totalVoters, fill: "var(--color-not_voted)" },
  ]

  const pieConfig = {
    value: {
      label: "Value",
    },
    voted: {
      label: "Voted",
      color: "var(--chart-1)",
    },
    not_voted: {
      label: "Not Voted",
      color: "var(--chart-2)",
    },
  }

  const partyData = sscPartyResults.map((party) => ({
    name: party.party,
    votes: party.votes,
    color: party.color,
  }))

  const partyConfig = {
    votes: {
      label: "Votes",
      color: "var(--chart-1)",
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-[#61063B]">Admin Dashboard</h1>
        <p className="text-[#61063B]">
          Welcome to the MSU-TCTO Voting System admin dashboard. Monitor election progress and manage the system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#61063B]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalStudents}
            </div>
            <p className="text-xs text-white">Enrolled students across all colleges</p>
          </CardContent>
        </Card>
        <Card className="bg-[#61063B]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Voters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalVoters}</div>
            <p className="text-xs text-white">
              {((stats.totalVoters / stats.totalStudents) * 100).toFixed(1)}% of total students
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#61063B]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Non-Voters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalStudents - stats.totalVoters}</div>
            <p className="text-xs text-white">
              {(((stats.totalStudents - stats.totalVoters) / stats.totalStudents) * 100).toFixed(1)}% of total students
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#61063B]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Leading Party</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{sscPartyResults[0]?.party || "N/A"}</div>
            <p className="text-xs text-white">
              {sscPartyResults[0]?.votes || 0} total votes across all positions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="turnout" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-[#61063B]">
          <TabsTrigger value="turnout" className="text-[#CA8A04]">Voter Turnout</TabsTrigger>
          <TabsTrigger value="colleges" className="text-[#CA8A04]">College Stats</TabsTrigger>
          <TabsTrigger value="parties" className="text-[#CA8A04]">Party Results</TabsTrigger>
        </TabsList>

        <TabsContent value="turnout" className="mt-6">
            <Card className="text-[#61063B]">
            <CardHeader>
              <CardTitle>Overall Voter Turnout</CardTitle>
              <CardDescription className="text-[#61063B]">Current voting status across the entire student body</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] w-full">
                <Turnout pieData={pieData} pieConfig={pieConfig} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colleges" className="mt-6">
          <Card className="text-[#61063B]">
            <CardHeader>
              <CardTitle>Voting Statistics by College</CardTitle>
              <CardDescription className="text-[#61063B]">Comparison of voter turnout across different colleges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] w-full">
                <College collegeData={collegeData} collegeConfig={collegeConfig} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parties" className="mt-6">
          <Card className="text-[#61063B]">
            <CardHeader>
              <CardTitle>SSC Party Results</CardTitle>
              <CardDescription className="text-[#61063B]">Total votes received by each party across all SSC positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mid-h-[300px] w-full">
                <Party partyData={partyData} partyConfig={partyConfig} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
