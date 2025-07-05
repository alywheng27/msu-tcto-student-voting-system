import Image from "next/image";
import Link from "next/link"
import { Users, Vote, TrendingUp, LogIn } from "lucide-react"

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"


// lib
import { getElectionInfo, getVotingStatus } from "@/lib/system-settings"
import { getColleges } from "@/lib/voters"
import { getVotingStats } from "@/lib/dashboard"


import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { VotingCountdown } from "@/components/main/Voting-Countdown"
import { PublicStats } from "@/components/main/Public-Stats";

export default async function Home() {
  const electionInfo = getElectionInfo();
  const [colleges, stats] = await Promise.all([getColleges(), getVotingStats()])
  const votingStatus = getVotingStatus()

  // Define explicit mapping from votingStatus.status to electionStatus
  const statusMapping = {
    "active": "active",
    "upcoming": "upcoming", 
    "ended": "ended",
    "maintenance": "ended",
    "disabled": "ended"
  };

  const electionStatus = statusMapping[votingStatus.status] || "ended";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="container mx-auto px-4 pt-12">
        <div className="min-h-[80vh]">
          <section className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#1E90FF] to-[#0066CC] bg-clip-text text-transparent">
              {electionInfo.title}
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">{electionInfo.description}</p>
            {electionInfo.maintenanceMode === true && (
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-center font-medium">{electionInfo.systemMessage}</p>
              </div>
            )}
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/login">
                <Button size="lg" className="bg-[#1E90FF] hover:bg-blue-600 shadow-lg">
                  Get Started
                </Button>
              </Link>
              <Link href="#statistics">
                <Button size="lg" variant="outline" className="border-[#1E90FF] text-[#1E90FF] hover:bg-blue-50">
                  View Statistics
                </Button>
              </Link>
            </div>
          </section>

          <section className="">
            <div className="max-w-6xl mx-auto">
              <VotingCountdown
                electionEndDate={electionInfo.endDate}
                electionName={electionInfo.title}
                electionStatus={electionStatus}
              />
            </div>
          </section>
        </div>
        

        <section id="statistics" className="mb-16 pt-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-gray-900">Election Statistics</h3>
          <PublicStats />
        </section>

        <section id="college-participation" className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">College Participation</h3>
            <p className="text-gray-600 text-lg">Track voting progress across all colleges</p>
          </div>
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {stats.collegeStats.map((collegeStat) => {
              const college = colleges.find((c) => c.CollegeOfficeCode === collegeStat.name)
              const turnoutPercentage = collegeStat.totalStudents > 0
                ? (collegeStat.votersCount / collegeStat.totalStudents) * 100
                : 0

              return (
                <Card
                  key={collegeStat.name}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 bg-white overflow-hidden"
                >
                  <div
                    className="h-3 bg-gradient-to-r"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${college?.CollegeOfficeColor || "#888"}, ${college?.CollegeOfficeColor || "#888"}dd)`,
                    }}
                  ></div>

                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div
                          className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: `${college?.CollegeOfficeColor || "#888"}15` }}
                        >
                          <Image
                            src={college?.CollegeOfficeLogo || "/parties/no-logo.png"}
                            alt={`${college?.CollegeOffice} logo`}
                            className="w-10 h-10 object-contain"
                            width={40}
                            height={40}
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle
                          className="text-lg font-bold leading-tight mb-1"
                          style={{ color: college?.CollegeOfficeColor || "#888" }}
                        >
                          {college?.CollegeOfficeCode}
                        </CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="secondary"
                            className="text-xs font-medium"
                            style={{
                              backgroundColor: `${college?.CollegeOfficeColor || "#888"}20`,
                              color: college?.CollegeOfficeColor || "#888",
                            }}
                          >
                            {college?.CollegeOffice || collegeStat.name}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="w-4 h-4 text-gray-600 mr-1" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{collegeStat.totalStudents}</div>
                        <div className="text-xs text-gray-600">Total Students</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <Vote className="w-4 h-4 text-green-600 mr-1" />
                        </div>
                        <div className="text-2xl font-bold text-green-700">{collegeStat.votersCount}</div>
                        <div className="text-xs text-gray-600">Voted</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Voter Turnout</span>
                        </div>
                        <Badge
                          variant={
                            turnoutPercentage >= 70 ? "default" : turnoutPercentage >= 50 ? "secondary" : "outline"
                          }
                          className="font-bold"
                        >
                          {turnoutPercentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <Progress
                          value={turnoutPercentage}
                          className="h-3 bg-gray-200"
                          style={{
                            "--progress-foreground": college?.CollegeOfficeColor || "#888",
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Vote className="w-4 h-4 text-blue-600" />
                </div>
                Supreme Student Council
              </CardTitle>
              <CardDescription>Vote for your SSC representatives</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                All students can vote for the SSC positions including President, Vice President, and Senators.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button className="w-full bg-[#1E90FF] hover:bg-blue-600">Login to Vote</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                College Officers
              </CardTitle>
              <CardDescription>Vote for your college representatives</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Vote for your college-specific officers including Governor, Vice Governor, Mayor, Vice Mayor, and Board
                Members.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">Login to Vote</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                Election Results
              </CardTitle>
              <CardDescription>View the current election results</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Results will be available after the voting period has ended. Check back later to see who won!
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                  Login to View
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
