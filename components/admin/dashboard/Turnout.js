"use client"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { ResponsiveContainer, PieChart, Pie } from "recharts"

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
                    <ChartLegend />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}
