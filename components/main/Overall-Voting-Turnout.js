"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"

import PropTypes from 'prop-types'

export default function OverallVotingTurnout({ pieConfig, pieData }) {
    if (!pieData || !Array.isArray(pieData) || pieData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-[#61063B]">Overall Voter Turnout</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[430px]">
                        <p className="text-muted-foreground">No data available</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    OverallVotingTurnout.propTypes = {
        pieConfig: PropTypes.object.isRequired,
        pieData: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                value: PropTypes.number.isRequired,
            })
        ).isRequired,
    }    
    
    const COLORS = ["#61063B", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

    return (
        <>
            <Card>
                <CardHeader>
                <CardTitle className="text-[#61063B]">Overall Voter Turnout</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="max-h-[430px] w-full">
                    <ChartContainer config={pieConfig} className="mx-auto max-h-[430px]" >
                        <ResponsiveContainer>
                            <PieChart>
                                <ChartTooltip
                                    content={<ChartTooltipContent nameKey="name" hideLabel />}
                                />
                                <Pie
                                    data={pieData}
                                    nameKey="name"
                                    dataKey="value"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
                </CardContent>
            </Card>
        </>
    )
}
