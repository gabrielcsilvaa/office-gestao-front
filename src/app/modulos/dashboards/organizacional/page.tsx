"use client"; 
import { Cairo } from "next/font/google";
import SelecaoIndicadores from "./components/SelecaoIndicadores";
import SecaoFiltros from "./components/SecaoFiltros";
// import Card from "./components/Card"; // Moved to KpiCardsGrid
import { useState, useMemo } from "react";
// import Image from "next/image"; // No longer directly used here
// import React from "react"; // No longer directly used here (implicitly used by JSX)
import EvolucaoCard from "./components/EvolucaoCard";
import ValorPorGrupoCard from "./components/ValorPorGrupoCard";
import DissidioCard from "./components/DissidioCard";
import ValorPorPessoaCard from "./components/ValorPorPessoaCard";
import ValorPorCalculoCard from "./components/ValorPorCalculoCard";
import KpiCardsGrid from "./components/KpiCardsGrid"; // Import the new component

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

// Helper function to parse currency string to number
const parseCurrency = (currencyString: string): number => {
  if (!currencyString) return 0;
  return parseFloat(
    currencyString
      .replace("R$", "")
      .replace(/\./g, "") // Remove thousand separators
      .replace(",", ".") // Replace decimal comma with dot
      .trim()
  );
};

// Raw data as provided
const rawChartDataEntries = [
  "Jan/2024: R$ 5.462.280,00",
  "Fev/2024: R$ 5.463.540,00",
  "Mar/2024: R$ 5.599.900,00",
  "Abr/2024: R$ 5.600.930,00",
  "Mai/2024: R$ 5.811.220,00",
  "Jun/2024: R$ 6.204.950,00",
  "Jul/2024: R$ 6.443.690,00",
  "Ago/2024: R$ 6.564.000,00",
  "Set/2024: R$ 6.728.160,00",
  "Out/2024: R$ 6.551.310,00",
  "Nov/2024: R$ 8.289.970,00",
  "Dez/2024: R$ 33.388.510,00", // Note: This value is significantly higher
];

// Data for ValorPorGrupoChart
const valorPorGrupoData = [
  { name: "Simples Doméstico", value: 25400 },
  { name: "Simples Doméstico 13º", value: 2000 },
  { name: "Outros Proventos", value: 300 },
  { name: "Fechamento", value: 300 }, // Assuming this is the second R$ 300,00 from Figma
  { name: "IRRF", value: -900 },
  { name: "Descontos", value: -21200 },
  { name: "Dependente IR 13º", value: -60700 },
  { name: "Dependente IR Férias", value: -77500 },
  { name: "Dependente IR Mensal", value: -533900 },
];


export default function DashboardOrganizacional() {
  const [kpiSelecionado, setKpiSelecionado] = useState<string>("Proventos"); 

  const handleKpiChange = (kpi: string) => {
    setKpiSelecionado(kpi);
  };

  const cardsData = [
    { title: "Proventos", value: "R$ 5.811.200,00", tooltipText: "Total de proventos recebidos no período." },
    { title: "Descontos", value: "-R$ 1.470.700,00", tooltipText: "Total de descontos aplicados no período." },
    { title: "Líquido", value: "R$ 4.340.600,00", tooltipText: "Valor líquido após proventos e descontos." },
    { title: "Custo Total Estimado", value: "R$ 6.452.500,00", tooltipText: "Estimativa do custo total da folha." },
    { title: "Custo Médio Mensal", value: "R$ 2.300,00", tooltipText: "Custo médio mensal por colaborador." },
    { title: "Receita Média Mensal", value: "R$ 14.000,00", tooltipText: "Receita média mensal gerada." },
  ];

  const sectionIcons = [
    { src: "/assets/icons/icon-lay-down.svg", alt: "Lay Down", adjustSize: true }, 
    { src: "/assets/icons/icon-lay-up.svg", alt: "Lay Up", adjustSize: true },     
    { src: "/assets/icons/icon-hierarchy.svg", alt: "Hierarchy" },
    { src: "/assets/icons/icon-filter-layers.svg", alt: "Filter Layers" },
    { src: "/assets/icons/icon-maximize.svg", alt: "Maximize" },
    { src: "/assets/icons/icon-more-options.svg", alt: "More Options" },
  ];

  // Process chart data (memoized for performance)
  const processedEvolucaoChartData = useMemo(() => {
    return rawChartDataEntries.map(entry => {
      const [month, valueString] = entry.split(": ");
      return { month, value: parseCurrency(valueString) };
    });
  }, []); 

  return (
    <div className="bg-[#f7f7f8] h-[75vh]">
      <div className=" flex flex-col items-start p-4 gap-4 border-b border-black/10 bg-gray-100">
        <SelecaoIndicadores 
          indicadorSelecionado={kpiSelecionado}
          onSelecaoIndicador={handleKpiChange}
        />
        <SecaoFiltros />
      </div>
      <div className="p-4 overflow-y-auto h-full">
        <KpiCardsGrid cardsData={cardsData} />

        <div className="mt-4 flex flex-row gap-4">
          <EvolucaoCard
            kpiSelecionado={kpiSelecionado}
            processedEvolucaoChartData={processedEvolucaoChartData}
            sectionIcons={sectionIcons}
            cairoClassName={cairo.className}
          />
          <ValorPorGrupoCard
            valorPorGrupoData={valorPorGrupoData}
            sectionIcons={sectionIcons}
            cairoClassName={cairo.className}
          />
        </div>

        <div className="mt-4 flex flex-row gap-4">
          <DissidioCard
            sectionIcons={sectionIcons}
            cairoClassName={cairo.className}
          />
          <ValorPorPessoaCard
            sectionIcons={sectionIcons}
            cairoClassName={cairo.className}
          />
          <ValorPorCalculoCard
            sectionIcons={sectionIcons}
            cairoClassName={cairo.className}
          />
        </div>
      </div>
    </div>
  );
}                 