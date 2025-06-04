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
  fullName?: string; // Add optional property for full name
}

interface ValorPorGrupoChartProps {
  data: ChartDataPoint[];
}

const ValorPorGrupoChart: React.FC<ValorPorGrupoChartProps> = ({ data }) => {
  const ITEM_WIDTH = 60; // Increased from 28 to 40 for thicker bars
  const MAX_LABEL_LENGTH = 17; // Based on "Horas Extras (50%)"
  
  // Function to truncate text
  const truncateText = (text: string, maxLength: number = MAX_LABEL_LENGTH): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
  };

  // Process data to include truncated names
  const processedData = data.map(item => ({
    ...item,
    fullName: item.name, // Store original name
    name: truncateText(item.name) // Use truncated name for display
  }));

  // Custom tick component with native tooltip
  const CustomTick = (props: any) => {
    const { x, y, payload } = props;
    const originalData = processedData.find(item => item.name === payload.value);
    const fullName = originalData?.fullName || payload.value;
    const isTextTruncated = fullName.length > MAX_LABEL_LENGTH;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#737373"
          fontSize="10"
          transform="rotate(-45)"
          style={{ cursor: isTextTruncated ? 'help' : 'default' }}
        >
          {isTextTruncated && <title>{fullName}</title>}
          {payload.value}
        </text>
      </g>
    );
  };

  const chartWidth = Math.max(processedData.length * ITEM_WIDTH, 280);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Find the original data point to get the full name
      const originalData = processedData.find(item => item.name === label);
      const displayLabel = originalData?.fullName || label;
      
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg text-sm">
          <p className="font-semibold text-gray-700">{displayLabel}</p>
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
    <div style={{ width: chartWidth, height: '100%', minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={chartWidth}
          data={processedData}
          margin={{
            top: 15,
            right: 20,
            left: 15,
            bottom: 80,
          }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={{ stroke: "#a3a3a3" }}
            tick={<CustomTick />}
            angle={-45}
            textAnchor="end"
            interval={0}
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
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.value >= 0 ? "#10b981" : "#ef4444"} opacity={0.8} />
            ))}
            <LabelList dataKey="value" content={<CustomizedLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ValorPorGrupoChart;
