import Image from "next/image";
import React, { Fragment, useMemo } from "react";
import NameList from "./NameList";
import { processNameBarDataUtil, RawNameBarDataItem, ColorParams } from "../utils/chartUtils";

interface ValorPorCalculoCardProps {
  sectionIcons: Array<{ src: string; alt: string; adjustSize?: boolean }>;
  cairoClassName: string;
}

const rawCalculoEventoData: RawNameBarDataItem[] = [
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
}) => {
  const processedCalculoEventoData = useMemo(() => {
    const maxBarPixelWidth = 240; 
    const colorParams: ColorParams = {
      hue: 210, 
      minSaturation: 30,
      maxSaturation: 70,
      minLightness: 75,
      maxLightness: 45,
    };
    
    const sortedData = [...rawCalculoEventoData].sort((a, b) => {
        const valA = parseFloat(a.value.replace("R$", "").replace(/\./g, "").replace(",", "."));
        const valB = parseFloat(b.value.replace("R$", "").replace(/\./g, "").replace(",", "."));
        return valB - valA;
    });
    return processNameBarDataUtil(sortedData, maxBarPixelWidth, colorParams);
  }, []);

  return (
    <div className="flex-1 bg-white rounded-lg h-[489px] border border-neutral-700 relative overflow-hidden">
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      <div className="flex justify-between items-center pt-[14px] px-5">
        <div
          title="Valor Por Tipo de Cálculo e Evento"
          className={`flex-grow overflow-hidden mr-3 text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap text-ellipsis`}
        >
          Valor Por Tipo de Cálculo e Evento
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
              <Fragment key={`s3-icon-fragment-${index}`}>
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
              </Fragment>
            );
          })}
        </div>
      </div>
      <div className="w-full h-[calc(489px-50px)] px-4 pt-2 pb-4 left-0 top-[50px] absolute bg-white overflow-y-auto">
        <NameList items={processedCalculoEventoData} cairoClassName={cairoClassName} />
      </div>
    </div>
  );
};

export default ValorPorCalculoCard;
