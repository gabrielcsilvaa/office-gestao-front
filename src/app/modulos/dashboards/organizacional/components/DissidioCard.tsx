import Image from "next/image";
import React, { Fragment } from "react";

interface DissidioCardProps {
  sectionIcons: Array<{ src: string; alt: string; adjustSize?: boolean }>;
  cairoClassName: string;
}

const DissidioCard: React.FC<DissidioCardProps> = ({
  sectionIcons,
  cairoClassName,
}) => {
  return (
    <div className="flex-1 bg-white rounded-lg h-[489px] border border-neutral-700 relative overflow-hidden">
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      <div className="flex justify-between items-center pt-[14px] px-5"> 
        <div title="Dissídio" className={`flex-grow overflow-hidden mr-3 text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap text-ellipsis`}>Dissídio</div>
        <div className="flex items-center gap-2 flex-shrink-0"> 
          {sectionIcons
            .filter(icon => icon.alt === "Filter Layers" || icon.alt === "More Options")
            .sort((a, b) => {
              if (a.alt === "Filter Layers" && b.alt === "More Options") return -1;
              if (a.alt === "More Options" && b.alt === "Filter Layers") return 1;
              return 0;
            })
            .map((icon, index) => {
             let iconWidth = 16; 
             let iconHeight = 16; 
             if (icon.adjustSize) {
               iconWidth = 14; 
               iconHeight = icon.src.includes("lay") ? 16 : 14; 
             }
             return (
              <Fragment key={`s1-icon-fragment-${index}`}>
                <Image
                  key={`s1-icon-${index}`}
                  src={icon.src}
                  alt={icon.alt}
                  width={iconWidth} 
                  height={iconHeight} 
                  className="cursor-pointer"
                />
              </Fragment>
            );
          })}
        </div>
      </div>
      <div className="w-full h-[calc(489px-50px)] px-4 pt-2 pb-4 left-0 top-[50px] absolute bg-white"> 
        <div className="w-full h-full border border-dashed border-gray-300 flex items-center justify-center">
          <span className="text-gray-400">Dissídio Content Area</span>
        </div>
      </div>
    </div>
  );
};

export default DissidioCard;
