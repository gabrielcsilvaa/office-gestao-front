import React, { useState } from 'react';
import Image from "next/image";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface EmptyCardProps {
  title: string;
  onMaximize?: () => void;
}

type ViewType = 'quantidade' | 'valor';

const EmptyCard: React.FC<EmptyCardProps> = ({ title, onMaximize }) => {
  const [selectedView, setSelectedView] = useState<ViewType>('quantidade');
  return (
    <div className="w-full bg-white rounded-lg shadow-md relative overflow-hidden h-[400px]">
      {/* Barra vertical ao lado do título */}
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      
      {/* Header com título e ícone de maximizar */}
      <div className="flex justify-between items-start pt-[14px] px-5 mb-2 flex-shrink-0">
        <div className="flex-grow overflow-hidden mr-3">
          <div title={title} className={`text-black text-xl font-semibold leading-normal ${cairo.className} whitespace-nowrap overflow-hidden text-ellipsis`}>
            {title}
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="cursor-pointer p-1">
            <Image
              src="/assets/icons/icon-maximize.svg"
              alt="Maximize"
              width={16}
              height={16}
              className="opacity-60 hover:opacity-100"
              onClick={onMaximize}
            />
          </div>
        </div>
      </div>

      {/* Switch Quantidade/Valor */}
      <div className="px-5 mb-3 flex-shrink-0">
        <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setSelectedView('quantidade')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${cairo.className} ${
              selectedView === 'quantidade'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Quantidade
          </button>
          <button
            onClick={() => setSelectedView('valor')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${cairo.className} ${
              selectedView === 'valor'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Valor
          </button>
        </div>
      </div>

      {/* Conteúdo do card - Texto informativo */}
      <div className="flex-1 px-5 pb-5 flex flex-col items-center justify-center">
        <div className={`text-gray-500 text-lg ${cairo.className} mb-2`}>
          Sem conteúdo por enquanto
        </div>
        <div className={`text-gray-400 text-sm ${cairo.className}`}>
          Visualizando: {selectedView === 'quantidade' ? 'Quantidade' : 'Valor'}
        </div>
      </div>
    </div>
  );
};

export default EmptyCard;
