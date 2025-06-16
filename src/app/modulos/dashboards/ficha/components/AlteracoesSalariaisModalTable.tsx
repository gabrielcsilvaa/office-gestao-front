"use client";
import React from 'react';

interface AlteracaoSalarialDetalheEntry {
  competencia: string;
  motivo: string;
  salarioAnterior: number | null;
  salarioNovo: number;
  percentual: string;
  nomeColaborador: string;
}

interface AlteracoesSalariaisModalTableProps {
  alteracoesData: AlteracaoSalarialDetalheEntry[];
  cairoClassName: string;
}

const formatCurrencyForTable = (value: number | null) =>
  value !== null
    ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : "N/A";

const AlteracoesSalariaisModalTable: React.FC<AlteracoesSalariaisModalTableProps> = ({ alteracoesData, cairoClassName }) => {
  if (!alteracoesData || alteracoesData.length === 0) {
    return <p className={`text-center text-gray-500 ${cairoClassName}`}>Nenhuma alteração salarial para exibir.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${cairoClassName}`}>
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionário</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competência</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sal. Anterior</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sal. Novo</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Variação (%)</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {alteracoesData.map((alteracao, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
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
  );
};

export default AlteracoesSalariaisModalTable;
