"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

interface BarChartDataPoint {
  name: string;
  value: number;
}

interface ValorPorGrupoChartProps {
  data: BarChartDataPoint[];
}

// Helper to format currency for labels and tooltips
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
        <p className="label text-sm text-gray-700">{`${label}`}</p>
        <p
          className={`intro text-sm ${
            payload[0].value >= 0 ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {`Valor: ${formatCurrency(payload[0].value)}`}
        </p>
      </div>
    );
  }
  return null;
};

const ValorPorGrupoChart: React.FC<ValorPorGrupoChartProps> = ({ data }) => {
  const yAxisTicks = [-600000, -500000, -400000, -300000, -200000, -100000, 0, 100000];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 30, // Increased top margin for labels on bars
          right: 0,
          left: 10,
          bottom: 70, // Increased bottom margin for angled X-axis labels
        }}
        barGap={5} // Space between bars of different categories
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10, fill: "#737373" }}
          angle={-45} // Angle labels
          textAnchor="end"
          interval={0} // Show all category labels
          dy={5} // Adjust vertical position
          height={60} // Allocate space for angled labels
        />
        <YAxis
          tickLine={false}
          axisLine={{ stroke: "#a3a3a3" }} // Fainter axis line
          tickFormatter={(tick) => tick.toLocaleString("pt-BR")}
          tick={{ fontSize: 10, fill: "#737373" }}
          domain={[-600000, 100000]} // Based on Figma Y-axis labels
          ticks={yAxisTicks}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
        <Bar dataKey="value">
          <LabelList
            dataKey="value"
            position="top" // Use "top" or "bottom" statically; dynamic positioning is not supported directly
            offset={8}
            formatter={(value: number) => formatCurrency(value)}
            fontSize="8px" // Changed from 10px to 8px
            fontWeight="bold"
            fill="#374151" // text-gray-700
          />
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.value >= 0 ? "#10b981" : "#ef4444"} // emerald-500 for positive, red-600 for negative
              opacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ValorPorGrupoChart;
