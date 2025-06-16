"use client";
import React, { useState, useMemo } from 'react';

// Interface for contract entries, matching 'Contrato' from page.tsx
interface ContratoEntry {
  id: string; // ou number, dependendo da origem
  colaborador: string;
  dataAdmissao: string;    // Expected format: "DD/MM/YYYY"
  dataRescisao: string;    // Expected format: "DD/MM/YYYY" or "" or "N/A"
  salarioBase: string;     // Expected format: "R$ X.XXX,XX"
  // empresa: string; // Removido conforme solicitado anteriormente
}

interface ContratosModalTableProps {
  contratosData: ContratoEntry[];
  cairoClassName: string;
}

type SortKeyContrato = keyof ContratoEntry | null;
type SortDirectionContrato = 'ascending' | 'descending';

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

// Helper function to parse currency strings like "R$ 1.234,56" to numbers
const parseCurrencyString = (currencyStr: string): number | null => {
  if (!currencyStr || typeof currencyStr !== 'string' || currencyStr.toLowerCase() === 'n/a') {
    return null;
  }
  const cleanedString = currencyStr.replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
  const num = parseFloat(cleanedString);
  return isNaN(num) ? null : num;
};


const ContratosModalTable: React.FC<ContratosModalTableProps> = ({ contratosData, cairoClassName }) => {
  const [sortKey, setSortKey] = useState<SortKeyContrato>(null);
  const [sortDirection, setSortDirection] = useState<SortDirectionContrato>('ascending');

  const sortedData = useMemo(() => {
    let sortableItems = [...contratosData];
    if (sortKey !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        const isValANil = valA === null || valA === undefined || String(valA).toLowerCase() === 'n/a' || String(valA).trim() === "";
        const isValBNil = valB === null || valB === undefined || String(valB).toLowerCase() === 'n/a' || String(valB).trim() === "";

        if (isValANil && isValBNil) return 0;
        if (isValANil) return 1;
        if (isValBNil) return -1;

        if (sortKey === 'dataAdmissao' || sortKey === 'dataRescisao') {
          const dateA = parseDateString(String(valA));
          const dateB = parseDateString(String(valB));
          if (dateA === null && dateB === null) return 0;
          if (dateA === null) return 1; // Null dates (e.g. active contract for dataRescisao) go last
          if (dateB === null) return -1;
          if (dateA.getTime() < dateB.getTime()) return sortDirection === 'ascending' ? -1 : 1;
          if (dateA.getTime() > dateB.getTime()) return sortDirection === 'ascending' ? 1 : -1;
          return 0;
        } else if (sortKey === 'salarioBase') {
          const numA = parseCurrencyString(String(valA));
          const numB = parseCurrencyString(String(valB));
          if (numA === null && numB === null) return 0;
          if (numA === null) return 1;
          if (numB === null) return -1;
          if (numA < numB) return sortDirection === 'ascending' ? -1 : 1;
          if (numA > numB) return sortDirection === 'ascending' ? 1 : -1;
          return 0;
        } else { // colaborador (string sort)
          const strA = String(valA).toLowerCase();
          const strB = String(valB).toLowerCase();
          if (strA < strB) return sortDirection === 'ascending' ? -1 : 1;
          if (strA > strB) return sortDirection === 'ascending' ? 1 : -1;
          return 0;
        }
      });
    }
    return sortableItems;
  }, [contratosData, sortKey, sortDirection]);

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
              <tr key={contrato.id || `contrato-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
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
