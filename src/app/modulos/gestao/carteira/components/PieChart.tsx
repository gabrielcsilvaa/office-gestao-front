"use client";

import React from "react";
import { Pie, PieChart, Cell, Tooltip, LabelList } from "recharts";

const PieChartComponent = () => {
  const data = [
    { name: "Simples Nacional", value: 405 },
    { name: "Lucro Presumido", value: 251 },
    { name: "N/D", value: 45 },
    { name: "Lucro Real", value: 146 },
    { name: "Doméstica", value: 56 },
    { name: "Micro Empresa", value: 0 },
    { name: "Isenta do IRPJ", value: 0 },
    { name: "Regime Especial de Tributação", value: 0 },
    { name: "Imune do IRPJ", value: 0 },
    { name: "MEI", value: 0 },
  ];

  const generateColors = (n: number) => {
    const vibrantPalette = [
      "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
      "#FF9F40", "#00A5A8", "#F7464A", "#46BFBD", "#FDB45C"
    ];
    return Array.from({ length: n }, (_, i) => vibrantPalette[i % vibrantPalette.length]);
  };

  const colors = generateColors(data.length);

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md p-4 w-full h-full">
      <h2 className="text-lg font-semibold mb-4">Empresas por Regime Tributário</h2>
      <div className="flex flex-row items-center justify-center">
        <div className="w-[280px] h-[280px] relative">
          <PieChart width={280} height={280}>
            <Tooltip />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              stroke="#ffffff"
              labelLine={false}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
              <LabelList position="inside"
                style={{ fontSize: "13px"}}/>
            </Pie>
          </PieChart>
        </div>

        <div className="flex flex-col gap-2 ml-8">
          {data.map((entry, index) => (
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
