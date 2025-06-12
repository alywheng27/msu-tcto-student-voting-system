import React, { useContext } from 'react'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select'

import { LoginContext } from '@/app/login/page'

export default function College() {
    const { collegeLoading, handleCollegeSelect, collegeOptions, handleBack} = useContext(LoginContext)

    return (
        <div className="space-y-4">
            <Label htmlFor="college">Select Your College</Label>
            {collegeLoading ? (
                <div>Fetching data...</div>
            ) : (
                <Select onValueChange={handleCollegeSelect}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose your college" />
                </SelectTrigger>
                <SelectContent>
                    {collegeOptions.map((collegeOption) => (
                    <SelectItem key={collegeOption.CollegeOfficeID} value={collegeOption.CollegeOffice}>
                        {collegeOption.CollegeOffice}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            )}
            <Button variant="outline" onClick={handleBack} className="w-full">
                Back
            </Button>
        </div>
    )
}
