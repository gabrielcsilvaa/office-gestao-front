import Image from "next/image";
import React, { Fragment } from "react";
import DissidioTable from "./DissidioTable"; 

interface Icon {
  src: string;
  alt: string;
  adjustSize?: boolean;
}

interface DissidioCardProps {
  sectionIcons: Icon[];
  cairoClassName: string;
}

const dissidioTableData = [
  {
    sindicato:
      "SINDICATO DOS TRABALHADORES NO COMERCIO HOTELEIRO, BARES, RESTAURANTES E SIMILARES, TURISMO DA REGIAO DO CARIRI CE",
    mesBase: "Dezembro",
  },
  {
    sindicato: "SIND DOS ENFERMEIROS DO EST DO CE",
    mesBase: "Setembro",
  },
  {
    sindicato: "Importação eSocial",
    mesBase: "Julho",
  },
  {
    sindicato: "SIND DOS TRAB NO COM HOT. BARES, REST E SIMIL, TURIS E HOSP",
    mesBase: "Julho",
  },
  {
    sindicato:
      "SIND INTER. MUN. TRAB. COM. HOTELEIROS SIM. TUR. HOSP EST CE",
    mesBase: "Julho",
  },
  {
    sindicato:
      "SINDICATO DOS TRAB NO COM HOT BARES REST TUR E HOSP DE SOBRAL E Z NORTE DO CEARA",
    mesBase: "Julho",
  },
  {
    sindicato:
      "SINDICATO DOS TRABALHADORES NO COMERCIO HOTELEIRO E SIMILARES DO MUNICIPIO DE CAUCAIA",
    mesBase: "Julho",
  },
];

const DissidioCard: React.FC<DissidioCardProps> = ({
  sectionIcons,
  cairoClassName,
}) => {
  const filteredIcons = sectionIcons
    .filter(
      (icon) => icon.alt === "Filter Layers" || icon.alt === "More Options"
    )
    .sort((a, b) => {
      if (a.alt === "Filter Layers" && b.alt === "More Options") return -1;
      if (a.alt === "More Options" && b.alt === "Filter Layers") return 1;
      return 0;
    });

  return (
    <div className="flex-1 bg-white rounded-lg h-[489px] relative overflow-hidden shadow-md">
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      <div className="flex justify-between items-center pt-[14px] px-5">
        <div
          title="Dissídio"
          className={`flex-grow overflow-hidden mr-3 text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap text-ellipsis`}
        >
          Dissídio
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {sectionIcons.map((icon, index) => (
            <Image
              key={index}
              src={icon.src}
              alt={icon.alt}
              width={icon.adjustSize ? 14 : 16}
              height={icon.adjustSize ? (icon.src.includes("lay") ? 16 : 14) : 16}
              className="cursor-pointer opacity-60 hover:opacity-100"
            />
          ))}
        </div>
      </div>
      <div className="w-full h-[calc(489px-50px)] px-4 pt-2 pb-4 left-0 top-[50px] absolute bg-white overflow-y-auto">
        <DissidioTable
          data={dissidioTableData}
          cairoClassName={cairoClassName}
        />
      </div>
    </div>
  );
};

export default DissidioCard;
