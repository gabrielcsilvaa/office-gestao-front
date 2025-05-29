"use client";

import React from 'react';
import Image from 'next/image';

interface AlteracaoSalarialDetalheEntry {
  data: string;
  tipo: string;
  motivo: string;
  salarioAnterior: number;
  salarioNovo: number;
  percentual: string;
}

interface IconProps {
  src: string;
  alt: string;
  adjustSize?: boolean;
}

interface AlteracoesSalariaisDetalheCardProps {
  alteracoesData: AlteracaoSalarialDetalheEntry[];
  cairoClassName: string;
  headerIcons?: IconProps[];
  title?: string;
}

// Sample data for AlteracoesSalariaisDetalheCard
const sampleAlteracoesSalariaisDetalheData: AlteracaoSalarialDetalheEntry[] = [
  { data: "2023-05-15", tipo: "Promoção", motivo: "Desempenho Excepcional", salarioAnterior: 5000, salarioNovo: 6000, percentual: "20.00%" },
  { data: "2024-01-10", tipo: "Ajuste Anual", motivo: "Inflação e Custo de Vida", salarioAnterior: 6000, salarioNovo: 6300, percentual: "5.00%" },
];

const AlteracoesSalariaisDetalheCard: React.FC<AlteracoesSalariaisDetalheCardProps> = ({
  alteracoesData = sampleAlteracoesSalariaisDetalheData, // Default to sample data
  cairoClassName,
  headerIcons,
  title = "Histórico de Alterações Salariais" // Default title
}) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="w-full bg-white rounded-lg border border-neutral-700 relative flex flex-col overflow-hidden h-full">
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
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className={`flex-1 overflow-y-auto min-h-0 space-y-4 pl-4 pr-1 pb-4 ${cairoClassName}`}>
        {alteracoesData.length > 0 ? (
          alteracoesData.map((alteracao, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg shadow-md bg-white">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{alteracao.data || "-"}</span>
                  <span className="text-gray-500 font-light text-xs">Data</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{alteracao.tipo || "-"}</span>
                  <span className="text-gray-500 font-light text-xs">Tipo</span>
                </div>

                <div className="col-span-2 h-px bg-gray-200"></div>
                
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{formatCurrency(alteracao.salarioAnterior)}</span>
                  <span className="text-gray-500 font-light text-xs">Salário Anterior</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{formatCurrency(alteracao.salarioNovo)}</span>
                  <span className="text-gray-500 font-light text-xs">Salário Novo</span>
                </div>

                <div className="col-span-2 h-px bg-gray-200"></div>

                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{alteracao.percentual || "-"}</span>
                  <span className="text-gray-500 font-light text-xs">Percentual</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate" title={alteracao.motivo}>{alteracao.motivo || "-"}</span>
                  <span className="text-gray-500 font-light text-xs">Motivo</span>
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
