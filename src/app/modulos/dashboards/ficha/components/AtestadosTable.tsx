import React from 'react';

interface Atestado {
  vencimento: string;
  dataExame: string;
  resultado: string;
  tipo: string;
}

interface AtestadosTableProps {
  atestadosData: Atestado[];
  cairoClassName: string; // Assuming cairo font might be used for consistency
}

const AtestadosTable: React.FC<AtestadosTableProps> = ({ atestadosData, cairoClassName }) => {
  return (
    <div className="w-full bg-white rounded-lg border border-neutral-700 relative flex flex-col overflow-hidden p-4 h-full"> {/* Adicionado h-full */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-grow overflow-hidden mr-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-500 rounded-sm"></div>
            <div title="Histórico de Atestados" className={`text-black text-xl font-semibold leading-normal ${cairoClassName} whitespace-nowrap overflow-hidden text-ellipsis`}>
              Histórico de Atestados
            </div>
          </div>
        </div>
        {/* Icons can be added here if needed, similar to other cards */}
      </div>
      <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0"> {/* Esta div agora deve respeitar a altura do pai */}
        <table className="min-w-full divide-y divide-gray-200 border-t border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vencimento
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data do Exame
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resultado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {atestadosData.map((atestado, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {atestado.vencimento || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {atestado.dataExame || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {atestado.resultado || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {atestado.tipo || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AtestadosTable;
