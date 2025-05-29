"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
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

const EvolucaoChart: React.FC<EvolucaoChartProps> = ({ data, kpiName }) => {
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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: 35, 
          bottom: 40, 
        }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#818cf8" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10, fill: "#737373" }}
          angle={-35} 
          textAnchor="end"
          interval={0} 
          dy={15} 
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          strokeWidth={0}
          fillOpacity={1}
          fill="url(#colorValue)"
        />
        <Line
          type="monotone"
          dataKey="value"
          name={kpiName} 
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
