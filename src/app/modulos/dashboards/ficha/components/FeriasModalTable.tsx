"use client";
import React from 'react';

interface FeriasDetalheEntry {
  nomeColaborador: string;
  inicioPeriodoAquisitivo: string;
  fimPeriodoAquisitivo: string;
  inicioPeriodoGozo: string;
  fimPeriodoGozo: string;
  limiteParaGozo: string;
  diasDeDireito: number;
  diasGozados: number;
  diasDeSaldo: number;
}

interface FeriasModalTableProps {
  feriasData: FeriasDetalheEntry[];
  cairoClassName: string;
}

const FeriasModalTable: React.FC<FeriasModalTableProps> = ({ feriasData, cairoClassName }) => {
  if (!feriasData || feriasData.length === 0) {
    return <p className={`text-center text-gray-500 ${cairoClassName}`}>Nenhum dado de férias para exibir.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${cairoClassName}`}>
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionário</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Início Aquisitivo</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fim Aquisitivo</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Início Gozo</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fim Gozo</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limite Gozo</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Dias Direito</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Dias Gozados</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Dias Saldo</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {feriasData.map((ferias, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{ferias.nomeColaborador}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{ferias.inicioPeriodoAquisitivo}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{ferias.fimPeriodoAquisitivo}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{ferias.inicioPeriodoGozo}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{ferias.fimPeriodoGozo}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{ferias.limiteParaGozo}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{ferias.diasDeDireito}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{ferias.diasGozados}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{ferias.diasDeSaldo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeriasModalTable;
