"use client";
import React, { useState, useEffect, useMemo } from 'react';

// Interface for exam entries, matching the 'Exame' type from page.tsx
interface ExameEntry {
  nomeColaborador: string;
  dataExame: string;       // Expected format: "DD/MM/YYYY"
  vencimento: string;      // Expected format: "DD/MM/YYYY" or "N/A"
  tipo: string;
  resultado: string;
  id?: string | number; 
}

interface AtestadosModalTableProps {
  atestadosData: ExameEntry[];
  cairoClassName: string;
  onSortedDataChange?: (sortedData: ExameEntry[]) => void; // Callback para expor dados ordenados
  onSortInfoChange?: (sortInfo: string) => void; // Callback para expor info de ordenação como texto formatado
}

type SortKey = keyof ExameEntry | null;
type SortDirection = 'ascending' | 'descending';

// Helper para converter informações de sort em texto legível para PDF
const getSortDisplayText = (sortKey: SortKey, sortDirection: SortDirection): string => {
  if (!sortKey) return 'Padrão (sem ordenação específica)';
  
  const columnNames: Record<string, string> = {
    nomeColaborador: 'Nome do Funcionário',
    dataExame: 'Data do Exame',
    vencimento: 'Vencimento',
    tipo: 'Tipo',
    resultado: 'Resultado'
  };
  
  const directionText = sortDirection === 'ascending' ? 'Crescente' : 'Decrescente';
  const columnText = columnNames[sortKey] || sortKey;
  
  return `Por ${columnText} (${directionText})`;
};

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

const AtestadosModalTable: React.FC<AtestadosModalTableProps> = ({ atestadosData, cairoClassName, onSortedDataChange, onSortInfoChange }) => {
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending');
  
  const sortedData = useMemo(() => {
    let sortableItems = [...atestadosData];
    if (sortKey !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortKey!]; 
        const valB = b[sortKey!]; 

        let comparisonResult: number = 0;

        if (sortKey === 'dataExame' || sortKey === 'vencimento') {
          const dateA = parseDateString(String(valA));
          const dateB = parseDateString(String(valB));
          const aIsNilDate = dateA === null;
          const bIsNilDate = dateB === null;

          if (aIsNilDate && bIsNilDate) {
            return 0; // Ambos nulos, ordem indiferente
          }
          if (aIsNilDate) { // A é nulo, B não é
            return sortDirection === 'ascending' ? 1 : -1; // Nulo no final se ascendente, no início se descendente
          }
          if (bIsNilDate) { // B é nulo, A não é
            return sortDirection === 'ascending' ? -1 : 1; // Nulo no final se ascendente, no início se descendente
          }
          // Ambas são datas válidas
          if (dateA!.getTime() < dateB!.getTime()) comparisonResult = -1;
          else if (dateA!.getTime() > dateB!.getTime()) comparisonResult = 1;
          else comparisonResult = 0;
          
        } else { // String fields: nomeColaborador, tipo, resultado
          // Para campos não-data, manter nulos/N/A no final consistentemente
          const aIsConsideredNilString = valA === null || valA === undefined || String(valA).toLowerCase() === 'n/a' || String(valA).trim() === '';
          const bIsConsideredNilString = valB === null || valB === undefined || String(valB).toLowerCase() === 'n/a' || String(valB).trim() === '';

          if (aIsConsideredNilString && !bIsConsideredNilString) return 1; 
          if (!aIsConsideredNilString && bIsConsideredNilString) return -1;
          if (aIsConsideredNilString && bIsConsideredNilString) return 0;
          
          const strA = String(valA).toLowerCase();
          const strB = String(valB).toLowerCase();
          if (strA < strB) comparisonResult = -1;
          else if (strA > strB) comparisonResult = 1;
          else comparisonResult = 0;
        }
        
        return sortDirection === 'ascending' ? comparisonResult : -comparisonResult;
      });
    }    return sortableItems;
  }, [atestadosData, sortKey, sortDirection]);
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
              <tr key={exame.id || `exame-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
