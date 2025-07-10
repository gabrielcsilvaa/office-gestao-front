import React, { useState } from 'react';
import Image from "next/image";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface ImpostosDevidosItem {
  empresa: string;
  valor: string;
  numericValue: number;
  percentage: number;
}

interface ImpostosDevidosCardProps {
  title: string;
  items: ImpostosDevidosItem[];
  onMaximize?: () => void;
}

const ImpostosDevidosCard: React.FC<ImpostosDevidosCardProps> = ({ 
  title, 
  items,
  onMaximize 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getBarColor = () => {
    return "rgba(59, 130, 246, 0.28)"; // Cor padrão azul sem variação de opacidade
  };

  return (
    <div className="w-full h-[489px] bg-white rounded-lg shadow-md relative overflow-hidden flex flex-col">
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
        {items.length > 0 ? (
          <div className="flex flex-col gap-3">
            {items.map((item, index) => {
              const isHovered = hoveredIndex === index;
              
              return (
                <div
                  key={index}
                  className={`group relative flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 ${cairo.className}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Nome */}
                  <div className="flex-shrink-0 w-48">
                    <div 
                      className={`text-xs font-medium text-gray-700 leading-tight ${isHovered ? 'text-gray-900' : ''}`}
                      title={item.empresa}
                    >
                      {item.empresa.length > 35 ? `${item.empresa.substring(0, 35)}...` : item.empresa}
                    </div>
                  </div>

                  {/* Barra */}
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: getBarColor()
                        }}
                      />
                    </div>
                    
                    {/* Valor */}
                    <div className="flex-shrink-0 w-28 text-right flex items-center justify-end">
                      <div className={`text-xs font-semibold text-gray-800 ${isHovered ? 'text-gray-900' : ''}`}>
                        {item.valor}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p className={`text-center ${cairo.className}`}>
              Selecione um período para visualizar os dados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpostosDevidosCard;
