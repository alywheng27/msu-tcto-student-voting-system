import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"

// Components
import Turnout from "@/components/admin/dashboard/Turnout"

// Lib
import { getVotingStats, getPartyResults } from "@/lib/data"

export default async function AdminDashboardPage() {
  const stats = await getVotingStats()
  const sscPartyResults = await getPartyResults("ssc")

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  const collegeData = stats.collegeStats.map((college) => ({
    name: college.name,
    voters: college.votersCount,
    nonVoters: college.totalStudents - college.votersCount,
  }))

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
      color: "#0088FE",
    },
    not_voted: {
      label: "Not Voted",
      color: "#FF8042",
    },
  }

  const partyData = sscPartyResults.map((party) => ({
    name: party.party,
    votes: party.votes,
    color: party.color,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the MSU-TCTO Voting System admin dashboard. Monitor election progress and manage the system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled students across all colleges</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVoters}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.totalVoters / stats.totalStudents) * 100).toFixed(1)}% of total students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Non-Voters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents - stats.totalVoters}</div>
            <p className="text-xs text-muted-foreground">
              {(((stats.totalStudents - stats.totalVoters) / stats.totalStudents) * 100).toFixed(1)}% of total students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Leading Party</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sscPartyResults[0]?.party || "N/A"}</div>
            <p className="text-xs text-muted-foreground">
              {sscPartyResults[0]?.votes || 0} total votes across all positions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="turnout" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="turnout">Voter Turnout</TabsTrigger>
          <TabsTrigger value="colleges">College Stats</TabsTrigger>
          <TabsTrigger value="parties">Party Results</TabsTrigger>
        </TabsList>

        <TabsContent value="turnout" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Voter Turnout</CardTitle>
              <CardDescription>Current voting status across the entire student body</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] w-full">
                <Turnout pieData={pieData} pieConfig={pieConfig} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="colleges" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Voting Statistics by College</CardTitle>
              <CardDescription>Comparison of voter turnout across different colleges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={collegeData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
                      <YAxis />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <ChartTooltipContent>
                                <div className="font-medium">{payload[0].payload.name}</div>
                                <div className="text-[#0088FE]">Voters: {payload[0].value}</div>
                                <div className="text-[#FF8042]">Non-Voters: {payload[1].value}</div>
                              </ChartTooltipContent>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="voters" fill="#0088FE" name="Voters" />
                      <Bar dataKey="nonVoters" fill="#FF8042" name="Non-Voters" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* <TabsContent value="parties" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>SSC Party Results</CardTitle>
              <CardDescription>Total votes received by each party across all SSC positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={partyData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <ChartTooltipContent>
                                <div className="font-medium">{payload[0].payload.name}</div>
                                <div>Votes: {payload[0].value}</div>
                              </ChartTooltipContent>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="votes" name="Votes" fill="#8884d8" radius={[4, 4, 0, 0]}>
                        {partyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}
