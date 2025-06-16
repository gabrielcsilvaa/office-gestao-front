"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface AlteracaoSalarialDetalheEntry {
  competencia: string;
  motivo: string;
  salarioAnterior: number | null;
  salarioNovo: number;
  percentual: string;
  nomeColaborador: string;
}

interface IconProps {
  src: string;
  alt: string;
  adjustSize?: boolean;
}

interface AlteracoesSalariaisDetalheCardProps {
  alteracoesData: AlteracaoSalarialDetalheEntry[];
  cairoClassName: string;
  headerIcons: IconProps[];
  title: string;
  onMaximize?: () => void;
}

const AlteracoesSalariaisDetalheCard: React.FC<AlteracoesSalariaisDetalheCardProps> = ({
  alteracoesData,
  cairoClassName,
  headerIcons,
  title = "Histórico de Alterações Salariais",
  onMaximize,
}) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [hasScrollbar, setHasScrollbar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
      setVisibleCount(prev => Math.min(prev + 10, alteracoesData.length));
    }
  };

  const formatCurrency = (value: number | null) =>
    value !== null
      ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : "N/A";

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
  }, [alteracoesData, visibleCount]);

  return (
    <div className="w-full bg-white rounded-lg relative flex flex-col overflow-hidden h-full shadow-md">
      {/* Vertical bar copied from AtestadosTable */}
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      
      {/* Header Section */}
      <div className="flex justify-between items-start pt-[14px] px-5 mb-3 flex-shrink-0">
        <div className="flex-grow overflow-hidden mr-3">
          <div title={title} className={`text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap overflow-hidden text-ellipsis`}>
            {title}
          </div>
        </div>
        {/* Icons Area */}
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
                  onClick={icon.alt === "Maximize" ? onMaximize : undefined}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto min-h-0 space-y-4 pl-4 pb-4 ${cairoClassName}`}
        style={{ paddingRight: hasScrollbar ? '4px' : '16px' }}
      >
        {alteracoesData.length > 0 ? (
          alteracoesData.slice(0, visibleCount).map((alteracao, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg shadow-md bg-white">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {/* Linha 1: nome do funcionário */}
                <div className="flex flex-col col-span-2">
                  <span className="text-gray-800 font-medium text-sm truncate">
                    {alteracao.nomeColaborador}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Funcionário</span>
                </div>
                <div className="col-span-2 h-px bg-gray-200"></div>

                {/* Linha 2: competência | motivo */}
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">
                    {alteracao.competencia}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Competência</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">
                    {alteracao.motivo}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Motivo</span>
                </div>
                <div className="col-span-2 h-px bg-gray-200"></div>

                {/* Linha 3: salário anterior | salário novo */}
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">
                    {formatCurrency(alteracao.salarioAnterior)}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Salário Anterior</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">
                    {formatCurrency(alteracao.salarioNovo)}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Salário Novo</span>
                </div>
                <div className="col-span-2 h-px bg-gray-200"></div>

                {/* Linha 4: variação (%) */}
                <div className="flex flex-col col-span-2">
                  <span className="text-gray-800 font-medium text-sm truncate">
                    {alteracao.percentual || "-"}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Variação (%)</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`flex items-center justify-center h-full text-gray-500 ${cairoClassName}`}>
            Nenhuma alteração salarial encontrada.
          </div>
        )}
      </div>
    </div>
  );
};

export default AlteracoesSalariaisDetalheCard;
