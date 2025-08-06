import Image from "next/image";
import React, { useState, useRef } from "react";

interface Icon {
  src: string;
  alt: string;
  adjustSize?: boolean;
}

interface DissidioCardProps {
  sectionIcons: Icon[];
  cairoClassName: string;
  onMaximize?: () => void;
  dissidioData: { sindicato: string; mesBase: string }[];
}

const DissidioCard: React.FC<DissidioCardProps> = ({
  sectionIcons,
  cairoClassName,
  onMaximize,
  dissidioData, // 👈 dados recebidos via props
}) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [hasScrollbar, setHasScrollbar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      setVisibleCount(prev => Math.min(prev + 10, dissidioData.length));
    }
  };

  const checkScrollbar = () => {
    const el = containerRef.current;
    if (el) {
      setHasScrollbar(el.scrollHeight > el.clientHeight);
    }
  };

  React.useEffect(() => {
    checkScrollbar();
    const observer = new ResizeObserver(checkScrollbar);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex-1 bg-white rounded-lg h-[489px] relative overflow-hidden shadow-md">
      {/* Barra lateral cinza */}
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>

      {/* Header */}
      <div className="flex justify-between items-start pt-[14px] px-5 mb-3 flex-shrink-0">
        <div className="flex-grow overflow-hidden mr-3">
          <div
            title="Dissídio"
            className={`text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap overflow-hidden text-ellipsis`}
          >
            Dissídio
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {sectionIcons.map((icon, index) => (
            <div
              key={index}
              className="cursor-pointer p-1"
              onClick={() => icon.alt === "Maximize" && onMaximize?.()}
            >
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

      {/* Conteúdo */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto min-h-0 space-y-4 pl-4 pb-4 ${cairoClassName}`}
        style={{
          paddingRight: hasScrollbar ? '4px' : '16px',
          height: 'calc(489px - 80px)',
          marginTop: '10px'
        }}
      >
        {dissidioData.length > 0 ? (
          dissidioData.slice(0, visibleCount).map((dissidio, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg shadow-md bg-white">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {/* Sindicato */}
                <div className="flex flex-col col-span-2">
                  <span className="text-gray-800 font-medium text-sm">
                    {dissidio.sindicato}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Sindicato</span>
                </div>
                <div className="col-span-2 h-px bg-gray-200"></div>

                {/* Mês Base */}
                <div className="flex flex-col col-span-2">
                  <span className="text-gray-800 font-medium text-sm truncate">
                    {dissidio.mesBase}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Mês Base</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`flex items-center justify-center h-full text-gray-500 ${cairoClassName}`}>
            Nenhum registro de dissídio encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default DissidioCard;
