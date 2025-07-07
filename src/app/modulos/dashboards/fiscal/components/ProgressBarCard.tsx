import React, { useState } from 'react';
import Image from "next/image";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface ProgressBarItem {
  name: string;
  value: string;
  numericValue: number;
  percentage: number;
  rank: number;
}

interface ProgressBarCardProps {
  title: string;
  items: ProgressBarItem[];
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange';
  onMaximize?: () => void;
}

const ProgressBarCard: React.FC<ProgressBarCardProps> = ({ 
  title, 
  items, 
  colorScheme = 'blue',
  onMaximize 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getColorScheme = (scheme: string, percentage: number, isHovered: boolean) => {
    const opacity = isHovered ? 0.9 : 0.7;
    const intensity = Math.max(0.4, percentage / 100);
    
    switch (scheme) {
      case 'blue':
        return `rgba(59, 130, 246, ${opacity * intensity})`;
      case 'green':
        return `rgba(34, 197, 94, ${opacity * intensity})`;
      case 'purple':
        return `rgba(168, 85, 247, ${opacity * intensity})`;
      case 'orange':
        return `rgba(249, 115, 22, ${opacity * intensity})`;
      default:
        return `rgba(59, 130, 246, ${opacity * intensity})`;
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md relative overflow-hidden h-[400px]">
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

      {/* Conteúdo do card - Barras de Progresso */}
      <div className="absolute inset-x-0 top-[70px] bottom-0 overflow-y-auto">
        <div className="flex flex-col gap-3 p-5 pt-2">
          {items.map((item, index) => {
            const isHovered = hoveredIndex === index;
            const barColor = getColorScheme(colorScheme, item.percentage, isHovered);
            
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
                    title={item.name} // Tooltip para nomes longos
                  >
                    {item.name.length > 35 ? `${item.name.substring(0, 35)}...` : item.name}
                  </div>
                </div>

                {/* Barra */}
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: barColor
                      }}
                    />
                  </div>
                  
                  {/* Valor */}
                  <div className="flex-shrink-0 w-28 text-right">
                    <div className={`text-xs font-semibold text-gray-800 ${isHovered ? 'text-gray-900' : ''}`}>
                      {item.value}
                    </div>
                    <div className={`text-xs text-gray-500 ${isHovered ? 'text-gray-600' : ''}`}>
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBarCard;
