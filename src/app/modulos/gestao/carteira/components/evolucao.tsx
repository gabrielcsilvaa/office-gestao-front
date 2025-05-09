"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,  } from "recharts";

const data = [
  { name: "jun/2024", value: 15 },
  { name: "jul/2024", value: 12 },
  { name: "aug/2024", value: 21 },
  { name: "sep/2024", value: 9 },
  { name: "oct/2024", value: 7 },
  { name: "nov/2024", value: 10 },
  { name: "dec/2024", value: 18 },
  { name: "jan/2025", value: 14 },
  { name: "feb/2025", value: 11 },
  { name: "mar/2025", value: 9 },
  { name: "apr/2025", value: 10 },
];

export default function Evolucao() {
  return (
    <div className="text-card-foreground flex flex-col w-full h-[349px] p-2 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Evolução</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
