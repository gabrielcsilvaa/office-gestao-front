import React from 'react';

interface NameBarItem {
  name: string;
  barPixelWidth: number; 
  value: string;
  barColor: string; // Added barColor property
}

interface NameListProps {
  items: NameBarItem[];
  cairoClassName: string;
}

const NameList: React.FC<NameListProps> = ({ items, cairoClassName }) => {
  return (
    <div className="space-y-2 py-2"> 
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3"> 
          <div
            title={item.name} 
            className={`w-24 flex-shrink-0 h-auto p-1 text-neutral-700 text-xs font-normal ${cairoClassName} whitespace-nowrap overflow-hidden text-ellipsis`} 
          >
            {item.name}
          </div>
          <div 
            className={`h-4 rounded-sm`} // Removed bg-emerald-500
            style={{ 
              width: `${item.barPixelWidth}px`,
              backgroundColor: item.barColor // Applied dynamic background color
            }} 
          ></div> 
          <div className={`text-neutral-700 text-xs font-normal ${cairoClassName} whitespace-nowrap`}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NameList;
