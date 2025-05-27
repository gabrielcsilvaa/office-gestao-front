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
    <div className="w-full bg-white rounded-lg h-[500px] border border-neutral-700 relative flex flex-col"> {/* Alterado de h-[400px] para h-[500px] */}
      {/* Header Section */}
      <div className="flex justify-between items-center pt-[14px] px-5 pb-2 border-b border-neutral-200 flex-shrink-0"> {/* Adicionado flex-shrink-0 */}
        <div title="Valor Por Grupo e Evento" className={`flex-grow overflow-hidden mr-3 text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap text-ellipsis`}>
          Valor Por Grupo e Evento
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

      {/* Chart Area - This div will scroll horizontally if the chart is wider */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 min-h-0"> {/* Adicionado min-h-0 */}
        {/* The ValorPorGrupoChart component will be responsible for its own width */}
        <ValorPorGrupoChart data={valorPorGrupoData} />
      </div>
    </div>
  );
};

export default ValorPorGrupoCard;
