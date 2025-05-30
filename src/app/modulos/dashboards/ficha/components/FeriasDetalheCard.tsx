"use client";

import React from 'react';
import Image from 'next/image';

interface FeriasDetalheEntry {
  nomeColaborador: string;
  inicioPeriodoAquisitivo: string;
  fimPeriodoAquisitivo: string;
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

// Sample data for FeriasDetalheCard
const sampleFeriasDetalheData: FeriasDetalheEntry[] = [
  {
    nomeColaborador: "Ana Silva",
    inicioPeriodoAquisitivo: "2022-01-01",
    fimPeriodoAquisitivo: "2022-12-31",
    limiteParaGozo: "2023-11-30",
    diasDeDireito: 30,
    diasGozados: 15,
    diasDeSaldo: 15,
  },
  {
    nomeColaborador: "Carlos Oliveira",
    inicioPeriodoAquisitivo: "2021-01-01",
    fimPeriodoAquisitivo: "2021-12-31",
    limiteParaGozo: "2022-11-30",
    diasDeDireito: 30,
    diasGozados: 30,
    diasDeSaldo: 0,
  },
  {
    nomeColaborador: "Beatriz Costa",
    inicioPeriodoAquisitivo: "2023-03-15",
    fimPeriodoAquisitivo: "2024-03-14",
    limiteParaGozo: "2025-02-14",
    diasDeDireito: 30,
    diasGozados: 0,
    diasDeSaldo: 30,
  },
  {
    nomeColaborador: "Daniel Martins",
    inicioPeriodoAquisitivo: "2022-07-01",
    fimPeriodoAquisitivo: "2023-06-30",
    limiteParaGozo: "2024-05-30",
    diasDeDireito: 30,
    diasGozados: 30,
    diasDeSaldo: 0,
  },
  {
    nomeColaborador: "Eduarda Ferreira",
    inicioPeriodoAquisitivo: "2024-01-10",
    fimPeriodoAquisitivo: "2025-01-09",
    limiteParaGozo: "2025-12-09",
    diasDeDireito: 30,
    diasGozados: 0,
    diasDeSaldo: 30,
  },
  {
    nomeColaborador: "Felipe Almeida",
    inicioPeriodoAquisitivo: "2020-05-20",
    fimPeriodoAquisitivo: "2021-05-19",
    limiteParaGozo: "2022-04-19",
    diasDeDireito: 30,
    diasGozados: 30,
    diasDeSaldo: 0,
  },
  {
    nomeColaborador: "Gabriela Lima",
    inicioPeriodoAquisitivo: "2023-08-01",
    fimPeriodoAquisitivo: "2024-07-31",
    limiteParaGozo: "2025-06-30",
    diasDeDireito: 30,
    diasGozados: 10,
    diasDeSaldo: 20,
  },
  {
    nomeColaborador: "Heitor Pereira",
    inicioPeriodoAquisitivo: "2022-11-01",
    fimPeriodoAquisitivo: "2023-10-31",
    limiteParaGozo: "2024-09-30",
    diasDeDireito: 30,
    diasGozados: 0,
    diasDeSaldo: 30,
  },
  {
    nomeColaborador: "Isabela Santos",
    inicioPeriodoAquisitivo: "2021-06-15",
    fimPeriodoAquisitivo: "2022-06-14",
    limiteParaGozo: "2023-05-14",
    diasDeDireito: 30,
    diasGozados: 30,
    diasDeSaldo: 0,
  },
  {
    nomeColaborador: "João Rodrigues",
    inicioPeriodoAquisitivo: "2024-02-20",
    fimPeriodoAquisitivo: "2025-02-19",
    limiteParaGozo: "2026-01-19",
    diasDeDireito: 30,
    diasGozados: 0,
    diasDeSaldo: 30,
  },
  {
    nomeColaborador: "Larissa Gomes",
    inicioPeriodoAquisitivo: "2023-05-01",
    fimPeriodoAquisitivo: "2024-04-30",
    limiteParaGozo: "2025-03-30",
    diasDeDireito: 30,
    diasGozados: 15,
    diasDeSaldo: 15,
  },
  {
    nomeColaborador: "Miguel Sousa",
    inicioPeriodoAquisitivo: "2022-09-10",
    fimPeriodoAquisitivo: "2023-09-09",
    limiteParaGozo: "2024-08-09",
    diasDeDireito: 30,
    diasGozados: 20,
    diasDeSaldo: 10,
  },
  {
    nomeColaborador: "Natália Azevedo",
    inicioPeriodoAquisitivo: "2021-12-01",
    fimPeriodoAquisitivo: "2022-11-30",
    limiteParaGozo: "2023-10-30",
    diasDeDireito: 30,
    diasGozados: 30,
    diasDeSaldo: 0,
  },
  {
    nomeColaborador: "Otávio Barbosa",
    inicioPeriodoAquisitivo: "2024-07-01",
    fimPeriodoAquisitivo: "2025-06-30",
    limiteParaGozo: "2026-05-30",
    diasDeDireito: 30,
    diasGozados: 0,
    diasDeSaldo: 30,
  },
];

const FeriasDetalheCard: React.FC<FeriasDetalheCardProps> = ({
  feriasData = sampleFeriasDetalheData, // Default to sample data
  cairoClassName,
  headerIcons,
  title = "Histórico de Férias" // Default title
}) => {
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
        {feriasData.length > 0 ? (
          feriasData.map((ferias, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg shadow-md bg-white">
              {/* The existing grid now starts with the collaborator's details */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {/* New Collaborator display */}
                <div className="flex flex-col col-span-2">
                  <span 
                    className="text-gray-800 font-medium text-sm truncate" 
                    title={ferias.nomeColaborador}
                  >
                    {ferias.nomeColaborador}
                  </span>
                  <span className="text-gray-500 font-light text-xs">Colaborador</span>
                </div>
                <div className="col-span-2 h-px bg-gray-200"></div> {/* Separator line after collaborator */}
                
                {/* Existing fields follow */}
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{ferias.inicioPeriodoAquisitivo || "-"}</span>
                  <span className="text-gray-500 font-light text-xs">Início Período Aquisitivo</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{ferias.fimPeriodoAquisitivo || "-"}</span>
                  <span className="text-gray-500 font-light text-xs">Fim Período Aquisitivo</span>
                </div>

                <div className="col-span-2 h-px bg-gray-200"></div>
                
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{ferias.limiteParaGozo || "-"}</span>
                  <span className="text-gray-500 font-light text-xs">Limite para Gozo</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{ferias.diasDeSaldo}</span>
                  <span className="text-gray-500 font-light text-xs">Dias de Saldo</span>
                </div>

                <div className="col-span-2 h-px bg-gray-200"></div>

                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{ferias.diasDeDireito}</span>
                  <span className="text-gray-500 font-light text-xs">Dias de Direito</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{ferias.diasGozados}</span>
                  <span className="text-gray-500 font-light text-xs">Dias Gozados</span>
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
