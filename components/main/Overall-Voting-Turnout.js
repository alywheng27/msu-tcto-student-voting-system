"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"

export default function OverallVotingTurnout({ pieConfig, pieData }) {
    const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

    return (
        <>
            <Card>
                <CardHeader>
                <CardTitle>Overall Voter Turnout</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="h-[430px] w-full">
                    <ChartContainer config={pieConfig} className="mx-auto max-h-[430px]" >
                        <ResponsiveContainer>
                            <PieChart>
                                <ChartTooltip
                                    content={<ChartTooltipContent nameKey="name" hideLabel />}
                                />
                                {/* <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={150}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie> */}
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
