import Image from "next/image";
import React, { Fragment } from "react";
import EvolucaoChart from "./EvolucaoChart";

interface EvolucaoCardProps {
  kpiSelecionado: string;
  processedEvolucaoChartData: Array<{ month: string; value: number }>;
  sectionIcons: Array<{ src: string; alt: string; adjustSize?: boolean }>;
  cairoClassName: string;
}

const EvolucaoCard: React.FC<EvolucaoCardProps> = ({
  kpiSelecionado,
  processedEvolucaoChartData,
  sectionIcons,
  cairoClassName,
}) => {
  return (
    <div className="w-full bg-white rounded-lg relative flex flex-col overflow-hidden h-full">
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      
      <div className="flex justify-between items-start pt-[14px] px-5 mb-3 flex-shrink-0">
        <div className="flex-grow overflow-hidden mr-3">
          <div title={kpiSelecionado} className={`text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap overflow-hidden text-ellipsis`}>
            {kpiSelecionado}
          </div>
        </div>
        {sectionIcons && sectionIcons.length > 0 && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            {sectionIcons.map((icon, index) => (
              <div key={index} className="cursor-pointer p-1">
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
        )}
      </div>

      <div className="flex-1 px-5 pb-5 min-h-0 overflow-y-auto">
        <EvolucaoChart
          kpiName={kpiSelecionado}
          data={processedEvolucaoChartData}
        />
      </div>
    </div>
  );
};

export default EvolucaoCard;
