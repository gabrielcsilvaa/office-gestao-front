"use client";
import React from 'react';

interface Exame {
  vencimento: string;
  dataExame: string;
  resultado: string;
  tipo: string;
  nomeColaborador: string;
}

interface AtestadosModalTableProps {
  atestadosData: Exame[];
  cairoClassName: string;
}

const AtestadosModalTable: React.FC<AtestadosModalTableProps> = ({ atestadosData, cairoClassName }) => {
  if (!atestadosData || atestadosData.length === 0) {
    return <p className={`text-center text-gray-500 ${cairoClassName}`}>Nenhum dado de exames para exibir.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${cairoClassName}`}>
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionário</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Exame</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {atestadosData.map((atestado, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{atestado.nomeColaborador}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{atestado.dataExame}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{atestado.vencimento}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{atestado.tipo}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{atestado.resultado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AtestadosModalTable;
