import Image from "next/image";
import React, { Fragment } from "react";
import ValorPorGrupoChart from "./ValorPorGrupoChart"; 

interface ValorPorGrupoCardProps {
  valorPorGrupoData: Array<{ name: string; value: number }>;
  sectionIcons: Array<{ src: string; alt: string; adjustSize?: boolean }>;
  cairoClassName: string;
  onMaximize: () => void;
}

const ValorPorGrupoCard: React.FC<ValorPorGrupoCardProps> = ({
  valorPorGrupoData,
  sectionIcons,
  cairoClassName,
  onMaximize,
}) => {
  return (
    <div className="w-1/2 bg-white rounded-lg h-[427px] relative overflow-hidden shadow-md"> 
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
        <div className="flex justify-between items-start pt-[14px] px-5 mb-3 flex-shrink-0">
        <div className="flex-grow overflow-hidden mr-3">
          <div title="Valor Por Grupo e Evento" className={`text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap overflow-hidden text-ellipsis`}>Valor Por Grupo e Evento</div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {sectionIcons.map((icon, index) => (
            <div key={index} className="cursor-pointer p-1">
              <Image
                src={icon.src}
                alt={icon.alt}
                width={16}
                height={16}
                className="opacity-60 hover:opacity-100"
                onClick={onMaximize}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-[387px] px-4 pt-0 pb-4 left-0 top-[60px] absolute bg-white">
        <ValorPorGrupoChart data={valorPorGrupoData} />
      </div>
    </div>
  );
};

export default ValorPorGrupoCard;
