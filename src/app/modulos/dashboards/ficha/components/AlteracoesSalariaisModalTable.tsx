"use client";
import React, { useState, useMemo, useEffect } from 'react';

// Interface for alteracao salarial entries, matching 'FormattedAlteracao' from page.tsx
interface AlteracaoSalarialEntryModal {
  nomeColaborador: string;
  competencia: string; // Expected format: "DD/MM/YYYY"
  motivo: string;
  salarioAnterior: number | null;
  salarioNovo: number;
  percentual: string; // Expected format: "X.X%" or "" or "-"
  id?: string | number; // Optional ID for a more stable key
}

interface AlteracoesSalariaisModalTableProps {
  alteracoesData: AlteracaoSalarialEntryModal[];
  cairoClassName: string;
  onSortedDataChange?: (sortedData: AlteracaoSalarialEntryModal[]) => void; // Callback para expor dados ordenados
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

const AlteracoesSalariaisModalTable: React.FC<AlteracoesSalariaisModalTableProps> = ({ alteracoesData, cairoClassName, onSortedDataChange }) => {
  const [sortKey, setSortKey] = useState<SortKeyAlteracao>(null);
  const [sortDirection, setSortDirection] = useState<SortDirectionAlteracao>('ascending');

  const sortedData = useMemo(() => {
    let sortableItems = [...alteracoesData];
    if (sortKey !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortKey!];
        const valB = b[sortKey!];

        let comparisonResult: number = 0;

        if (sortKey === 'competencia') {
          const dateA = parseDateString(String(valA));
          const dateB = parseDateString(String(valB));
          const aIsNilDate = dateA === null;
          const bIsNilDate = dateB === null;

          if (aIsNilDate && bIsNilDate) return 0;
          if (aIsNilDate) return sortDirection === 'ascending' ? 1 : -1; // Nil date at end for asc, start for desc
          if (bIsNilDate) return sortDirection === 'ascending' ? -1 : 1; // Nil date at end for asc, start for desc
          
          if (dateA!.getTime() < dateB!.getTime()) comparisonResult = -1;
          else if (dateA!.getTime() > dateB!.getTime()) comparisonResult = 1;
          else comparisonResult = 0;

        } else if (sortKey === 'salarioAnterior') {
          const numA = valA as number | null;
          const numB = valB as number | null;
          const aIsNilNumeric = numA === null; // "N/A"
          const bIsNilNumeric = numB === null; // "N/A"

          if (aIsNilNumeric && bIsNilNumeric) return 0;
          // If A is N/A: N/A comes first in ascending, last in descending
          if (aIsNilNumeric) return sortDirection === 'ascending' ? -1 : 1; 
          // If B is N/A: N/A comes first in ascending, last in descending
          if (bIsNilNumeric) return sortDirection === 'ascending' ? 1 : -1;

          // Both are valid numbers
          if (numA! < numB!) comparisonResult = -1;
          else if (numA! > numB!) comparisonResult = 1;
          else comparisonResult = 0;

        } else if (sortKey === 'salarioNovo') {
          const numA = Number(valA);
          const numB = Number(valB);
          const aIsInvalid = isNaN(numA);
          const bIsInvalid = isNaN(numB);
          if (aIsInvalid && !bIsInvalid) return 1; 
          if (!aIsInvalid && bIsInvalid) return -1;
          if (aIsInvalid && bIsInvalid) return 0;

          if (numA < numB) comparisonResult = -1;
          else if (numA > numB) comparisonResult = 1;
          else comparisonResult = 0;
          
        } else if (sortKey === 'percentual') {
          const percA = parsePercentageString(String(valA));
          const percB = parsePercentageString(String(valB));
          const aIsNilPerc = percA === null; // True if valA was "-" or unparseable
          const bIsNilPerc = percB === null; // True if valB was "-" or unparseable

          if (aIsNilPerc && bIsNilPerc) return 0;
          // If A is "-": "-" comes first in ascending, last in descending
          if (aIsNilPerc) return sortDirection === 'ascending' ? -1 : 1; 
          // If B is "-": "-" comes first in ascending, last in descending
          if (bIsNilPerc) return sortDirection === 'ascending' ? 1 : -1;

          // Both are valid numbers
          if (percA! < percB!) comparisonResult = -1;
          else if (percA! > percB!) comparisonResult = 1;
          else comparisonResult = 0;

        } else { // nomeColaborador, motivo (string sort)
          const aIsNilString = valA === null || valA === undefined || String(valA).toLowerCase() === 'n/a' || String(valA).trim() === '';
          const bIsNilString = valB === null || valB === undefined || String(valB).toLowerCase() === 'n/a' || String(valB).trim() === '';

          if (aIsNilString && !bIsNilString) return 1; // Nil string always at end
          if (!aIsNilString && bIsNilString) return -1; // Nil string always at end
          if (aIsNilString && bIsNilString) return 0;
          
          const strA = String(valA).toLowerCase();
          const strB = String(valB).toLowerCase();
          if (strA < strB) comparisonResult = -1;
          else if (strA > strB) comparisonResult = 1;
          else comparisonResult = 0;
        }
        
        return sortDirection === 'ascending' ? comparisonResult : -comparisonResult;
      });
    }
    return sortableItems;
  }, [alteracoesData, sortKey, sortDirection]);

  // Effect para notificar mudanças nos dados ordenados
  useEffect(() => {
    if (onSortedDataChange) {
      onSortedDataChange(sortedData);
    }
  }, [sortedData, onSortedDataChange]);

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
    <div className="flex-1 min-h-[350px] flex flex-col">
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
              <tr key={alteracao.id || `alteracao-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
