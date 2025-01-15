"use client";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartProps } from "@/types/chart";

export function LineChartComponent({
  title,
  description,
  data,
  config,
}: ChartProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 10,
              bottom: 10,
              left: 30,
              right: 30,
            }}
          >
            {/* グリッド（縦軸と横軸） */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={true}
              horizontal={true}
            />

            {/* X軸 */}
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            {/* Y軸（左軸） */}
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40} // 左側の余白
            />

            {/* 参照線 */}
            <ReferenceLine
              y={200} // 参照線を引く値
              stroke="red"
              strokeDasharray="4 4"
              label={{
                value: "Target",
                position: "insideLeft",
                fill: "red",
                fontSize: 12,
              }}
            />

            {/* ツールチップ */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            {/* 線データを描画 */}
            {Object.keys(config).map((key) => (
              <Line
                key={key}
                dataKey={key}
                type="linear"
                stroke={config[key].color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
