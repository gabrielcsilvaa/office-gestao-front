"use client";

import React from "react";
import { Pie, PieChart, Cell, Tooltip, LabelList } from "recharts";

interface PieChartComponentProps {
  data: Regime[];
  onClick: () => void;
}

interface Regime {
  nome_empresa: string;
  name: string;
  value: number;
  data_inatividade: string | null;
}

const PieChartComponent = ({ data, onClick }: PieChartComponentProps) => {
  const regimeColors: Record<string, string> = {
    "Lucro Real": "#FF6384",
    "Lucro Presumido": "#36A2EB",
    "Simples Nacional": "#FFCE56",
    "N/D": "#E5E7EB",
    "Regime Especial de Tributação": "#F7464A",
    "Isenta de IRPJ": "#98FB98",
    "Doméstica": "#006400",
    "Micro Empresa": "#FFA500",
    "MEI": "#40E0D0",
    "Imune do IRPJ": "#FFEB3B",
  };

  const empresasExcluidas = [
    "EMPRESA EXEMPLO REAL LTDA",
    "EMPRESA EXEMPLO PRESUMIDO LTDA",
    "EMPRESA EXEMPLO SIMPLES NACIONAL LTDA",
    "EMPRESA DESONERAÇÃO DA EMPRESA DESONERAÇÃO DA",
    "EMPRESA DESONERAÇÃO DA FOLHA",
    "EMPRESA DOMÉSTICO",
    "EMPRESA MODELO - EVENTOS E-SOCIAL",
    "EMPRESA MODELO CONTÁBIL SPED",
    "EMPRESA MODELO PLANO DE CONTAS CONTABIL",
    "SILVEIRA FONTENELE - EMPRESA MODELO",
    "EMPRESA SIMPLES - COMERCIO",
    "EMPRESA SIMPLES - COMERCIO E SERVIÇO",
    "EMPRESA SIMPLES - COMERCIO E IND",
    "EMPRESA SIMPLES - COMERCIO, SERV E IND",
    "EMPRESA SIMPLES - INDUSTRIA",
    "EMPRESA SIMPLES - MEI",
    "EMPRESA SIMPLES - SERVIÇO",
    "LUCRO PRESUMIDO - COM, SERV E IND",
    "LUCRO PRESUMIDO - COMERCIO",
    "LUCRO PRESUMIDO - COMERCIO E INDUSTRIA",
    "LUCRO PRESUMIDO - COMERCIO E SERVIÇO",
    "LUCRO PRESUMIDO - INDUSTRIA",
    "LUCRO PRESUMIDO - POSTO DE COMBUSTIVEL",
    "LUCRO PRESUMIDO - SERVIÇO",
    "LUCRO PRESUMIDO - TRANSPORTADORA",
    "LUCRO REAL - COM, SERV E IND",
    "LUCRO REAL - INDUSTRIA",
    "LUCRO REAL - SERVIÇO",
    "LUCRO REAL - TRANSPORTADORA",
    "LUCRO REAL- COMERCIO",
    "MODELO LUCRO PRESUMIDO - COM SERV",
    "MODELO LUCRO PRESUMIDO - SERVIÇO",
    "MODELO SIMPLES NACIONAL - COM SERV",
    "MODELO SIMPLES NACIONAL - COM SERV IND",
    "MODELO SIMPLES NACIONAL - COMERCIO",
    "MODELO SIMPLES NACIONAL - SERVIÇO",
    "REAL - COMERCIO E INDUSTRIA",
    "REAL - POSTO DE COMBUSTIVEL",
    "REAL - COMERCIO E SERVIÇO",
    "MATRIZ PRESUMIDO - COM, SERV E IND",
    "FILIAL PRESUMIDO - COM, SERV E IND",
    "FOLHA PROFESSOR",
    "ATIVIDADE IMOB RET PMCMV",
    "SIMPLES TRANSPORTADORA",
  ];

  const filteredData = data.filter(
    ({ nome_empresa }) => !empresasExcluidas.includes(nome_empresa)
  );

  const sortedData = [...filteredData].sort((a, b) => b.value - a.value);

  const colors = sortedData.map(
    ({ name }) => regimeColors[name] || "#808080"
  );

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md w-full h-full p-4 overflow-hidden">
      <div className="flex justify-between items-start mb-7">
        <h2 className="text-lg font-semibold">Empresas por Regime Tributário</h2>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
        {/* Gráfico */}
        <div className="w-[240px] h-[240px] cursor-pointer" onClick={onClick}>
          <PieChart width={200} height={200}>
            <Tooltip />
            <Pie
              data={sortedData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              stroke="#ffffff"
              labelLine={false}
            >
              {sortedData.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
              <LabelList position="inside" style={{ fontSize: "13px" }} />
            </Pie>
          </PieChart>
        </div>

        {/* Legenda */}
        <div className="flex flex-col gap-2 max-w-[250px]">
          {sortedData.map((entry, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[idx] }}
              />
              <span className="text-sm text-gray-700 break-words">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent;
