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

interface EvolucaoProps {
  data: Array<{ name: string; value: number }>;
}

export default function Evolucao({ data }: EvolucaoProps) {
  return (
    <div className="text-card-foreground flex flex-col w-full h-[300px] p-2 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Evolução</h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
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
