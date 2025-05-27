import Image from "next/image";
import React, { Fragment } from "react";
import EvolucaoChart from "./EvolucaoChart"; // Assuming EvolucaoChart is in the same components folder or path is adjusted

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
    <div className="w-full bg-white rounded-lg h-[627px] border border-neutral-700 relative overflow-hidden"> {/* Ensure w-full */}
      <div className="flex justify-between items-start pt-[14px] px-5">
        <div className="flex-grow overflow-hidden mr-3"> 
          <div title="Evolução de Custo Total" className={`text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap overflow-hidden text-ellipsis`}>
            Evolução de Custo Total
          </div>
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
              <Fragment key={`left-icon-fragment-${index}`}>
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
              </Fragment>
            );
          })}
        </div>
      </div>
      
      <div className="w-full h-[calc(100%-60px)] px-4 pt-0 pb-4 left-0 top-[60px] absolute bg-white"> {/* Adjusted height calc for chart area */}
        <EvolucaoChart data={processedEvolucaoChartData} kpiName={kpiSelecionado} />
      </div>
    </div>
  );
};

export default EvolucaoCard;
