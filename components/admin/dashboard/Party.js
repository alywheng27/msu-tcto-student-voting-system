"use client"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent  } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from "recharts"

export default function Party({ partyData, partyConfig }) {
  return (
    <ChartContainer config={partyConfig} className="mx-auto max-h-[430px]" >
        <ResponsiveContainer>
            <BarChart accessibilityLayer data={partyData} barSize={120}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                dataKey="name"
                // angle={-15}
                // textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
                tickLine={false}
                tickMargin={30}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 50)}
                />
                <YAxis />
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="votes" fill="var(--color-votes)" radius={8} >
                    <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={12}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
  )
}
