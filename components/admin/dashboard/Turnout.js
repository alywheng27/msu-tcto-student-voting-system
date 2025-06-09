"use client"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { ResponsiveContainer, PieChart, Pie } from "recharts"

export default function Turnout({ pieData, pieConfig }) {
    return (
        <ChartContainer config={pieConfig} className="mx-auto aspect-square max-h-[430px] px-0" >
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
