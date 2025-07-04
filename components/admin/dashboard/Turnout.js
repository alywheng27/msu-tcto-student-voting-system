"use client"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, PieChart, Pie, Legend } from "recharts"

export default function Turnout({ pieData, pieConfig }) {
    return (
        <ChartContainer config={pieConfig} className="mx-auto max-h-[430px]" >
            <ResponsiveContainer >
                <PieChart>
                    <ChartTooltip
                        content={<ChartTooltipContent nameKey="name" hideLabel />}
                    />
                    <Pie
                        data={pieData}
                        nameKey="name"
                        dataKey="value"
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}
