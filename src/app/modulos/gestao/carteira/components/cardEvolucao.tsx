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

// Mapeia abreviações dos meses para índices (0 a 11)
const mesesMap: Record<string, number> = {
  jan: 0,
  fev: 1,
  mar: 2,
  abr: 3,
  mai: 4,
  jun: 5,
  jul: 6,
  ago: 7,
  set: 8,
  out: 9,
  nov: 10,
  dez: 11,
};

function nomeParaTimestamp(nome: string): number {
  if (!nome) return NaN;

  // Remove o ponto, deixa em minúsculo e remove espaços extras
  const nomeTratado = nome.toLowerCase().replace(".", "").trim();

  // Divide pelo " de " para separar mês e ano
  const partes = nomeTratado.split(" de ");
  if (partes.length !== 2) return NaN;

  const mesStr = partes[0].trim();
  const anoStr = partes[1].trim();

  const mes = mesesMap[mesStr];
  const ano = parseInt(anoStr, 10);
  
  if (mes === undefined || isNaN(ano)) return NaN;

  // Cria timestamp do primeiro dia do mês e ano
  return new Date(ano, mes, 1).getTime();
}

function ordenarData(data: Array<{ name: string; value: number }>) {
  return data.slice().sort((a, b) => {
    const timeA = nomeParaTimestamp(a.name);
    const timeB = nomeParaTimestamp(b.name);

    if (isNaN(timeA) && isNaN(timeB)) return 0;
    if (isNaN(timeA)) return 1; // coloca inválidos no final
    if (isNaN(timeB)) return -1;

    return timeA - timeB;
  });
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
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
        <p style={{ margin: 0 }}>Evolução: {value}</p>
      </div>
    );
  }
  return null;
};

export default function Evolucao({ data }: EvolucaoProps) {
  const dataOrdenada = ordenarData(data);

  return (
    <div className="text-card-foreground flex flex-col w-full h-[349px] p-2 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Evolução</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={dataOrdenada}
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
