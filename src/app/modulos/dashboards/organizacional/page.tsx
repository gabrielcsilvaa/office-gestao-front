"use client"; 
import { Cairo } from "next/font/google";
import SelecaoIndicadores from "./components/SelecaoIndicadores";
import SecaoFiltros from "./components/SecaoFiltros";
import Card from "./components/card";
import { useState, useMemo } from "react"; 
import Image from "next/image"; 
import React from "react";
import EvolucaoChart from "./components/EvolucaoChart"; 
import ValorPorGrupoChart from "./components/ValorPorGrupoChart"; 

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
    { src: "/assets/icons/icon-lay-down.svg", alt: "Lay Down", adjustSize: true }, // Flag for adjustment
    { src: "/assets/icons/icon-lay-up.svg", alt: "Lay Up", adjustSize: true },     // Flag for adjustment
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
  }, []); // Empty dependency array means this runs once

  return (
    <div className="bg-[#f7f7f8] min-h-screen">
      <div className="h-auto flex flex-col items-start p-4 gap-4 border-b border-black/10 bg-gray-100">
        <SelecaoIndicadores 
          indicadorSelecionado={kpiSelecionado}
          onSelecaoIndicador={handleKpiChange}
        />
        <SecaoFiltros />
      </div>
      <div className="p-4">
        <div className="grid grid-cols-6 gap-4">
          {cardsData.map((card, index) => (
            <Card key={index} title={card.title} value={card.value} tooltipText={card.tooltipText} />
          ))}
        </div>

        {/* Existing row with two sections */}
        <div className="mt-4 flex flex-row gap-4">
          {/* Div da Esquerda (Evolução Chart Card) */}
          <div className="w-1/2 bg-white rounded-lg h-[627px] border border-neutral-700 relative overflow-hidden">
            <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
            
            <div className="flex justify-between items-start pt-[14px] px-5"> {/* Changed items-center to items-start */}
              <div className="flex-grow overflow-hidden mr-3"> 
                <div title="Evolução" className={`text-black text-xl font-semibold leading-normal ${cairo.className} whitespace-nowrap overflow-hidden text-ellipsis`}>Evolução</div>
                <div className={`text-black text-xs font-light leading-normal ${cairo.className}`}>{kpiSelecionado}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0"> 
                {sectionIcons.map((icon, index) => {
                  let iconWidth = 16; 
                  let iconHeight = 16; 
                  if (icon.adjustSize) {
                    iconWidth = 14; 
                    iconHeight = icon.src.includes("lay") ? 16 : 14; 
                  }
                  return (
                    <React.Fragment key={`left-icon-fragment-${index}`}>
                      <Image
                        key={`left-${index}`}
                        src={icon.src}
                        alt={icon.alt}
                        width={iconWidth} 
                        height={iconHeight} 
                        className="cursor-pointer"
                      />
                      {icon.src === "/assets/icons/icon-hierarchy.svg" && (
                        <div className="w-px h-5 bg-neutral-300"></div> 
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            
            <div className="w-full h-[537px] px-4 pt-0 pb-4 left-0 top-[90px] absolute bg-white"> 
              <EvolucaoChart data={processedEvolucaoChartData} kpiName={kpiSelecionado} />
            </div>
          </div>

          {/* Div da Direita (Valor Por Grupo Chart Card) */}
          <div className="w-1/2 bg-white rounded-lg h-[627px] border border-neutral-700 relative overflow-hidden"> 
            <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
            
            <div className="flex justify-between items-center pt-[14px] px-5"> {/* This one remains items-center */}
              <div title="Valor Por Grupo e Evento" className={`flex-grow overflow-hidden mr-3 text-black text-xl font-semibold leading-normal ${cairo.className} whitespace-nowrap text-ellipsis`}>Valor Por Grupo e Evento</div>
              <div className="flex items-center gap-2 flex-shrink-0"> 
                {sectionIcons.map((icon, index) => {
                  let iconWidth = 16; 
                  let iconHeight = 16; 
                  if (icon.adjustSize) {
                    iconWidth = 14; 
                    iconHeight = icon.src.includes("lay") ? 16 : 14; 
                  }
                  return (
                    <React.Fragment key={`right-icon-fragment-${index}`}>
                      <Image
                        key={`right-${index}`}
                        src={icon.src}
                        alt={icon.alt}
                        width={iconWidth}
                        height={iconHeight}
                        className="cursor-pointer"
                      />
                      {icon.src === "/assets/icons/icon-hierarchy.svg" && (
                        <div className="w-px h-5 bg-neutral-300"></div> 
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            
            <div className="w-full h-[537px] px-4 pt-0 pb-4 left-0 top-[60px] absolute bg-white"> 
              <ValorPorGrupoChart data={valorPorGrupoData} />
            </div>
          </div>
        </div>

        {/* New row with three sections */}
        <div className="mt-4 flex flex-row gap-4">
          {/* Section 1: Dissídio */}
          <div className="flex-1 bg-white rounded-lg h-[489px] border border-neutral-700 relative overflow-hidden">
            <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
            <div className="flex justify-between items-center pt-[14px] px-5"> {/* This one remains items-center */}
              <div title="Dissídio" className={`flex-grow overflow-hidden mr-3 text-black text-xl font-semibold leading-normal ${cairo.className} whitespace-nowrap text-ellipsis`}>Dissídio</div>
              <div className="flex items-center gap-2 flex-shrink-0"> 
                {sectionIcons.map((icon, index) => {
                   let iconWidth = 16; 
                   let iconHeight = 16; 
                   if (icon.adjustSize) {
                     iconWidth = 14; 
                     iconHeight = icon.src.includes("lay") ? 16 : 14; 
                   }
                   return (
                    <React.Fragment key={`s1-icon-fragment-${index}`}>
                      <Image
                        key={`s1-icon-${index}`}
                        src={icon.src}
                        alt={icon.alt}
                        width={iconWidth} 
                        height={iconHeight} 
                        className="cursor-pointer"
                      />
                      {icon.src === "/assets/icons/icon-hierarchy.svg" && (
                        <div className="w-px h-5 bg-neutral-300"></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <div className="w-full h-[calc(489px-50px)] px-4 pt-2 pb-4 left-0 top-[50px] absolute bg-white"> 
              <div className="w-full h-full border border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-gray-400">Dissídio Content Area</span>
              </div>
            </div>
          </div>

          {/* Section 2: Valor Por Tipo de Pessoa e Vínculo */}
          <div className="flex-1 bg-white rounded-lg h-[489px] border border-neutral-700 relative overflow-hidden">
            <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
            <div className="flex justify-between items-center pt-[14px] px-5"> {/* This one remains items-center */}
              <div title="Valor Por Tipo de Pessoa e Vínculo" className={`flex-grow overflow-hidden mr-3 text-black text-xl font-semibold leading-normal ${cairo.className} whitespace-nowrap text-ellipsis`}>Valor Por Tipo de Pessoa e Vínculo</div>
              <div className="flex items-center gap-2 flex-shrink-0"> 
                {sectionIcons.map((icon, index) => {
                  let iconWidth = 16; 
                  let iconHeight = 16; 
                  if (icon.adjustSize) {
                    iconWidth = 14; 
                    iconHeight = icon.src.includes("lay") ? 16 : 14;
                  }
                  return (
                    <React.Fragment key={`s2-icon-fragment-${index}`}>
                      <Image
                        key={`s2-icon-${index}`}
                        src={icon.src}
                        alt={icon.alt}
                        width={iconWidth} 
                        height={iconHeight} 
                        className="cursor-pointer"
                      />
                      {icon.src === "/assets/icons/icon-hierarchy.svg" && (
                        <div className="w-px h-5 bg-neutral-300"></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <div className="w-full h-[calc(489px-50px)] px-4 pt-2 pb-4 left-0 top-[50px] absolute bg-white"> 
              <div className="w-full h-full border border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-gray-400">Pessoa e Vínculo Chart Area</span>
              </div>
            </div>
          </div>

          {/* Section 3: Valor Por Tipo de Cálculo e Evento */}
          <div className="flex-1 bg-white rounded-lg h-[489px] border border-neutral-700 relative overflow-hidden">
            <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
            <div className="flex justify-between items-center pt-[14px] px-5"> {/* This one remains items-center */}
              <div title="Valor Por Tipo de Cálculo e Evento" className={`flex-grow overflow-hidden mr-3 text-black text-xl font-semibold leading-normal ${cairo.className} whitespace-nowrap text-ellipsis`}>Valor Por Tipo de Cálculo e Evento</div>
              <div className="flex items-center gap-2 flex-shrink-0"> 
                {sectionIcons.map((icon, index) => {
                  let iconWidth = 16; 
                  let iconHeight = 16; 
                  if (icon.adjustSize) {
                    iconWidth = 14; 
                    iconHeight = icon.src.includes("lay") ? 16 : 14;
                  }
                  return (
                    <React.Fragment key={`s3-icon-fragment-${index}`}>
                      <Image
                        key={`s3-icon-${index}`}
                        src={icon.src}
                        alt={icon.alt}
                        width={iconWidth} 
                        height={iconHeight} 
                        className="cursor-pointer"
                      />
                      {icon.src === "/assets/icons/icon-hierarchy.svg" && (
                        <div className="w-px h-5 bg-neutral-300"></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <div className="w-full h-[calc(489px-50px)] px-4 pt-2 pb-4 left-0 top-[50px] absolute bg-white"> 
              <div className="w-full h-full border border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-gray-400">Cálculo e Evento Chart Area</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}