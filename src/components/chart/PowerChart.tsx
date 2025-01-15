import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// サンプルデータ (時刻を横軸、力率を縦軸)
const data = [
  { time: "00:00", powerFactor: 50 },
  { time: "01:00", powerFactor: 70 },
  { time: "02:00", powerFactor: 90 },
  { time: "03:00", powerFactor: 100 },
  { time: "04:00", powerFactor: 85 },
  { time: "05:00", powerFactor: 60 },
  { time: "06:00", powerFactor: 50 },
];

// 効率が一番良い状態と悪い状態を設定
const optimalEfficiency = 100; // 効率が良い状態
const worstEfficiency = 50; // 効率が悪い状態

const PowerFactorChart = () => {
  return (
    <div className="p-4 w-full">
      <h2 className="text-lg font-bold mb-4">Power Factor Chart</h2>
      <LineChart
        width={800} // グラフの幅
        height={400} // グラフの高さ
        data={data} // データを指定
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        {/* グリッド線 */}
        <CartesianGrid strokeDasharray="3 3" />

        {/* 横軸 (時刻) */}
        <XAxis
          dataKey="time" // データのキーを指定
          label={{
            value: "Time (HH:MM)", // 横軸のラベル
            position: "insideBottom",
            offset: -5,
          }}
        />

        {/* 縦軸 (力率) */}
        <YAxis
          domain={[worstEfficiency, optimalEfficiency]} // 縦軸の範囲を設定
          ticks={[
            worstEfficiency,
            (worstEfficiency + optimalEfficiency) / 2,
            optimalEfficiency,
          ]} // カスタム目盛り
          label={{
            value: "Power Factor", // 縦軸のラベル
            angle: -90,
            position: "insideLeft",
          }}
        />

        {/* ツールチップ */}
        <Tooltip />

        {/* 凡例 */}
        <Legend verticalAlign="top" height={36} />

        {/* 線データ */}
        <Line
          type="monotone"
          dataKey="powerFactor" // データのキーを指定
          stroke="#8884d8" // 線の色
          strokeWidth={2}
          dot={true} // データポイントにドットを表示
        />
      </LineChart>
    </div>
  );
};

export default PowerFactorChart;
