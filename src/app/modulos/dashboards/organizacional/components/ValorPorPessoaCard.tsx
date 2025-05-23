import Image from "next/image";
import React, { Fragment, useMemo } from "react";
import NameList from "./NameList";

interface ValorPorPessoaCardProps {
  sectionIcons: Array<{ src: string; alt: string; adjustSize?: boolean }>;
  cairoClassName: string;
}

// Original data with string values
const rawNameBarData = [
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

// Helper to parse currency string to number
const parseCurrencyValue = (currencyString: string): number => {
  if (!currencyString) return 0;
  return parseFloat(
    currencyString
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim()
  );
};

const ValorPorPessoaCard: React.FC<ValorPorPessoaCardProps> = ({
  sectionIcons,
  cairoClassName,
}) => {
  const processedNameBarData = useMemo(() => {
    const numericValues = rawNameBarData.map((item) => parseCurrencyValue(item.value));
    const maxValue = Math.max(...numericValues, 0); // Ensure maxValue is not -Infinity if array is empty or all values are 0
    const minValue = Math.min(...numericValues, maxValue); // Ensure minValue is not Infinity if array is empty

    const maxBarPixelWidth = 240; // Corresponds to w-60 (15rem * 16px/rem)

    // HSL Color parameters
    const hue = 145; // Green hue
    const maxSaturation = 70; // Saturation for max value
    const minSaturation = 30; // Saturation for min value (more desaturated)
    const maxLightness = 45;  // Lightness for max value (vibrant)
    const minLightness = 75;  // Lightness for min value (lighter, faded)

    return rawNameBarData.map((item, index) => {
      const numericValue = numericValues[index];
      const ratio = maxValue > minValue ? (numericValue - minValue) / (maxValue - minValue) : 1; // Normalize between 0 and 1
      
      const barPixelWidth = maxValue > 0 ? (numericValue / maxValue) * maxBarPixelWidth : 0;

      // Interpolate saturation and lightness
      // If only one distinct value, use max saturation/lightness
      const saturation = maxValue === minValue ? maxSaturation : minSaturation + ratio * (maxSaturation - minSaturation);
      const lightness = maxValue === minValue ? maxLightness : minLightness - ratio * (minLightness - maxLightness); // Inverted: higher ratio = closer to maxLightness

      const barColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

      return {
        ...item,
        barPixelWidth: Math.max(barPixelWidth, 2), // Ensure a minimum visible width for the bar (e.g., 2px)
        barColor,
      };
    });
  }, []);

  return (
    <div className="flex-1 bg-white rounded-lg h-[489px] border border-neutral-700 relative overflow-hidden">
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      <div className="flex justify-between items-center pt-[14px] px-5">
        <div
          title="Valor Por Tipo de Pessoa e Vínculo"
          className={`flex-grow overflow-hidden mr-3 text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap text-ellipsis`}
        >
          Valor Por Tipo de Pessoa e Vínculo
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
      <div className="w-full h-[calc(489px-50px)] px-4 pt-2 pb-4 left-0 top-[50px] absolute bg-white overflow-y-auto">
        <NameList items={processedNameBarData} cairoClassName={cairoClassName} />
      </div>
    </div>
  );
};

export default ValorPorPessoaCard;
