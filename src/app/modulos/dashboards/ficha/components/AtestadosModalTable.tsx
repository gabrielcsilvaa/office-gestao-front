"use client";
import React, { useState, useEffect, useMemo } from 'react';

// Interface for exam entries, matching the 'Exame' type from page.tsx
interface ExameEntry {
  nomeColaborador: string;
  dataExame: string;       // Expected format: "DD/MM/YYYY"
  vencimento: string;      // Expected format: "DD/MM/YYYY" or "N/A"
  tipo: string;
  resultado: string;
  // Add an optional id if your data source provides one for a more stable key
  id?: string | number; 
}

interface AtestadosModalTableProps {
  atestadosData: ExameEntry[];
  cairoClassName: string;
}

type SortKey = keyof ExameEntry | null;
type SortDirection = 'ascending' | 'descending';

// Helper function to parse DD/MM/YYYY strings to Date objects
const parseDateString = (dateStr: string): Date | null => {
  if (!dateStr || typeof dateStr !== 'string' || dateStr.toLowerCase() === 'n/a') {
    return null;
  }
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const date = new Date(year, month, day);
      // Validate if the parsed date is a real date (e.g., not Feb 30)
      if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
        return date;
      }
    }
  }
  return null; // Invalid date format or value
};

const AtestadosModalTable: React.FC<AtestadosModalTableProps> = ({ atestadosData, cairoClassName }) => {
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending');
  
  // Use useMemo for sortedData to avoid re-sorting on every render unless dependencies change
  const sortedData = useMemo(() => {
    let sortableItems = [...atestadosData];
    if (sortKey !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        // Handle null, undefined, or "N/A" by pushing them to the end
        const isValANil = valA === null || valA === undefined || String(valA).toLowerCase() === 'n/a';
        const isValBNil = valB === null || valB === undefined || String(valB).toLowerCase() === 'n/a';

        if (isValANil && isValBNil) return 0;
        if (isValANil) return 1; // a is nil, b is not, so a comes after b
        if (isValBNil) return -1; // b is nil, a is not, so a comes before b

        if (sortKey === 'dataExame' || sortKey === 'vencimento') {
          const dateA = parseDateString(String(valA));
          const dateB = parseDateString(String(valB));

          if (dateA === null && dateB === null) return 0;
          if (dateA === null) return 1; // Treat null dates as "later"
          if (dateB === null) return -1; // Treat null dates as "later"

          if (dateA.getTime() < dateB.getTime()) {
            return sortDirection === 'ascending' ? -1 : 1;
          }
          if (dateA.getTime() > dateB.getTime()) {
            return sortDirection === 'ascending' ? 1 : -1;
          }
          return 0;
        } else {
          // Default string comparison (case-insensitive)
          const strA = String(valA).toLowerCase();
          const strB = String(valB).toLowerCase();
          if (strA < strB) {
            return sortDirection === 'ascending' ? -1 : 1;
          }
          if (strA > strB) {
            return sortDirection === 'ascending' ? 1 : -1;
          }
          return 0;
        }
      });
    }
    return sortableItems;
  }, [atestadosData, sortKey, sortDirection]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'ascending';
    if (sortKey === key && sortDirection === 'ascending') {
      direction = 'descending';
    }
    // If clicking a new column, always start with ascending
    // If clicking the same column that was descending, switch to ascending
    else if (sortKey === key && sortDirection === 'descending') {
       direction = 'ascending'; // Or reset/remove sort: setSortKey(null);
    }
    setSortKey(key);
    setSortDirection(direction);
  };

  const getSortIndicator = (key: SortKey) => {
    if (sortKey === key) {
      return sortDirection === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };

  // Fallback for empty data, ensuring consistent height
  if (!atestadosData || atestadosData.length === 0) {
    return (
      <div className="flex-1 min-h-[350px] flex flex-col items-center justify-center">
        <p className={`text-center text-gray-500 ${cairoClassName}`}>Nenhum dado de exames para exibir.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-[350px] flex flex-col">
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-gray-200 ${cairoClassName}`}>
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('nomeColaborador')}>
                Funcionário{getSortIndicator('nomeColaborador')}
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('dataExame')}>
                Data Exame{getSortIndicator('dataExame')}
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('vencimento')}>
                Vencimento{getSortIndicator('vencimento')}
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('tipo')}>
                Tipo{getSortIndicator('tipo')}
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('resultado')}>
                Resultado{getSortIndicator('resultado')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((exame, index) => (
              <tr key={exame.id || `exame-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{exame.nomeColaborador}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{exame.dataExame}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{exame.vencimento}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{exame.tipo}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{exame.resultado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AtestadosModalTable;
