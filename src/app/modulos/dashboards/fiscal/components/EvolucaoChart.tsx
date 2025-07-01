"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  LabelList,
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
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="text-xs text-gray-600">{`${label}`}</p>
          <p className="text-sm font-medium text-gray-800">{`${new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  // Função para formatar os valores nos pontos (valor completo com centavos)
  const formatLabel = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Componente customizado para os labels (todos centralizados)
  const CustomLabel = (props: any) => {
    const { x, y, value } = props;
    
    return (
      <text 
        x={x} 
        y={y - 15} 
        textAnchor="middle" 
        className="fill-gray-800 text-xs font-medium"
      >
        {formatLabel(value)}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 40,
          right: 65,
          left: 65, 
          bottom: 20, 
        }}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00C896" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#00C896" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ 
            fontSize: 12, 
            fill: "#374151", 
            fontFamily: "sans-serif"
          }}
          interval={0} 
          dy={10}
        />
        
        <Tooltip content={<CustomTooltip />} />
        
        <Area
          type="monotone"
          dataKey="value"
          stroke="#00C896"
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#areaGradient)"
          dot={{
            stroke: "#00C896", 
            strokeWidth: 0,
            fill: "#00C896", 
            r: 4,
          }}
          activeDot={{
            stroke: "#00C896", 
            strokeWidth: 0,
            fill: "#00C896",
            r: 5,
          }}
        >
          <LabelList content={<CustomLabel />} />
        </Area>
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EvolucaoChart;
