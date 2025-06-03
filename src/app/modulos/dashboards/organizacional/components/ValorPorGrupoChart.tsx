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
          top: 30, 
          right: 0,
          left: 10,
          bottom: 70, 
        }}
        barGap={5} 
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10, fill: "#737373" }}
          angle={-45} 
          textAnchor="end"
          interval={0} 
          dy={5} 
          height={60} 
        />
        <YAxis
          tickLine={false}
          axisLine={{ stroke: "#a3a3a3" }} 
          tickFormatter={(tick) => tick.toLocaleString("pt-BR")}
          tick={{ fontSize: 10, fill: "#737373" }}
          domain={[-600000, 100000]} 
          ticks={yAxisTicks}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
        <Bar dataKey="value">
          <LabelList
            dataKey="value"
            position="top" 
            offset={8}
            formatter={(value: number) => formatCurrency(value)}
            fontSize="8px" 
            fontWeight="bold"
            fill="#374151" 
          />
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.value >= 0 ? "#10b981" : "#ef4444"} 
              opacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ValorPorGrupoChart;
