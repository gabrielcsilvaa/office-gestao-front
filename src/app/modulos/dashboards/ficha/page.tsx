"use client";
import { Cairo } from "next/font/google";
import SecaoFiltros from "./components/SecaoFiltros";
import KpiCardsGrid from "./components/KpiCardsGrid";
import EvolucaoCard from "./components/EvolucaoCard"; // Import EvolucaoCard
import { useMemo, useState } from "react"; // Import useMemo and useState

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cairo",
});

// Helper function to parse currency string to number (if not already available globally)
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

// Data for EvolucaoCard specific to Ficha Pessoal
const rawChartDataEntriesFicha = [
  "Jan/2024: R$ 1.896,58",
  "Fev/2024: R$ 2.200,00", // Varied data
  "Mar/2024: R$ 2.050,75", // Varied data
  "Abr/2024: R$ 2.350,00", // Varied data
  "Mai/2024: R$ 2.100,50", // Varied data
  "Jun/2024: R$ 2.600,00", // Varied data
  "Jul/2024: R$ 2.450,25", // Varied data
  "Ago/2024: R$ 2.850,00", // Varied data
  "Set/2024: R$ 2.700,80", // Varied data
  "Out/2024: R$ 3.000,00", // Varied data
  "Nov/2024: R$ 2.900,90", // Varied data
  "Dez/2024: R$ 3.134,66",
];

// Section icons data (can be shared or specific)
const sectionIconsFicha = [
  { src: "/assets/icons/icon-lay-down.svg", alt: "Lay Down", adjustSize: true },
  { src: "/assets/icons/icon-lay-up.svg", alt: "Lay Up", adjustSize: true },
  { src: "/assets/icons/icon-hierarchy.svg", alt: "Hierarchy" },
  { src: "/assets/icons/icon-filter-layers.svg", alt: "Filter Layers" },
  { src: "/assets/icons/icon-maximize.svg", alt: "Maximize" },
  { src: "/assets/icons/icon-more-options.svg", alt: "More Options" },
];

export default function FichaPessoalPage() {
  const kpiCardData = [
    { title: "Data de Admissão", value: "01/01/2020", tooltipText: "Data de início do colaborador na empresa." },
    { title: "Salário Base", value: "R$ 5.000,00", tooltipText: "Salário bruto mensal do colaborador." },
    { title: "Cargo", value: "Desenvolvedor", tooltipText: "Cargo atual do colaborador." },
    { title: "Escolaridade", value: "Superior Completo", tooltipText: "Nível de escolaridade do colaborador." },
    { title: "Idade", value: "30 anos", tooltipText: "Idade atual do colaborador." },
  ];

  // Process chart data for Ficha Pessoal (memoized for performance)
  const processedEvolucaoChartDataFicha = useMemo(() => {
    return rawChartDataEntriesFicha.map(entry => {
      const [month, valueString] = entry.split(": ");
      return { month, value: parseCurrency(valueString) };
    });
  }, []);

  // The EvolucaoCard title is "Evolução de Custo Total"
  // The kpiSelecionado prop in EvolucaoCard might be used to set this title.
  // If EvolucaoCard takes a direct title prop, that would be simpler.
  // For now, we'll pass a value that results in the desired title.
  const evolucaoCardTitle = "Evolução de Custo Total";


  return (
    <div className="p-4">
      <div className="flex flex-row items-center justify-start gap-8 mb-4 border-b pb-4 border-black/10 bg-gray-100">
        <h1 className={`text-[32px] leading-8 font-700 text-black text-left ${cairo.className}`}>
          Dashboard de Ficha Pessoal
        </h1>
        <SecaoFiltros />
      </div>
      <KpiCardsGrid cardsData={kpiCardData} />

      <div className="mt-4 flex flex-row gap-4"> {/* Wrapper for layout if needed */}
        <EvolucaoCard
          kpiSelecionado={evolucaoCardTitle} 
          processedEvolucaoChartData={processedEvolucaoChartDataFicha}
          sectionIcons={sectionIconsFicha}
          cairoClassName={cairo.className}
        />
        {/* You can add other cards here in the future, side-by-side */}
      </div>

      {/* O restante do conteúdo do seu dashboard virá aqui */}
      <p className="mt-4"></p>
    </div>
  );
}
