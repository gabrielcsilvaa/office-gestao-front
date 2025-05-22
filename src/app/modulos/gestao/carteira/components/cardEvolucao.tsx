"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TooltipProps } from "recharts";

interface EvolucaoProps {
  data: Array<{ name: string; value: number }>;
}

interface EvolucaoProps {
  data: Array<{ name: string; value: number }>;
}

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #d1d5db",
          borderRadius: 8,
          padding: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ fontWeight: "bold", margin: 0 }}>{name}</p>
        <p style={{ margin: 0 }}>Evoluçao: {value}</p>
      </div>
    );
  }
  return null;
};

export default function Evolucao({ data }: EvolucaoProps) {
  return (
    <div className="text-card-foreground flex flex-col w-full h-[349px] p-2 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Evolução</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
