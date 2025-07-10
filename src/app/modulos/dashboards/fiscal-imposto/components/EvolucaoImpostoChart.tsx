"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartDataPoint {
  month: string;
  impostoDevido: number;
  saldoRecuperar: number;
}

interface EvolucaoImpostoChartProps {
  data: ChartDataPoint[];
}

const EvolucaoImpostoChart: React.FC<EvolucaoImpostoChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="text-xs text-gray-600 mb-2">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {`${entry.name}: ${new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(entry.value)}`}
            </p>
          ))}
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
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <XAxis 
          dataKey="month" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#6B7280" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ paddingTop: "20px" }}
          iconType="line"
        />
        <Line 
          type="monotone" 
          dataKey="impostoDevido" 
          stroke="#EF4444" 
          strokeWidth={3}
          name="Imposto Devido"
          dot={{ r: 4, fill: "#EF4444" }}
          activeDot={{ r: 6, fill: "#EF4444" }}
        />
        <Line 
          type="monotone" 
          dataKey="saldoRecuperar" 
          stroke="#10B981" 
          strokeWidth={3}
          name="Saldo Imposto a Recuperar"
          dot={{ r: 4, fill: "#10B981" }}
          activeDot={{ r: 6, fill: "#10B981" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EvolucaoImpostoChart;
