import Image from "next/image";
import React, { Fragment } from "react";
import ValorPorGrupoChart from "./ValorPorGrupoChart"; 

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
    <div className="w-1/2 bg-white rounded-lg h-[627px] border border-neutral-700 relative overflow-hidden"> 
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      
      <div className="flex justify-between items-center pt-[14px] px-5">
        <div title="Valor Por Grupo e Evento" className={`flex-grow overflow-hidden mr-3 text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap text-ellipsis`}>Valor Por Grupo e Evento</div>
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
      
      <div className="w-full h-[537px] px-4 pt-0 pb-4 left-0 top-[60px] absolute bg-white"> 
        <ValorPorGrupoChart data={valorPorGrupoData} />
      </div>
    </div>
  );
};

export default ValorPorGrupoCard;
