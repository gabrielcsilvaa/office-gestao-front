import React, { useState } from 'react';

interface BarItem {
  name: string;
  value: string;
  numericValue: number;
  percentage: number;
  rank: number;
}

interface ModernBarChartProps {
  items: BarItem[];
  cairoClassName: string;
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange';
}

const ModernBarChart: React.FC<ModernBarChartProps> = ({ 
  items, 
  cairoClassName, 
  colorScheme = 'blue' 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getColorScheme = (scheme: string, percentage: number, isHovered: boolean) => {
    const opacity = isHovered ? 0.9 : 0.7;
    const intensity = Math.max(0.4, percentage / 100); // Garante cor mínima visível
    
    switch (scheme) {
      case 'blue':
        return `rgba(59, 130, 246, ${opacity * intensity})`; // Blue-500
      case 'green':
        return `rgba(34, 197, 94, ${opacity * intensity})`; // Green-500
      case 'purple':
        return `rgba(168, 85, 247, ${opacity * intensity})`; // Purple-500
      case 'orange':
        return `rgba(249, 115, 22, ${opacity * intensity})`; // Orange-500
      default:
        return `rgba(59, 130, 246, ${opacity * intensity})`;
    }  };

  return (
    <div className="flex flex-col gap-3 h-full py-2">
      {items.map((item, index) => {
        const isHovered = hoveredIndex === index;
        const barColor = getColorScheme(colorScheme, item.percentage, isHovered);
        
        return (
          <div
            key={index}
            className={`group relative flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 ${cairoClassName}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}          >
            {/* Nome */}
            <div className="flex-shrink-0 w-40">
              <div 
                className={`text-xs font-medium text-gray-700 leading-tight ${isHovered ? 'text-gray-900' : ''}`}
              >
                {item.name}
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
              <div className="flex-shrink-0 w-20 text-right">
                <div className={`text-xs font-semibold text-gray-800 ${isHovered ? 'text-gray-900' : ''}`}>
                  {item.value}
                </div>
                <div className={`text-xs text-gray-500 ${isHovered ? 'text-gray-600' : ''}`}>
                  {item.percentage.toFixed(1)}%
                </div>              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ModernBarChart;
