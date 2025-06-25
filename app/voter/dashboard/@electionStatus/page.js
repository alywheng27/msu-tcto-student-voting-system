import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

export default function ElectionStatus() {
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

    const electionInfo = {
        startDate: "March 15, 2024",
        endDate: "March 17, 2024",
        timeRemaining: "2 days, 14 hours",
        totalPositions: 8,
        completedVotes: user.hasVoted.ssc && user.hasVoted.college ? 2 : user.hasVoted.ssc || user.hasVoted.college ? 1 : 0,
    }

    return (
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Election Status
            </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                <p className="text-sm text-gray-500">Election Period</p>
                <p className="font-medium">
                    {electionInfo.startDate} - {electionInfo.endDate}
                </p>
                </div>
                <div>
                <p className="text-sm text-gray-500">Time Remaining</p>
                <p className="font-medium text-orange-600">{electionInfo.timeRemaining}</p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                <span>Voting Progress</span>
                <span>{electionInfo.completedVotes}/2 Elections Completed</span>
                </div>
                <Progress value={(electionInfo.completedVotes / 2) * 100} className="h-2" />
            </div>
            </CardContent>
        </Card>
    )
}
