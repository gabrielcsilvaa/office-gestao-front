"use client"; 
import { Cairo } from "next/font/google";
import SelecaoIndicadores from "./components/SelecaoIndicadores";
import SecaoFiltros from "./components/SecaoFiltros";
import Card from "./components/card";
import { useState } from "react"; 
import Image from "next/image"; // Import Image component
import React from "react";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

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

        <div className="mt-4 flex flex-row gap-4">
          {/* Div da Esquerda (Evolução Chart Card) */}
          <div className="w-1/2 bg-white rounded-lg h-[627px] border border-neutral-700 relative overflow-hidden">
            {/* Vertical Bar from Figma */}
            <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
            
            {/* Evolução Title from Figma */}
            <div className={`left-[20px] top-[14px] absolute text-black text-xl font-semibold leading-normal ${cairo.className}`}>Evolução</div>
            
            {/* Subtitle (Dynamic KPI) from Figma */}
            <div className={`left-[20px] top-[41px] absolute text-black text-xs font-light leading-normal ${cairo.className}`}>{kpiSelecionado}</div>

            {/* Icons in top-right corner */}
            <div className="absolute top-[14px] right-4 flex items-center gap-4">
              {sectionIcons.map((icon, index) => {
                let iconWidth = 20;
                let iconHeight = 20;

                if (icon.adjustSize) {
                  iconWidth = 18; 
                  iconHeight = 18; 
                }
                if (icon.src === "/assets/icons/icon-lay-down.svg" || icon.src === "/assets/icons/icon-lay-up.svg") {
                  iconHeight = 20;
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
                      <div className="w-px h-5 bg-neutral-300"></div> // Vertical separator
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Chart Area Placeholder based on Figma */}
            <div className="w-full h-[537px] px-4 pt-8 pb-4 left-0 top-[90px] absolute bg-white">
              {/* Actual chart component would go here */}
              <div className="w-full h-full border border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-gray-400">Chart Area</span>
              </div>
            </div>
          </div>

          {/* Div da Direita */}
          <div className="w-1/2 bg-white rounded-lg h-[627px] border border-neutral-700 relative overflow-hidden p-0">
            {/* Vertical Bar - same styling as left section */}
            <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
            
            {/* Title for Right Section - same styling as left section's title */}
            <div className={`left-[20px] top-[14px] absolute text-black text-xl font-semibold leading-normal ${cairo.className}`}>Valor Por Grupo e Evento</div>
            
            {/* Icons in top-right corner */}
            <div className="absolute top-[14px] right-4 flex items-center gap-4">
              {sectionIcons.map((icon, index) => {
                let iconWidth = 20;
                let iconHeight = 20;

                if (icon.adjustSize) {
                  iconWidth = 18; 
                  iconHeight = 18; 
                }
                if (icon.src === "/assets/icons/icon-lay-down.svg" || icon.src === "/assets/icons/icon-lay-up.svg") {
                  iconHeight = 20;
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
                      <div className="w-px h-5 bg-neutral-300"></div> // Vertical separator
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            
            {/* Content for the right square can go here, potentially in a positioned div like the chart area */}
            <div className="w-full h-[537px] px-4 pt-8 pb-4 left-0 top-[90px] absolute bg-white">
              {/* Placeholder for content in the right section */}
              <div className="w-full h-full border border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-gray-400">Content Area for "Valor Por Grupo e Evento"</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}