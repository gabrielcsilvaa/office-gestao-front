"use client";
import React from 'react';

interface Afastamento {
  inicio: string;
  termino: string;
  tipo: string;
  diasAfastados: string | number;
  nomeColaborador?: string;
}

interface AfastamentosModalTableProps {
  afastamentosData: Afastamento[];
  cairoClassName: string;
}

const AfastamentosModalTable: React.FC<AfastamentosModalTableProps> = ({ afastamentosData, cairoClassName }) => {
  if (!afastamentosData || afastamentosData.length === 0) {
    return <p className={`text-center text-gray-500 ${cairoClassName}`}>Nenhum dado de afastamentos para exibir.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${cairoClassName}`}>
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionário</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Início</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Término</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Dias Afastados</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {afastamentosData.map((afastamento, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{afastamento.nomeColaborador || 'N/A'}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{afastamento.inicio}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{afastamento.termino}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{afastamento.tipo}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{String(afastamento.diasAfastados)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AfastamentosModalTable;
