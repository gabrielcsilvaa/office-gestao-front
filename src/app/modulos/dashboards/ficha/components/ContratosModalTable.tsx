"use client";
import React, { useState, useMemo, useEffect } from 'react';

// Interface for contract entries, matching 'Contrato' from page.tsx
interface ContratoEntry {
  id: string; // ou number, dependendo da origem
  colaborador: string;
  dataAdmissao: string;    // Expected format: "DD/MM/YYYY"
  dataRescisao: string;    // Expected format: "DD/MM/YYYY" or "" or "N/A" or "Ativo"
  salarioBase: string;     // Expected format: "R$ X.XXX,XX"
}

interface ContratosModalTableProps {
  contratosData: ContratoEntry[];
  cairoClassName: string;
  onSortedDataChange?: (sortedData: ContratoEntry[]) => void; // Callback para expor dados ordenados
  onSortInfoChange?: (sortInfo: string) => void; // Callback para expor info de ordenação como texto formatado
}

type SortKeyContrato = keyof ContratoEntry | null;
type SortDirectionContrato = 'ascending' | 'descending';

// Helper para converter informações de sort em texto legível para PDF
const getSortDisplayText = (sortKey: SortKeyContrato, sortDirection: SortDirectionContrato): string => {
  if (!sortKey) return 'Padrão (sem ordenação específica)';
  
  const columnNames: Record<string, string> = {
    colaborador: 'Nome do Funcionário',
    dataAdmissao: 'Data de Admissão',
    dataRescisao: 'Data de Rescisão',
    salarioBase: 'Salário Base'
  };
  
  const directionText = sortDirection === 'ascending' ? 'Crescente' : 'Decrescente';
  const columnText = columnNames[sortKey] || sortKey;
  
  return `Por ${columnText} (${directionText})`;
};

// Helper function to parse DD/MM/YYYY strings to Date objects
const parseDateString = (dateStr: string): Date | null => {
  if (!dateStr || typeof dateStr !== 'string' || dateStr.toLowerCase() === 'n/a' || dateStr.trim() === "" || dateStr.toLowerCase() === 'ativo') {
    return null; // Treat "Ativo" as a nil date for parsing, specific handling in sort
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

// Helper function to parse currency strings like "R$ 1.234,56" to numbers
const parseCurrencyString = (currencyStr: string): number | null => {
  if (!currencyStr || typeof currencyStr !== 'string' || currencyStr.toLowerCase() === 'n/a') {
    return null;
  }
  const cleanedString = currencyStr.replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
  const num = parseFloat(cleanedString);
  return isNaN(num) ? null : num;
};


const ContratosModalTable: React.FC<ContratosModalTableProps> = ({ contratosData, cairoClassName, onSortedDataChange, onSortInfoChange }) => {
  const [sortKey, setSortKey] = useState<SortKeyContrato>(null);
  const [sortDirection, setSortDirection] = useState<SortDirectionContrato>('ascending');

  const sortedData = useMemo(() => {
    let sortableItems = [...contratosData];
    if (sortKey !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortKey!];
        const valB = b[sortKey!];

        let comparisonResult: number = 0;

        if (sortKey === 'dataAdmissao' || sortKey === 'dataRescisao') {
          const dateA = parseDateString(String(valA));
          const dateB = parseDateString(String(valB));
          
          // Specific check for "Ativo" or other nil-like date strings
          const aIsEffectivelyNilDate = dateA === null || (sortKey === 'dataRescisao' && String(valA).toLowerCase() === 'ativo');
          const bIsEffectivelyNilDate = dateB === null || (sortKey === 'dataRescisao' && String(valB).toLowerCase() === 'ativo');

          if (aIsEffectivelyNilDate && bIsEffectivelyNilDate) {
            return 0;
          }
          if (aIsEffectivelyNilDate) { // A is "Ativo" or unparseable, B is a valid date
            return sortDirection === 'ascending' ? 1 : -1; 
          }
          if (bIsEffectivelyNilDate) { // B is "Ativo" or unparseable, A is a valid date
            return sortDirection === 'ascending' ? -1 : 1;
          }
          
          // Both are valid dates (and not "Ativo" if dataRescisao)
          if (dateA!.getTime() < dateB!.getTime()) comparisonResult = -1;
          else if (dateA!.getTime() > dateB!.getTime()) comparisonResult = 1;
          else comparisonResult = 0;

        } else if (sortKey === 'salarioBase') {
          // Nulos/N/A para números sempre no final
          const numA = parseCurrencyString(String(valA));
          const numB = parseCurrencyString(String(valB));
          const aIsNilNumeric = numA === null;
          const bIsNilNumeric = numB === null;
          
          if (aIsNilNumeric && !bIsNilNumeric) return 1;
          if (!aIsNilNumeric && bIsNilNumeric) return -1;
          if (aIsNilNumeric && bIsNilNumeric) return 0;

          if (numA! < numB!) comparisonResult = -1;
          else if (numA! > numB!) comparisonResult = 1;
          else comparisonResult = 0;

        } else { // colaborador (string sort)
          // Nulos/N/A para strings sempre no final
          const aIsNilString = valA === null || valA === undefined || String(valA).toLowerCase() === 'n/a' || String(valA).trim() === '';
          const bIsNilString = valB === null || valB === undefined || String(valB).toLowerCase() === 'n/a' || String(valB).trim() === '';

          if (aIsNilString && !bIsNilString) return 1;
          if (!aIsNilString && bIsNilString) return -1;
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
  }, [contratosData, sortKey, sortDirection]);
  // Effect para notificar mudanças nos dados ordenados
  useEffect(() => {
    if (onSortedDataChange) {
      onSortedDataChange(sortedData);
    }
  }, [sortedData, onSortedDataChange]);
  // Effect para notificar mudanças na informação de ordenação
  useEffect(() => {
    if (onSortInfoChange) {
      const sortDisplayText = getSortDisplayText(sortKey, sortDirection);
      onSortInfoChange(sortDisplayText);
    }
  }, [sortKey, sortDirection, onSortInfoChange]);

  const requestSort = (key: SortKeyContrato) => {
    let direction: SortDirectionContrato = 'ascending';
    if (sortKey === key && sortDirection === 'ascending') {
      direction = 'descending';
    } else if (sortKey === key && sortDirection === 'descending') {
      direction = 'ascending';
    }
    setSortKey(key);
    setSortDirection(direction);
  };

  const getSortIndicator = (key: SortKeyContrato) => {
    if (sortKey === key) {
      return sortDirection === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };

  if (!contratosData || contratosData.length === 0) {
    return (
      <div className="flex-1 min-h-[350px] flex flex-col items-center justify-center">
        <p className={`text-center text-gray-500 ${cairoClassName}`}>Nenhum detalhe de contrato para exibir.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-[350px] flex flex-col">
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-gray-200 ${cairoClassName}`}>
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('colaborador')}>
                Funcionário{getSortIndicator('colaborador')}
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('dataAdmissao')}>
                Data Admissão{getSortIndicator('dataAdmissao')}
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('dataRescisao')}>
                Data Rescisão{getSortIndicator('dataRescisao')}
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('salarioBase')}>
                Salário Base{getSortIndicator('salarioBase')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((contrato, index) => (
              <tr key={contrato.id || `contrato-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{contrato.colaborador}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{contrato.dataAdmissao}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{contrato.dataRescisao || "Ativo"}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{contrato.salarioBase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContratosModalTable;
