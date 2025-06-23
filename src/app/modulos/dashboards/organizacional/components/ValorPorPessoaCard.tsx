import Image from "next/image";
import React, { Fragment, useMemo } from "react";
import NameList from "./NameList";
import { processNameBarDataUtil, RawNameBarDataItem, ColorParams } from "../utils/chartUtils"; 

interface ValorPorPessoaCardProps {
  sectionIcons: Array<{ src: string; alt: string; adjustSize?: boolean }>;
  cairoClassName: string;
}

const rawNameBarData: RawNameBarDataItem[] = [ 
  { name: "RITA MARIA RODRIGUES DE OLIVEIRA", value: "R$ 1.600,00" },
  { name: "ISABEL CRISTINA BARBOSA RODRIGUES", value: "R$ 1.400,00" },
  { name: "MARIA GERLIANE DE ARAUJO MATIAS", value: "R$ 1.200,00" },
  { name: "SUZANA VICENTE GARCIA", value: "R$ 1.100,00" },
  { name: "FRANCISCA MARINA BEZERRA COSTA", value: "R$ 1.100,00" },
  { name: "ANDREA MARQUES AMARANTE", value: "R$ 1.000,00" },
  { name: "MARIA CLAUDIANA LIMA CARNEIRO", value: "R$ 900,00" },
  { name: "DAYANE DA SILVA GONCALVES", value: "R$ 800,00" },
  { name: "MARIA EDILEUDA ALVES PEREIRA", value: "R$ 800,00" },
  { name: "CARLOS ALBERTO DE NOBREGA", value: "R$ 750,00" },
  { name: "JOANA D'ARC DA SILVA XAVIER", value: "R$ 700,00" },
  { name: "PEDRO ALVARES CABRAL NETO", value: "R$ 700,00" },
  { name: "ANTONIA PEREIRA DOS SANTOS", value: "R$ 650,00" },
  { name: "LUIZ INACIO LULA DA SILVA FILHO", value: "R$ 600,00" },
  { name: "MARIANA COSTA DE ALMEIDA", value: "R$ 600,00" },
  { name: "FERNANDO HENRIQUE CARDOSO SOBRINHO", value: "R$ 550,00" },
  { name: "GABRIELA SOUZA LIMA", value: "R$ 500,00" },
  { name: "RAFAEL OLIVEIRA SANTANA", value: "R$ 500,00" },
  { name: "JULIANA ALVES DA CUNHA", value: "R$ 450,00" },
  { name: "BRUNO SILVA MARTINS", value: "R$ 400,00" },
];

const ValorPorPessoaCard: React.FC<ValorPorPessoaCardProps> = ({
  sectionIcons,
  cairoClassName,
}) => {
  const processedNameBarData = useMemo(() => {
    const maxBarPixelWidth = 240; 
    const colorParams: ColorParams = {
      hue: 145, 
      minSaturation: 30, 
      maxSaturation: 70, 
      minLightness: 75,  
      maxLightness: 45,  
    };
    return processNameBarDataUtil(rawNameBarData, maxBarPixelWidth, colorParams);
  }, []);

  return (
    <div className="flex-1 bg-white rounded-lg h-[489px] relative overflow-hidden shadow-md">
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>      <div className="flex justify-between items-start pt-[14px] px-5 mb-3 flex-shrink-0">
        <div className="flex-grow overflow-hidden mr-3">
          <div
            title="Valor Por Tipo de Pessoa e Vínculo"
            className={`text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap overflow-hidden text-ellipsis`}
          >
            Valor Por Tipo de Pessoa e Vínculo
          </div>
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
              />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full h-[calc(489px-50px)] px-4 pt-2 pb-4 left-0 top-[50px] absolute bg-white overflow-y-auto">
        <NameList items={processedNameBarData} cairoClassName={cairoClassName} />
      </div>
    </div>
  );
};

export default ValorPorPessoaCard;
