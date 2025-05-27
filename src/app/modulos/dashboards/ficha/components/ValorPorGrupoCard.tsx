import Image from "next/image";
import React, { Fragment } from "react";
import ValorPorGrupoChart from "./ValorPorGrupoChart"; // Assuming ValorPorGrupoChart is in the same components folder or path is adjusted

interface ValorPorGrupoCardProps {
  valorPorGrupoData: Array<{ name: string; value: number }>;
  sectionIcons: Array<{ src: string; alt: string; adjustSize?: boolean }>;
  cairoClassName: string;
}

const ValorPorGrupoCard: React.FC<ValorPorGrupoCardProps> = ({
  valorPorGrupoData,
  sectionIcons,
  cairoClassName,
}) => {
  return (
    <div className="w-full bg-white rounded-lg h-[500px] border border-neutral-700 relative overflow-hidden">
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      
      {/* Header Section */}
      <div className="flex justify-between items-start pt-[14px] px-5">
        <div className="flex-grow overflow-hidden mr-3">
          <div title="Valor Por Grupo e Evento" className={`text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap overflow-hidden text-ellipsis`}>
            Valor Por Grupo e Evento
          </div>
          {/* Removido o subtítulo "Proventos e Descontos" */}
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
              <Fragment key={`right-icon-fragment-${index}`}>
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
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-[410px] px-4 pt-0 pb-4 left-0 top-[90px] absolute bg-white">
        {/* The ValorPorGrupoChart component will be responsible for its own width */}
        <ValorPorGrupoChart data={valorPorGrupoData} />
      </div>
    </div>
  );
};

export default ValorPorGrupoCard;
