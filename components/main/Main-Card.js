import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import PropTypes from 'prop-types'

export default function MainCard({ totalStudents = 0, totalVoters = 0 }) {
  MainCard.propTypes = {
    totalStudents: PropTypes.number.isRequired,
    totalVoters:   PropTypes.number.isRequired
  }  

  const totalStudentsPercent = totalVoters / totalStudents * 100
  
  return (
    <>
    <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#61063B]">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#61063B]">{totalStudents}</div>
            <p className="text-xs text-[#61063B]">Enrolled students across all colleges</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#61063B]">Total Voters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#61063B]">{totalVoters}</div>
            <p className="text-xs text-[#61063B]">
              {totalStudentsPercent.toFixed(1)}% of total students
            </p>
            <Progress  value={totalStudentsPercent} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#61063B]">Non-Voters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#61063B]">{totalStudents - totalVoters}</div>
            <p className="text-xs text-[#61063B]">
              {(((totalStudents - totalVoters) / totalStudents) * 100).toFixed(1)}% of total students
            </p>
            <Progress
              value={((totalStudents - totalVoters) / totalStudents) * 100}
              className="h-2 mt-2 text-[#61063B]"
            />
          </CardContent>
    </Card>
    </>
  )
}
