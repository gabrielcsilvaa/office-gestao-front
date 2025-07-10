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

  const getBarColor = (percentage: number, isHovered: boolean) => {
    const opacity = isHovered ? 0.9 : 0.7;
    const intensity = Math.max(0.4, percentage / 100);
    return `rgba(249, 115, 22, ${opacity * intensity})`; // Cor laranja
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
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex-1 min-w-0 mr-4">
                  {/* Nome da empresa */}
                  <div className={`text-sm font-medium text-gray-900 truncate ${cairo.className}`}>
                    {item.empresa}
                  </div>
                  
                  {/* Barra de progresso */}
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: getBarColor(item.percentage, hoveredIndex === index),
                      }}
                    />
                  </div>
                </div>
                
                {/* Valor em reais */}
                <div className={`text-sm font-semibold text-gray-900 whitespace-nowrap ${cairo.className}`}>
                  {item.valor}
                </div>
              </div>
            ))}
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
