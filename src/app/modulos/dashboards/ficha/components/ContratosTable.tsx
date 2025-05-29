import React from 'react';
import Image from 'next/image'; // Import Image

interface Contrato {
  id: string; // For React key
  empresa: string;
  colaborador: string;
  dataAdmissao: string;
  dataRescisao?: string; // Optional
  salarioBase?: string; // Added Salário Base, optional
}

interface IconProps {
  src: string;
  alt: string;
  adjustSize?: boolean;
}

interface ContratosTableProps {
  contratosData: Contrato[];
  cairoClassName: string;
  headerIcons?: IconProps[]; // Add headerIcons prop
}

const ContratosTable: React.FC<ContratosTableProps> = ({ contratosData, cairoClassName, headerIcons }) => {
  return (
    <div className="w-full bg-white rounded-lg border border-neutral-700 relative flex flex-col overflow-hidden h-full">
      {/* Barra vertical cinza - igual aos outros cards da página de ficha */}
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      
      {/* Header Section */}
      <div className="flex justify-between items-start pt-[14px] px-5 mb-3 flex-shrink-0">
        <div className="flex-grow overflow-hidden mr-3">
          <div title="Histórico de Contratos" className={`text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap overflow-hidden text-ellipsis`}>
            Histórico de Contratos
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
        {contratosData.length > 0 ? (
          contratosData.map((contrato) => (
            <div key={contrato.id} className="p-3 border border-gray-200 rounded-lg shadow-md bg-white">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                
                {/* Linha 1: Colaborador (full width) */}
                <div className="flex flex-col col-span-2">
                  <span className="text-gray-800 font-medium text-sm truncate" title={contrato.colaborador}>{contrato.colaborador || "-"}</span>
                  <span className="text-gray-500 font-light text-xs">Colaborador</span>
                </div>
                
                {/* Horizontal Separator Line - Moved after Colaborador */}
                <div className="col-span-2 h-px bg-gray-200"></div>

                {/* Linha 2: Empresa | Data Admissão */}
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate" title={contrato.empresa}>{contrato.empresa || "-"}</span>
                  <span className="text-gray-500 font-light text-xs">Empresa</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{contrato.dataAdmissao || "-"}</span>
                  <span className="text-gray-500 font-light text-xs">Data Admissão</span>
                </div>
                
                {/* Linha 3: Data Rescisão | Salário Base */}
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{contrato.dataRescisao || "Vigente"}</span>
                  <span className="text-gray-500 font-light text-xs">Data Rescisão</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{contrato.salarioBase || "-"}</span>
                  <span className="text-gray-500 font-light text-xs">Salário Base</span>
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className={`flex items-center justify-center h-full text-gray-500 ${cairoClassName}`}>
            Nenhum contrato encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContratosTable;
