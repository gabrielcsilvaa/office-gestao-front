"use client";

import React from "react";
import { Pie, PieChart, Cell, Tooltip, LabelList } from "recharts";
import Image from "next/image";

interface PieChartComponentProps {
  data: PieChartData[];  // Substituindo any[] por PieChartData[]
  onClick: () => void;
}

interface PieChartData {
  name: string;
  value: number;
}

const PieChartComponent = ({ data, onClick }: PieChartComponentProps) => {
  const generateColors = (n: number) => {
    const vibrantPalette = [
      "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
      "#FF9F40", "#00A5A8", "#F7464A", "#46BFBD", "#FDB45C"
    ];
    return Array.from({ length: n }, (_, i) => vibrantPalette[i % vibrantPalette.length]);
  };

  const colors = generateColors(data.length);

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md w-full h-full">
      <div className="flex flex-row justify-between p-0 pr-1">
        <h2 className="text-lg font-semibold ml-4 mt-4 mb-4">Empresas por Regime Tributário</h2>
        <div onClick={onClick} className="cursor-pointer ml-1.5 p-1">
          <Image src="/assets/icons/Vector 1275.svg" width={12} height={13.33} alt="seta" />
        </div>
      </div>

      <div className="flex flex-row items-center justify-center">
        <div className="w-[280px] h-[280px] relative cursor-pointer" onClick={onClick}>
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
              <LabelList position="inside" style={{ fontSize: "13px" }} />
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
