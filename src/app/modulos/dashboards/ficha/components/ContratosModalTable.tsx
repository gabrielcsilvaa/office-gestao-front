"use client";
import React from 'react';

interface Contrato {
  id: string;
  empresa: string;
  colaborador: string;
  dataAdmissao: string;
  dataRescisao?: string;
  salarioBase?: string;
}

interface ContratosModalTableProps {
  contratosData: Contrato[];
  cairoClassName: string;
}

const ContratosModalTable: React.FC<ContratosModalTableProps> = ({ contratosData, cairoClassName }) => {
  if (!contratosData || contratosData.length === 0) {
    return <p className={`text-center text-gray-500 ${cairoClassName}`}>Nenhum dado de contratos para exibir.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${cairoClassName}`}>
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionário</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Admissão</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Rescisão</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salário Base</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contratosData.map((contrato, index) => (
            <tr key={contrato.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{contrato.colaborador}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{contrato.empresa}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{contrato.dataAdmissao}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{contrato.dataRescisao || 'Ativo'}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{contrato.salarioBase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContratosModalTable;
