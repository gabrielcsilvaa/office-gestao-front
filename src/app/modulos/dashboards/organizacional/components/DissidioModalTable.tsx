"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { dissidioTableData } from './DissidioCard';

interface DissidioRecord {
  sindicato: string;
  mesBase: string;
}

interface DissidioModalTableProps {
  data: DissidioRecord[];
  cairoClassName: string;
  onSortedDataChange?: (sortedData: DissidioRecord[]) => void;
  onSortInfoChange?: (sortInfo: string) => void;
}

type SortKey = keyof DissidioRecord | null;
type SortDirection = 'ascending' | 'descending';

const getSortDisplayText = (sortKey: SortKey, sortDirection: SortDirection): string => {
  if (!sortKey) return 'Padrão (sem ordenação específica)';
  const names: Record<string,string> = { sindicato: 'Sindicato', mesBase: 'Mês Base' };
  const direction = sortDirection === 'ascending' ? 'Crescente' : 'Decrescente';
  return `Por ${names[sortKey] || sortKey} (${direction})`;
};

const DissidioModalTable: React.FC<DissidioModalTableProps> = ({ data, cairoClassName, onSortedDataChange, onSortInfoChange }) => {
  const monthMap: Record<string, number> = {
    janeiro: 1, fevereiro: 2, março: 3, abril: 4, maio: 5, junho: 6,
    julho: 7, agosto: 8, setembro: 9, outubro: 10, novembro: 11, dezembro: 12
  };

  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending');
  
  const sortedData = useMemo(() => {
    const items = [...data];
    if (sortKey) {
      items.sort((a,b) => {
        const aVal = a[sortKey!];
        const bVal = b[sortKey!];
        let cmp = 0;

        if (sortKey === 'mesBase') {
          const aNum = monthMap[String(aVal).toLowerCase()] || 0;
          const bNum = monthMap[String(bVal).toLowerCase()] || 0;
          cmp = aNum - bNum;
        } else {
          if (aVal < bVal) cmp = -1;
          else if (aVal > bVal) cmp = 1;
        }

        return sortDirection === 'ascending' ? cmp : -cmp;
      });
    }
    return items;
  }, [data, sortKey, sortDirection]);

  useEffect(() => { onSortedDataChange?.(sortedData); }, [sortedData, onSortedDataChange]);
  useEffect(() => { onSortInfoChange?.(getSortDisplayText(sortKey, sortDirection)); }, [sortKey, sortDirection, onSortInfoChange]);

  const requestSort = (key: SortKey) => {
    let dir: SortDirection = 'ascending';
    if (sortKey === key && sortDirection === 'ascending') dir = 'descending';
    setSortKey(key);
    setSortDirection(dir);
  };

  return (
    <div className="flex flex-col flex-1 min-h-[350px] w-full">  
      <div className="overflow-x-auto w-full">
        <table className={`min-w-full w-full divide-y divide-gray-200 ${cairoClassName}`}>  
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('sindicato')}>
                Sindicato{sortKey==='sindicato'?(sortDirection==='ascending'?' ▲':' ▼'):''}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('mesBase')}>
                Mês Base{sortKey==='mesBase'?(sortDirection==='ascending'?' ▲':' ▼'):''}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item,i) => (
              <tr key={i} className={i%2===0?'bg-white':'bg-gray-50'}>
                <td className="px-4 py-3 whitespace-normal text-sm text-gray-700">{item.sindicato}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.mesBase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DissidioModalTable;
