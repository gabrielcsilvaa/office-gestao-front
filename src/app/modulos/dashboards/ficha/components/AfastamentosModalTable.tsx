"use client";
import React, { useState, useMemo } from 'react';

// Interface for afastamento entries, matching 'Afastamento' from page.tsx
interface AfastamentoEntry {
  nomeColaborador: string;
  inicio: string;          // Expected format: "DD/MM/YYYY"
  termino: string;         // Expected format: "DD/MM/YYYY" or "N/A"
  tipo: string;
  diasAfastados: string;   // String representation of a number
  id?: string | number;     // Optional ID for a more stable key
}

interface AfastamentosModalTableProps {
  afastamentosData: AfastamentoEntry[];
  cairoClassName: string;
}

type SortKeyAfastamento = keyof AfastamentoEntry | null;
type SortDirectionAfastamento = 'ascending' | 'descending';

// Helper function to parse DD/MM/YYYY strings to Date objects (can be shared if in a utils file)
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
      if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
        return date;
      }
    }
  }
  return null;
};

const AfastamentosModalTable: React.FC<AfastamentosModalTableProps> = ({ afastamentosData, cairoClassName }) => {
  const [sortKey, setSortKey] = useState<SortKeyAfastamento>(null);
  const [sortDirection, setSortDirection] = useState<SortDirectionAfastamento>('ascending');

  const sortedData = useMemo(() => {
    let sortableItems = [...afastamentosData];
    if (sortKey !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        const isValANil = valA === null || valA === undefined || String(valA).toLowerCase() === 'n/a';
        const isValBNil = valB === null || valB === undefined || String(valB).toLowerCase() === 'n/a';

        if (isValANil && isValBNil) return 0;
        if (isValANil) return 1;
        if (isValBNil) return -1;

        if (sortKey === 'inicio' || sortKey === 'termino') {
          const dateA = parseDateString(String(valA));
          const dateB = parseDateString(String(valB));
          if (dateA === null && dateB === null) return 0;
          if (dateA === null) return 1;
          if (dateB === null) return -1;
          if (dateA.getTime() < dateB.getTime()) return sortDirection === 'ascending' ? -1 : 1;
          if (dateA.getTime() > dateB.getTime()) return sortDirection === 'ascending' ? 1 : -1;
          return 0;
        } else if (sortKey === 'diasAfastados') {
          const numA = parseFloat(String(valA));
          const numB = parseFloat(String(valB));
          if (isNaN(numA) && isNaN(numB)) return 0;
          if (isNaN(numA)) return 1;
          if (isNaN(numB)) return -1;
          if (numA < numB) return sortDirection === 'ascending' ? -1 : 1;
          if (numA > numB) return sortDirection === 'ascending' ? 1 : -1;
          return 0;
        } else { // nomeColaborador, tipo (string sort)
          const strA = String(valA).toLowerCase();
          const strB = String(valB).toLowerCase();
          if (strA < strB) return sortDirection === 'ascending' ? -1 : 1;
          if (strA > strB) return sortDirection === 'ascending' ? 1 : -1;
          return 0;
        }
      });
    }
    return sortableItems;
  }, [afastamentosData, sortKey, sortDirection]);

  const requestSort = (key: SortKeyAfastamento) => {
    let direction: SortDirectionAfastamento = 'ascending';
    if (sortKey === key && sortDirection === 'ascending') {
      direction = 'descending';
    } else if (sortKey === key && sortDirection === 'descending') {
      direction = 'ascending';
    }
    setSortKey(key);
    setSortDirection(direction);
  };

  const getSortIndicator = (key: SortKeyAfastamento) => {
    if (sortKey === key) {
      return sortDirection === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };

  if (!afastamentosData || afastamentosData.length === 0) {
    return (
      <div className="flex-1 min-h-[350px] flex flex-col items-center justify-center">
        <p className={`text-center text-gray-500 ${cairoClassName}`}>Nenhum dado de afastamentos para exibir.</p>
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
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('inicio')}>
                Início{getSortIndicator('inicio')}
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('termino')}>
                Término{getSortIndicator('termino')}
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('tipo')}>
                Tipo{getSortIndicator('tipo')}
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('diasAfastados')}>
                Dias Afastados{getSortIndicator('diasAfastados')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((afastamento, index) => (
              <tr key={afastamento.id || `afastamento-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{afastamento.nomeColaborador}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{afastamento.inicio}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{afastamento.termino}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{afastamento.tipo}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{afastamento.diasAfastados}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AfastamentosModalTable;
