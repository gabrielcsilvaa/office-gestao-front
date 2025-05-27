"use client";
import { Cairo } from "next/font/google";
import SecaoFiltros from "./components/SecaoFiltros";
import KpiCardsGrid from "./components/KpiCardsGrid";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cairo",
});

export default function FichaPessoalPage() {
  const kpiCardData = [
    { title: "Data de Admissão", value: "01/01/2020", tooltipText: "Data de início do colaborador na empresa." },
    { title: "Salário Base", value: "R$ 5.000,00", tooltipText: "Salário bruto mensal do colaborador." },
    { title: "Cargo", value: "Desenvolvedor", tooltipText: "Cargo atual do colaborador." },
    { title: "Escolaridade", value: "Superior Completo", tooltipText: "Nível de escolaridade do colaborador." },
    { title: "Idade", value: "30 anos", tooltipText: "Idade atual do colaborador." },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-row items-center justify-start gap-8 mb-4 border-b pb-4 border-black/10 bg-gray-100">
        <h1 className={`text-[32px] leading-8 font-700 text-black text-left ${cairo.className}`}>
          Dashboard de Ficha Pessoal
        </h1>
        <SecaoFiltros />
      </div>
      <KpiCardsGrid cardsData={kpiCardData} />
      {/* O restante do conteúdo do seu dashboard virá aqui */}
      <p className="mt-4"></p>
    </div>
  );
}
