"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

interface ChartDataPoint {
  month: string;
  value: number;
}

interface EvolucaoChartProps {
  data: ChartDataPoint[];
  kpiName: string;
}

const EvolucaoChart: React.FC<EvolucaoChartProps> = ({ data, kpiName: originalKpiName }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
          <p className="label text-sm text-gray-700">{`${label}`}</p>
          <p className="intro text-sm text-blue-600">{`${
            payload[0].name
          } : ${new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  // gera 6 ticks uniformemente distribuídos entre valor mínimo e máximo
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const TICK_COUNT = 5;
  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => min + ((max - min) * i) / (TICK_COUNT - 1));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 40, // Increased from 20 to 30
          left: 0,
          bottom: 40,
        }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#818cf8" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e0e0e0"
          vertical={false}
          horizontal={true}
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10, fill: "transparent" }}
          angle={-35}
          textAnchor="end"
          interval={0}
          dy={15}
        />
        <YAxis
          domain={[min, max]}
          axisLine={false}
          tickLine={false}
          ticks={ticks} // usa ticks uniformes
          tick={{ fontSize: 10, fill: "transparent" }} // oculta valor
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          name="Evolução de Custo Total"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{
            stroke: "#6366f1",
            strokeWidth: 2,
            fill: "#fff",
            r: 4,
          }}
          activeDot={{
            stroke: "#4f46e5",
            strokeWidth: 2,
            fill: "#fff",
            r: 6,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EvolucaoChart;
