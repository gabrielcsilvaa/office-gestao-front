import Image from "next/image";
import React, { Fragment } from "react";

interface ValorPorPessoaCardProps {
  sectionIcons: Array<{ src: string; alt: string; adjustSize?: boolean }>;
  cairoClassName: string;
}

const ValorPorPessoaCard: React.FC<ValorPorPessoaCardProps> = ({
  sectionIcons,
  cairoClassName,
}) => {
  return (
    <div className="flex-1 bg-white rounded-lg h-[489px] border border-neutral-700 relative overflow-hidden">
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      <div className="flex justify-between items-center pt-[14px] px-5">
        <div title="Valor Por Tipo de Pessoa e Vínculo" className={`flex-grow overflow-hidden mr-3 text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap text-ellipsis`}>Valor Por Tipo de Pessoa e Vínculo</div>
        <div className="flex items-center gap-2 flex-shrink-0"> 
          {sectionIcons.map((icon, index) => {
            let iconWidth = 16; 
            let iconHeight = 16; 
            if (icon.adjustSize) {
              iconWidth = 14; 
              iconHeight = icon.src.includes("lay") ? 16 : 14;
            }
            return (
              <Fragment key={`s2-icon-fragment-${index}`}>
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
              </Fragment>
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
  );
};

export default ValorPorPessoaCard;
