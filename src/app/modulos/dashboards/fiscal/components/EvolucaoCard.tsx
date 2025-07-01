import React from 'react';
import Image from "next/image";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface EvolucaoCardProps {
  title: string;
  onMaximize?: () => void;
}

const EvolucaoCard: React.FC<EvolucaoCardProps> = ({ title, onMaximize }) => {
  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow-md relative overflow-hidden">
      {/* Barra vertical ao lado do título */}
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      
      {/* Header com título e ícone de maximizar */}
      <div className="flex justify-between items-start pt-[14px] px-5 mb-3 flex-shrink-0">
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

      {/* Conteúdo do card */}
      <div className="flex-1 px-5 pb-5 min-h-0 overflow-y-auto">
        <div className="h-full flex items-center justify-center text-gray-500">
          <p className={`text-sm ${cairo.className}`}>Conteúdo em desenvolvimento...</p>
        </div>
      </div>
    </div>
  );
};

export default EvolucaoCard;
