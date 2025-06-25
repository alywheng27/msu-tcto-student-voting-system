import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Vote } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { colleges } from "@/lib/data2"

export default function Voting() {
    // Create a mock user for demonstration
    const user = {
        name: "John Doe",
        college: "cas",
        studentId: "2021-12345",
        hasVoted: {
        ssc: false,
        college: false,
        },
    }

    const college = colleges.find((c) => c.id === user?.college)

    const electionInfo = {
        startDate: "March 15, 2024",
        endDate: "March 17, 2024",
        timeRemaining: "2 days, 14 hours",
        totalPositions: 8,
        completedVotes: user.hasVoted.ssc && user.hasVoted.college ? 2 : user.hasVoted.ssc || user.hasVoted.college ? 1 : 0,
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* SSC Voting */}
            <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Vote className="h-5 w-5" />
                    SSC Voting
                </CardTitle>
                {user.hasVoted.ssc ? (
                    <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Pending
                    </Badge>
                )}
                </div>
                <CardDescription>Vote for Student Supreme Council positions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                <p>• SSC President</p>
                <p>• SSC Vice President</p>
                <p>• SSC Secretary</p>
                <p>• SSC Treasurer</p>
                </div>

                {user.hasVoted.ssc ? (
                <Button disabled className="w-full">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Vote Submitted
                </Button>
                ) : (
                <Button asChild className="w-full bg-[#1E90FF] hover:bg-[#1E90FF]/90">
                    <Link href="/voter/vote/ssc">
                    <Vote className="h-4 w-4 mr-2" />
                    Start SSC Voting
                    </Link>
                </Button>
                )}
            </CardContent>
            </Card>

            {/* College Voting */}
            <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Vote className="h-5 w-5" />
                    College Voting
                </CardTitle>
                {user.hasVoted.college ? (
                    <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Pending
                    </Badge>
                )}
                </div>
                <CardDescription>Vote for {college?.name} positions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                <p>• College President</p>
                <p>• College Vice President</p>
                <p>• College Secretary</p>
                <p>• College Treasurer</p>
                </div>

                {user.hasVoted.college ? (
                <Button disabled className="w-full">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Vote Submitted
                </Button>
                ) : (
                <Button asChild className="w-full" style={{ backgroundColor: college?.color }}>
                    <Link href="/voter/vote/college">
                    <Vote className="h-4 w-4 mr-2" />
                    Start College Voting
                    </Link>
                </Button>
                )}
            </CardContent>
            </Card>
        </div>
    )
}
