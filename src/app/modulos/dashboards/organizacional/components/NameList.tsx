import React from 'react';

interface NameBarItem {
  name: string;
  barPixelWidth: number; // Added
  value: string;
}

interface NameListProps {
  items: NameBarItem[];
  cairoClassName: string;
}

const NameList: React.FC<NameListProps> = ({ items, cairoClassName }) => {
  return (
    <div className="space-y-2 py-2"> {/* Increased spacing for items with bars */}
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3"> {/* Changed to items-start */}
          <div
            title={item.name} // Tooltip for the full name
            className={`w-24 flex-shrink-0 h-auto p-1 text-neutral-700 text-xs font-normal ${cairoClassName} whitespace-nowrap overflow-hidden text-ellipsis`} // Added flex-shrink-0 to ensure the div strictly adheres to w-24
          >
            {item.name}
          </div>
          <div 
            className={`h-4 bg-emerald-500 rounded-sm`} 
            style={{ width: `${item.barPixelWidth}px` }} // Applied inline style for width
          ></div> {/* Bar element, added rounded-sm */}
          <div className={`text-neutral-700 text-xs font-normal ${cairoClassName} whitespace-nowrap`}> {/* Value display */}
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NameList;
