"use client";

import React from "react";
import { Pie, PieChart, Cell, Tooltip, LabelList } from "recharts";
import Image from "next/image";

interface PieChartComponentProps {
  data: Regime[];
  onClick: () => void;
}

interface Regime {
  name: string;
  value: number;
}

const PieChartComponent = ({ data, onClick }: PieChartComponentProps) => {
  const regimeColors: { [key: string]: string } = {
    "Lucro Real": "#FF6384", // Rosa
    "Lucro Presumido": "#36A2EB", // Azul
    "Simples Nacional": "#FFCE56", // Amarelo
    "N/D": "#E5E7EB", // Cinza claro
    "Regime Especial de Tributação": "#F7464A", // Vermelho
    "Isenta de IRPJ": "#98FB98", // Verde claro
    Doméstica: "#006400", // Verde escuro
    "Micro Empresa": "#FFA500", // Laranja
    MEI: "#40E0D0", // Turquesa
    "Imune do IRPJ": "#FFEB3B", // Amarelo claro
  };

  // Ordena os dados do maior para o menor valor
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  const colors = sortedData.map(
    (entry) => regimeColors[entry.name] || "#808080"
  );

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md w-full h-full">
      <div className="flex flex-row justify-between p-0 pr-1">
        <h2 className="text-lg font-semibold ml-4 mt-4 mb-4">
          Empresas por Regime Tributário
        </h2>
        <div onClick={onClick} className="cursor-pointer ml-1.5 p-1.5">
          <Image
            src="/assets/icons/Vector 1275.svg"
            width={12}
            height={13.33}
            alt="seta"
          />
        </div>
      </div>

      <div className="flex flex-row items-center justify-center">
        <div
          className="w-[280px] h-[280px] relative cursor-pointer"
          onClick={onClick}
        >
          <PieChart width={280} height={280}>
            <Tooltip />
            <Pie
              data={sortedData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              stroke="#ffffff"
              labelLine={false}
            >
              {sortedData.map((entry, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
              <LabelList position="inside" style={{ fontSize: "13px" }} />
            </Pie>
          </PieChart>
        </div>

        <div className="flex flex-col gap-2 ml-8">
          {sortedData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index] }}
              ></span>
              <span className="text-sm text-gray-700">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent;
