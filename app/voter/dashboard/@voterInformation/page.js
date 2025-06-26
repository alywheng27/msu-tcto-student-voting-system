import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { getColleges, getCookies } from "@/lib/voters"

export default async function VoterInformation() {
    const colleges = await getColleges()
    const cookieValue = await getCookies()

    const collegeFound = colleges.find((college) => college.CollegeOfficeID === cookieValue.collegeOfficeID)
    const voter = {
        firstName: cookieValue.firstName,
        surname: cookieValue.surname,
        username: cookieValue.username,
        college: collegeFound.CollegeOffice,
        collegeCode: collegeFound.CollegeOfficeCode
    }

    return (
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Voter Information
            </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
                <p className="text-sm text-gray-500">Student Name</p>
                <p className="font-medium">{voter.firstName} {voter.surname}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Student ID</p>
                <p className="font-medium">{voter.username}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">College</p>
                <p className="font-medium">{voter.college} ({voter.collegeCode})</p>
            </div>
            </CardContent>
        </Card>
    )
}
