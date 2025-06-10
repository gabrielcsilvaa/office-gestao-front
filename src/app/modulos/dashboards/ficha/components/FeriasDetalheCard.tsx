"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface FeriasDetalheEntry {
  nomeColaborador: string;
  inicioPeriodoAquisitivo: string;
  fimPeriodoAquisitivo: string;
  inicioPeriodoGozo: string;
  fimPeriodoGozo: string;
  limiteParaGozo: string;
  diasDeDireito: number;
  diasGozados: number;
  diasDeSaldo: number;
}

interface IconProps {
  src: string;
  alt: string;
  adjustSize?: boolean;
}

interface FeriasDetalheCardProps {
  feriasData: FeriasDetalheEntry[];
  cairoClassName: string;
  headerIcons?: IconProps[];
  title?: string;
}

const FeriasDetalheCard: React.FC<FeriasDetalheCardProps> = ({
  feriasData,
  cairoClassName,
  headerIcons,
  title = "Histórico de Férias"
}) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
      setVisibleCount(prev => Math.min(prev + 10, feriasData.length));
    }
  };

  return (
    <div className="w-full bg-white rounded-lg relative flex flex-col overflow-hidden h-full shadow-md">
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      <div className="flex justify-between items-start pt-[14px] px-5 mb-3 flex-shrink-0">
        <div className="flex-grow overflow-hidden mr-3">
          <div title={title} className={`text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap overflow-hidden text-ellipsis`}>
            {title}
          </div>
        </div>
        {headerIcons && headerIcons.length > 0 && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            {headerIcons.map((icon, index) => (
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
        )}
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto min-h-0 space-y-4 pl-4 pr-1 pb-4 ${cairoClassName}`}
      >
        {feriasData.length > 0 ? (
          feriasData.slice(0, visibleCount).map((ferias, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg shadow-md bg-white">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {/* Linha 1: Funcionário */}
                <div className="flex flex-col col-span-2">
                  <span className="text-gray-800 font-medium text-sm truncate" title={ferias.nomeColaborador}>
                    {ferias.nomeColaborador}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Funcionário</span>
                </div>
                <div className="col-span-2 h-px bg-gray-200"></div>

                {/* Linha 2: Período Aquisitivo */}
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">
                    {ferias.inicioPeriodoAquisitivo}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Início Aquisitivo</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">
                    {ferias.fimPeriodoAquisitivo}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Término Aquisitivo</span>
                </div>
                <div className="col-span-2 h-px bg-gray-200"></div>

                {/* Linha 3: Período de Gozo */}
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">
                    {ferias.inicioPeriodoGozo}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Início Gozo</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">
                    {ferias.fimPeriodoGozo}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Término Gozo</span>
                </div>
                <div className="col-span-2 h-px bg-gray-200"></div>

                {/* Linha 4: Dias totais e usufruídos */}
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">
                    {ferias.diasDeDireito}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Total de Dias</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">
                    {ferias.diasGozados}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Dias Usufruídos</span>
                </div>
                <div className="col-span-2 h-px bg-gray-200"></div>

                {/* Linha 5: Dias restantes e vencimento */}
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">
                    {ferias.diasDeSaldo}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Dias Restantes</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">
                    {ferias.limiteParaGozo}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Data de Vencimento</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`flex items-center justify-center h-full text-gray-500 ${cairoClassName}`}>
            Nenhum registro de férias encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default FeriasDetalheCard;
