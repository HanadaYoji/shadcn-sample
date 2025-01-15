"use client";

import { LineChartComponent } from "@/components/chart/LineChart";
import { ChartConfig, ChartData } from "@/types/chart";
import { CustomBreadcrumb } from "@/components/CustomBreadcrumb/CustomBreadcrumb";
import { CustomBreadcrumbItem } from "@/types/CustomBreadcrumb.types";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

const StarttedPage = () => {
  const [showFirstChart, setShowFirstChart] = useState(false);

  useEffect(() => {
    const loadFirstChart = async () => {
      await wait(2000); // 2秒待機
      setShowFirstChart(true); // グラフを表示
    };
    loadFirstChart();
  }, []);

  const breadcrumbItems: CustomBreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Components", href: "/components" },
    { label: "Breadcrumb" },
  ];

  const chartData1: ChartData[] = [
    { month: "1月", desktop: 186, mobile: 120 },
    { month: "2月", desktop: 305, mobile: 200 },
    { month: "3月", desktop: 237, mobile: 180 },
    { month: "4月", desktop: 73, mobile: 50 },
    { month: "5月", desktop: 209, mobile: 130 },
    { month: "6月", desktop: 214, mobile: 140 },
  ];

  const chartData2: ChartData[] = [
    { month: "1月", revenue: 5000 },
    { month: "2月", revenue: 7000 },
    { month: "3月", revenue: 6000 },
    { month: "4月", revenue: 8000 },
    { month: "5月", revenue: 7500 },
    { month: "6月", revenue: 9000 },
  ];

  const chartConfig1: ChartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  };

  const chartConfig2: ChartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <div className="">
      {/* パンくずリスト */}
      <div className="mb-6">
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>
      <div className="space-y-4">
        {/* 最初のグラフ */}
        {showFirstChart ? (
          <LineChartComponent
            title="Device Usage"
            description="Desktop vs Mobile (January - June 2024)"
            data={chartData1}
            config={chartConfig1}
          />
        ) : (
          <SkeletonCard />
        )}

        {/* 2つ目のグラフ */}
        <LineChartComponent
          title="Revenue Growth"
          description="Monthly Revenue (January - June 2024)"
          data={chartData2}
          config={chartConfig2}
        />
      </div>
    </div>
  );
};

export default StarttedPage;
