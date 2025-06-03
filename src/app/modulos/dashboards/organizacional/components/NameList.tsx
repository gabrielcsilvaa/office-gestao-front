import React from 'react';

interface NameBarItem {
  name: string;
  barPixelWidth: number; 
  value: string;
  barColor: string; 
}

interface NameListProps {
  items: NameBarItem[];
  cairoClassName: string;
}

const NameList: React.FC<NameListProps> = ({ items, cairoClassName }) => {
  return (
    <div className="flex flex-col justify-evenly h-full"> 
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3"> 
          <div
            title={item.name} 
            className={`w-24 flex-shrink-0 h-auto p-1 text-neutral-700 text-xs font-normal ${cairoClassName} whitespace-nowrap overflow-hidden text-ellipsis`} 
          >
            {item.name}
          </div>
          <div 
            className={`h-4 rounded-sm`} 
            style={{ 
              width: `${item.barPixelWidth}px`,
              backgroundColor: item.barColor 
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
