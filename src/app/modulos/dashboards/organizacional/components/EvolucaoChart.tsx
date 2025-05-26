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
  kpiName: string; // To display in tooltip or legend if needed
}

const EvolucaoChart: React.FC<EvolucaoChartProps> = ({ data, kpiName }) => {
  // Custom Tooltip
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
          left: 35, // Changed from -20 to 0 to make the first label visible
          bottom: 40, // Increased bottom margin for X-axis labels and custom text
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
          angle={-35} // Angle labels to prevent overlap
          textAnchor="end"
          interval={0} // Show all ticks
          dy={15} // Adjust vertical position of ticks
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
          name={kpiName} // Used by tooltip
          stroke="#6366f1" // Indigo color for the line
          strokeWidth={2}
          dot={{
            stroke: "#6366f1", // Indigo border for dots
            strokeWidth: 2,
            fill: "#fff", // White fill for dots
            r: 4,
          }}
          activeDot={{
            stroke: "#4f46e5", // Darker indigo for active dot
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
