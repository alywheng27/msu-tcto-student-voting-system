import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Vote, Users, Clock, Calendar } from "lucide-react"

export default function ImportantReminders() {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Important Reminders
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
                <p className="font-medium text-blue-900">Voting Deadline</p>
                <p className="text-sm text-blue-700">
                Make sure to complete your voting before March 17, 2024 at 11:59 PM
                </p>
            </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
                <p className="font-medium text-amber-900">One Vote Per Position</p>
                <p className="text-sm text-amber-700">You can only vote once for each position. Choose carefully!</p>
            </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
                <p className="font-medium text-green-900">Secure Voting</p>
                <p className="text-sm text-green-700">
                Your vote is anonymous and secure. No one can see who you voted for.
                </p>
            </div>
            </div>
        </CardContent>
    </Card>
  )
}
