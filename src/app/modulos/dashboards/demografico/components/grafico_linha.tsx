"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dadosMock = [
  { mes: "Jan/24", valor: 400 },
  { mes: "Fev/24", valor: 300 },
  { mes: "Mar/24", valor: 500 },
  { mes: "Abr/24", valor: 200 },
  { mes: "Mai/24", valor: 450 },
  { mes: "Jun/24", valor: 350 },
  { mes: "Jul/24", valor: 480 },
  { mes: "Ago/24", valor: 320 },
  { mes: "Set/24", valor: 410 },
  { mes: "Out/24", valor: 390 },
  { mes: "Nov/24", valor: 470 },
  { mes: "Dez/24", valor: 430 },
];

export default function GraficoLinha() {
  return (
    <div className="bg-white p-1 rounded shadow h-[545px]  flex flex-col">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dadosMock}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#00ADEF"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
