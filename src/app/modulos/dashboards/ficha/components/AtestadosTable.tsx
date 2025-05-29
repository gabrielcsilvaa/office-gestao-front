import React from 'react';
import Image from 'next/image'; // Import Image

interface Atestado {
  vencimento: string;
  dataExame: string;
  resultado: string;
  tipo: string;
}

interface IconProps {
  src: string;
  alt: string;
  adjustSize?: boolean; // Kept for consistency, though might not be used here
}

interface AtestadosTableProps {
  atestadosData: Atestado[];
  cairoClassName: string;
  headerIcons?: IconProps[]; // Add headerIcons prop
}

const AtestadosTable: React.FC<AtestadosTableProps> = ({ atestadosData, cairoClassName, headerIcons }) => {
  return (
    <div className="w-full bg-white rounded-lg border border-neutral-700 relative flex flex-col overflow-hidden h-full"> {/* Removido py-4 pr-4 pl-2 */}
      {/* Barra vertical cinza - igual aos outros cards da página de ficha */}
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      
      {/* Header Section - Alinhado com EvolucaoCard */}
      <div className="flex justify-between items-start pt-[14px] px-5 mb-3 flex-shrink-0"> {/* Aplicado pt-[14px] px-5 */}
        <div className="flex-grow overflow-hidden mr-3">
          <div title="Histórico de Atestados" className={`text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap overflow-hidden text-ellipsis`}>
            Histórico de Atestados
          </div>
        </div>
        {/* Icons Area */}
        {headerIcons && headerIcons.length > 0 && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            {headerIcons.map((icon, index) => (
              <div key={index} className="cursor-pointer p-1"> {/* Added padding for better click area */}
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={16} // Standard size for these icons
                  height={16}
                  className="opacity-60 hover:opacity-100" // Added hover effect
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content Area - com padding próprio */}
      <div className={`flex-1 overflow-y-auto min-h-0 space-y-4 pl-4 pr-1 pb-4 ${cairoClassName}`}> {/* Alterado space-y-3 para space-y-4 */}
        {atestadosData.length > 0 ? (
          atestadosData.map((atestado, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg shadow-md bg-white"> {/* Alterado shadow-sm para shadow-md */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{atestado.vencimento || "-"}</span>
                  <span className="text-gray-500 font-light text-xs">Vencimento</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{atestado.resultado || "N/A"}</span>
                  <span className="text-gray-500 font-light text-xs">Resultado</span>
                </div>

                {/* Horizontal Separator Line */}
                <div className="col-span-2 h-px bg-gray-200"></div>
                
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{atestado.dataExame || "-"}</span>
                  <span className="text-gray-500 font-light text-xs">Data Exame</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm truncate">{atestado.tipo || "-"}</span>
                  <span className="text-gray-500 font-light text-xs">Tipo</span>
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className={`flex items-center justify-center h-full text-gray-500 ${cairoClassName}`}>
            Nenhum atestado encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default AtestadosTable;
