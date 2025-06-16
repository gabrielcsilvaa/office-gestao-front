"use client";
import React, { useState, useMemo } from 'react';

// Interface for alteracao salarial entries, matching 'FormattedAlteracao' from page.tsx
interface AlteracaoSalarialEntryModal {
  nomeColaborador: string;
  competencia: string; // Expected format: "DD/MM/YYYY"
  motivo: string;
  salarioAnterior: number | null;
  salarioNovo: number;
  percentual: string; // Expected format: "X.X%" or ""
  id?: string | number; // Optional ID for a more stable key
}

interface AlteracoesSalariaisModalTableProps {
  alteracoesData: AlteracaoSalarialEntryModal[];
  cairoClassName: string;
}

type SortKeyAlteracao = keyof AlteracaoSalarialEntryModal | null;
type SortDirectionAlteracao = 'ascending' | 'descending';

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

// Helper function to parse percentage strings like "10.5%" to numbers
const parsePercentageString = (percentageStr: string): number | null => {
  if (!percentageStr || typeof percentageStr !== 'string' || percentageStr.trim() === "" || percentageStr.trim() === "-") {
    return null;
  }
  const cleanedString = percentageStr.replace("%", "").trim();
  const num = parseFloat(cleanedString);
  return isNaN(num) ? null : num;
};

const formatCurrencyForTable = (value: number | null) =>
  value !== null
    ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : "N/A";

const AlteracoesSalariaisModalTable: React.FC<AlteracoesSalariaisModalTableProps> = ({ alteracoesData, cairoClassName }) => {
  const [sortKey, setSortKey] = useState<SortKeyAlteracao>(null);
  const [sortDirection, setSortDirection] = useState<SortDirectionAlteracao>('ascending');

  const sortedData = useMemo(() => {
    let sortableItems = [...alteracoesData];
    if (sortKey !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        const isValANil = valA === null || valA === undefined || String(valA).toLowerCase() === 'n/a' || String(valA).trim() === "" || (sortKey === 'percentual' && String(valA).trim() === "-");
        const isValBNil = valB === null || valB === undefined || String(valB).toLowerCase() === 'n/a' || String(valB).trim() === "" || (sortKey === 'percentual' && String(valB).trim() === "-");

        if (isValANil && isValBNil) return 0;
        if (isValANil) return 1;
        if (isValBNil) return -1;

        if (sortKey === 'competencia') {
          const dateA = parseDateString(String(valA));
          const dateB = parseDateString(String(valB));
          if (dateA === null && dateB === null) return 0;
          if (dateA === null) return 1;
          if (dateB === null) return -1;
          if (dateA.getTime() < dateB.getTime()) return sortDirection === 'ascending' ? -1 : 1;
          if (dateA.getTime() > dateB.getTime()) return sortDirection === 'ascending' ? 1 : -1;
          return 0;
        } else if (sortKey === 'salarioAnterior' || sortKey === 'salarioNovo') {
          const numA = Number(valA); // Already number or null
          const numB = Number(valB); // Already number or null
          if (numA < numB) return sortDirection === 'ascending' ? -1 : 1;
          if (numA > numB) return sortDirection === 'ascending' ? 1 : -1;
          return 0;
        } else if (sortKey === 'percentual') {
          const percA = parsePercentageString(String(valA));
          const percB = parsePercentageString(String(valB));
          if (percA === null && percB === null) return 0;
          if (percA === null) return 1;
          if (percB === null) return -1;
          if (percA < percB) return sortDirection === 'ascending' ? -1 : 1;
          if (percA > percB) return sortDirection === 'ascending' ? 1 : -1;
          return 0;
        } else { // nomeColaborador, motivo (string sort)
          const strA = String(valA).toLowerCase();
          const strB = String(valB).toLowerCase();
          if (strA < strB) return sortDirection === 'ascending' ? -1 : 1;
          if (strA > strB) return sortDirection === 'ascending' ? 1 : -1;
          return 0;
        }
      });
    }
    return sortableItems;
  }, [alteracoesData, sortKey, sortDirection]);

  const requestSort = (key: SortKeyAlteracao) => {
    let direction: SortDirectionAlteracao = 'ascending';
    if (sortKey === key && sortDirection === 'ascending') {
      direction = 'descending';
    } else if (sortKey === key && sortDirection === 'descending') {
      direction = 'ascending';
    }
    setSortKey(key);
    setSortDirection(direction);
  };

  const getSortIndicator = (key: SortKeyAlteracao) => {
    if (sortKey === key) {
      return sortDirection === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };
  
  // Mantendo a estrutura de altura mínima e mensagem de "sem dados"
  if (!alteracoesData || alteracoesData.length === 0) {
    return (
      <div className="flex-1 min-h-[350px] flex flex-col items-center justify-center">
        <p className={`text-center text-gray-500 ${cairoClassName}`}>Nenhuma alteração salarial para exibir.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-[350px] flex flex-col"> {/* Adicionado flex-1 */}
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-gray-200 ${cairoClassName}`}>
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('nomeColaborador')}>
                Funcionário{getSortIndicator('nomeColaborador')}
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('competencia')}>
                Competência{getSortIndicator('competencia')}
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('motivo')}>
                Motivo{getSortIndicator('motivo')}
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('salarioAnterior')}>
                Sal. Anterior{getSortIndicator('salarioAnterior')}
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('salarioNovo')}>
                Sal. Novo{getSortIndicator('salarioNovo')}
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('percentual')}>
                Variação (%){getSortIndicator('percentual')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((alteracao, index) => (
              <tr key={alteracao.id || `alteracao-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{alteracao.nomeColaborador}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{alteracao.competencia}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{alteracao.motivo}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{formatCurrencyForTable(alteracao.salarioAnterior)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{formatCurrencyForTable(alteracao.salarioNovo)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{alteracao.percentual || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlteracoesSalariaisModalTable;
