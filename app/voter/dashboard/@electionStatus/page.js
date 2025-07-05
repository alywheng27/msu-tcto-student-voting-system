import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"
import { getVoters, getCookies } from "@/lib/voters"
import { getElectionInfo } from "@/lib/system-settings"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'

export default async function ElectionStatus() {
    const cookie = await getCookies()
    const voters = await getVoters()
    const voter = voters.find((v) => v.UserID === cookie.userID)
    const electionInfo = getElectionInfo()

    // Calculate time remaining
    const now = dayjs().utc()
    const endDate = dayjs(electionInfo.endDate).utc()
    const timeRemaining = endDate.diff(now, 'day') > 0 
        ? `${endDate.diff(now, 'day')} days, ${endDate.diff(now, 'hour') % 24} hours`
        : endDate.diff(now, 'hour') > 0
        ? `${endDate.diff(now, 'hour')} hours, ${endDate.diff(now, 'minute') % 60} minutes`
        : `${endDate.diff(now, 'minute')} minutes`

    // Calculate completed votes
    const completedVotes = voter?.HasVotedSSC && voter?.HasVotedCollege ? 2 : 
                          voter?.HasVotedSSC || voter?.HasVotedCollege ? 1 : 0

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
                    {dayjs(electionInfo.startDate).format('MMM D, h:mm A')} - {dayjs(electionInfo.endDate).format('MMM D, h:mm A')}
                </p>
                </div>
                <div>
                <p className="text-sm text-gray-500">Time Remaining</p>
                <p className="font-medium text-orange-600">{timeRemaining}</p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                <span>Voting Progress</span>
                <span>{completedVotes}/2 Elections Completed</span>
                </div>
                <Progress value={(completedVotes / 2) * 100} className="h-2" />
            </div>
            </CardContent>
        </Card>
    )
}
