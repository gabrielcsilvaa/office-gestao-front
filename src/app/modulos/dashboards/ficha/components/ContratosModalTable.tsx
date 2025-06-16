"use client";
import React from 'react';

interface Contrato {
  id: string;
  empresa: string; // O campo pode ainda existir nos dados, mas não será exibido na tabela
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
  // Adicionando a lógica de altura mínima e mensagem de "sem dados" para consistência
  // com as discussões anteriores sobre a altura do modal.
  return (
    <div className="flex-1 min-h-[350px] flex flex-col"> {/* Garante altura mínima e expansão */}
      {(!contratosData || contratosData.length === 0) ? (
        <div className="flex-grow flex items-center justify-center">
          <p className={`text-center text-gray-500 ${cairoClassName}`}>Nenhum dado de contratos para exibir.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y divide-gray-200 ${cairoClassName}`}>
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionário</th>
                {/* <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th> Coluna removida */}
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Admissão</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Rescisão</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salário Base</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contratosData.map((contrato, index) => (
                <tr key={contrato.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{contrato.colaborador}</td>
                  {/* <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{contrato.empresa}</td> Célula removida */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{contrato.dataAdmissao}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{contrato.dataRescisao || 'Ativo'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{contrato.salarioBase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContratosModalTable;
