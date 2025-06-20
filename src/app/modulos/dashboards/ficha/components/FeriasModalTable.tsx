"use client";
import React, { useState, useMemo } from 'react';

// Interface for ferias entries, matching 'FormattedFerias' from page.tsx
interface FeriasEntryModal {
  nomeColaborador: string;
  inicioPeriodoAquisitivo: string; // Expected format: "DD/MM/YYYY"
  fimPeriodoAquisitivo: string;    // Expected format: "DD/MM/YYYY"
  inicioPeriodoGozo: string;       // Expected format: "DD/MM/YYYY" or "N/A"
  fimPeriodoGozo: string;          // Expected format: "DD/MM/YYYY" or "N/A"
  limiteParaGozo: string;          // Expected format: "DD/MM/YYYY"
  diasDeDireito: number;
  diasGozados: number;
  diasDeSaldo: number;
  id?: string | number;             // Optional ID for a more stable key
}

interface FeriasModalTableProps {
  feriasData: FeriasEntryModal[];
  cairoClassName: string;
}

type SortKeyFerias = keyof FeriasEntryModal | null;
type SortDirectionFerias = 'ascending' | 'descending';

// Helper function to parse DD/MM/YYYY strings to Date objects
const parseDateString = (dateStr: string): Date | null => {
  if (!dateStr || typeof dateStr !== 'string' || dateStr.toLowerCase() === 'n/a' || dateStr.trim() === "") {
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

const FeriasModalTable: React.FC<FeriasModalTableProps> = ({ feriasData, cairoClassName }) => {
  const [sortKey, setSortKey] = useState<SortKeyFerias>(null);
  const [sortDirection, setSortDirection] = useState<SortDirectionFerias>('ascending');

  const sortedData = useMemo(() => {
    let sortableItems = [...feriasData];
    if (sortKey !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        const isValANil = valA === null || valA === undefined || String(valA).toLowerCase() === 'n/a' || String(valA).trim() === "";
        const isValBNil = valB === null || valB === undefined || String(valB).toLowerCase() === 'n/a' || String(valB).trim() === "";

        if (isValANil && isValBNil) return 0;
        if (isValANil) return 1;
        if (isValBNil) return -1;
        
        if (sortKey === 'inicioPeriodoAquisitivo' || sortKey === 'fimPeriodoAquisitivo' || sortKey === 'inicioPeriodoGozo' || sortKey === 'fimPeriodoGozo' || sortKey === 'limiteParaGozo') {
          const dateA = parseDateString(String(valA));
          const dateB = parseDateString(String(valB));
          if (dateA === null && dateB === null) return 0;
          if (dateA === null) return 1;
          if (dateB === null) return -1;
          if (dateA.getTime() < dateB.getTime()) return sortDirection === 'ascending' ? -1 : 1;
          if (dateA.getTime() > dateB.getTime()) return sortDirection === 'ascending' ? 1 : -1;
          return 0;
        } else if (sortKey === 'diasDeDireito' || sortKey === 'diasGozados' || sortKey === 'diasDeSaldo') {
          const numA = Number(valA);
          const numB = Number(valB);
          if (isNaN(numA) && isNaN(numB)) return 0;
          if (isNaN(numA)) return 1;
          if (isNaN(numB)) return -1;
          if (numA < numB) return sortDirection === 'ascending' ? -1 : 1;
          if (numA > numB) return sortDirection === 'ascending' ? 1 : -1;
          return 0;
        } else { // nomeColaborador (string sort)
          const strA = String(valA).toLowerCase();
          const strB = String(valB).toLowerCase();
          if (strA < strB) return sortDirection === 'ascending' ? -1 : 1;
          if (strA > strB) return sortDirection === 'ascending' ? 1 : -1;
          return 0;
        }
      });
    }
    return sortableItems;
  }, [feriasData, sortKey, sortDirection]);

  const requestSort = (key: SortKeyFerias) => {
    let direction: SortDirectionFerias = 'ascending';
    if (sortKey === key && sortDirection === 'ascending') {
      direction = 'descending';
    } else if (sortKey === key && sortDirection === 'descending') {
      direction = 'ascending';
    }
    setSortKey(key);
    setSortDirection(direction);
  };

  const getSortIndicator = (key: SortKeyFerias) => {
    if (sortKey === key) {
      return sortDirection === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };

  if (!feriasData || feriasData.length === 0) {
    return (
      <div className="flex-1 min-h-[350px] flex flex-col items-center justify-center">
        <p className={`text-center text-gray-500 ${cairoClassName}`}>Nenhum detalhe de férias para exibir.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-[350px] flex flex-col">
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-gray-200 ${cairoClassName}`}>
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('nomeColaborador')}>
                Funcionário{getSortIndicator('nomeColaborador')}
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('inicioPeriodoAquisitivo')}>
                Início Aquisitivo{getSortIndicator('inicioPeriodoAquisitivo')}
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('fimPeriodoAquisitivo')}>
                Fim Aquisitivo{getSortIndicator('fimPeriodoAquisitivo')}
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('inicioPeriodoGozo')}>
                Início Gozo{getSortIndicator('inicioPeriodoGozo')}
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('fimPeriodoGozo')}>
                Fim Gozo{getSortIndicator('fimPeriodoGozo')}
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('limiteParaGozo')}>
                Limite Gozo{getSortIndicator('limiteParaGozo')}
              </th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('diasDeDireito')}>
                Dias Direito{getSortIndicator('diasDeDireito')}
              </th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('diasGozados')}>
                Dias Gozados{getSortIndicator('diasGozados')}
              </th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('diasDeSaldo')}>
                Dias Saldo{getSortIndicator('diasDeSaldo')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((ferias, index) => (
              <tr key={ferias.id || `ferias-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{ferias.nomeColaborador}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{ferias.inicioPeriodoAquisitivo}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{ferias.fimPeriodoAquisitivo}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{ferias.inicioPeriodoGozo || "N/A"}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{ferias.fimPeriodoGozo || "N/A"}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{ferias.limiteParaGozo}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{ferias.diasDeDireito}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{ferias.diasGozados}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{ferias.diasDeSaldo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeriasModalTable;
