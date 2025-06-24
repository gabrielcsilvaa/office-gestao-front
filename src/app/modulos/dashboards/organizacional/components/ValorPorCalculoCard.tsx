import Image from "next/image";
import React, { useMemo } from "react";
import ModernBarChart from "./ModernBarChart";

interface RawDataItem {
  name: string;
  value: string;
}

interface ValorPorCalculoCardProps {
  sectionIcons: Array<{ src: string; alt: string; adjustSize?: boolean }>;
  cairoClassName: string;
  onMaximize?: () => void;
}

export const rawCalculoEventoData: RawDataItem[] = [
  { name: "51 - 13º Adiantamento", value: "R$ 700,00" },
  { name: "42 - Complementar", value: "R$ 15.800,00" },
  { name: "52 - 13º Integral", value: "R$ 36.800,00" },
  { name: "60 - Férias", value: "R$ 39.400,00" },
  { name: "41 - Adiantamento", value: "R$ 102.400,00" },
  { name: "11 - Folha Mensal", value: "R$ 471.100,00" },
];

const ValorPorCalculoCard: React.FC<ValorPorCalculoCardProps> = ({
  sectionIcons,
  cairoClassName,
  onMaximize,
}) => {
  const processedData = useMemo(() => {
    // Converter valores de string para números para cálculos
    const dataWithNumbers = rawCalculoEventoData.map(item => ({
      ...item,
      numericValue: parseFloat(item.value.replace("R$", "").replace(/\./g, "").replace(",", ".").trim())
    }));

    // Ordenar por valor (maior para menor)
    const sortedData = dataWithNumbers.sort((a, b) => b.numericValue - a.numericValue);
    
    // Calcular o valor total para percentuais
    const totalValue = sortedData.reduce((sum, item) => sum + item.numericValue, 0);
    
    // Mapear para o formato esperado pelo ModernBarChart
    return sortedData.map((item, index) => ({
      name: item.name,
      value: item.value,
      numericValue: item.numericValue,
      percentage: totalValue > 0 ? (item.numericValue / totalValue) * 100 : 0,
      rank: index + 1
    }));
  }, []);

  return (
    <div className="flex-1 bg-white rounded-lg h-[489px] relative overflow-hidden shadow-md">
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>      <div className="flex justify-between items-start pt-[14px] px-5 mb-3 flex-shrink-0">
        <div className="flex-grow overflow-hidden mr-3">
          <div
            title="Valor Por Tipo de Cálculo e Evento"
            className={`text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap overflow-hidden text-ellipsis`}
          >
            Valor Por Tipo de Cálculo e Evento
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {sectionIcons.map((icon, index) => (
            <div
              key={index}
              className="cursor-pointer p-1"
              onClick={() => icon.alt === 'Maximize' && onMaximize?.()}
            >
              <Image
                src={icon.src}
                alt={icon.alt}
                width={16}
                height={16}
                className="opacity-60 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>      <div className="w-full h-[calc(489px-50px)] px-4 pt-2 pb-4 left-0 top-[50px] absolute bg-white overflow-y-auto">
        <ModernBarChart 
          items={processedData} 
          cairoClassName={cairoClassName}
          colorScheme="blue"
        />
      </div>
    </div>
  );
};

export default ValorPorCalculoCard;
