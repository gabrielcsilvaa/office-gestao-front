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

interface ChartDataPoint {
  name: string;
  value: number;
}

interface ValorPorGrupoChartProps {
  data: ChartDataPoint[];
}

const ValorPorGrupoChart: React.FC<ValorPorGrupoChartProps> = ({ data }) => {
  const ITEM_WIDTH = 25; // Reduzido ainda mais de 40 para 25
  const chartWidth = Math.max(data.length * ITEM_WIDTH, 280); // Reduzido minimum width

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg text-sm">
          <p className="font-semibold text-gray-700">{label}</p>
          <p className={`value ${payload[0].value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomizedLabel: React.FC<any> = (props) => {
    const { x, y, width, value } = props;
    const formattedValue = formatCurrency(value);
    const labelYPosition = value >= 0 ? y - 5 : y + 15; // Adjust based on positive/negative

    return (
      <text 
        x={x + width / 2} 
        y={labelYPosition} 
        fill="#374151" 
        textAnchor="middle" 
        fontSize="8px"
        fontWeight="bold"
      >
        {formattedValue}
      </text>
    );
  };

  return (
    <div style={{ width: chartWidth, height: '100%', minWidth: 0 }}> {/* Adicionado minWidth: 0 */}
      <BarChart
        width={chartWidth}
        height={300} // Reduzido de 400 para 300 para caber melhor no card menor
        data={data}
        margin={{
          top: 15, // Reduzido de 20 para 15
          right: 20, // Reduzido de 30 para 20
          left: 15, // Reduzido de 20 para 15
          bottom: 80, // Reduzido de 100 para 80
        }}
        barCategoryGap="15%" // Reduzido de 20% para 15%
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={{ stroke: "#a3a3a3" }}
          tick={{ fontSize: 10, fill: "#737373" }}
          angle={-45} // Angle labels
          textAnchor="end"
          interval={0} // Show all ticks
          // height={60} // Explicit height for XAxis if needed
        />
        <YAxis
          axisLine={{ stroke: "#a3a3a3" }}
          tickLine={false}
          tick={{ fontSize: 10, fill: "#737373" }}
          tickFormatter={(value) =>
            new Intl.NumberFormat("pt-BR", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)
          }
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200,200,200,0.1)' }}/>
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.value >= 0 ? "#10b981" : "#ef4444"} opacity={0.8} />
          ))}
          <LabelList dataKey="value" content={<CustomizedLabel />} />
        </Bar>
      </BarChart>
    </div>
  );
};

export default ValorPorGrupoChart;
