import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default async function VoterInformation() {
    const response = await fetch(`${process.env.MSSQL_PUBLIC_APP_URL}/api/admin/voters`)
    const data = await response.json()

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
                <p className="font-medium">{data[0].FirstName} {data[0].Surname}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Student ID</p>
                <p className="font-medium">{data[0].Username}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">College</p>
                <p className="font-medium">{data[0].CollegeOffice} ({data[0].CollegeOfficeCode})</p>
            </div>
            </CardContent>
        </Card>
    )
}
