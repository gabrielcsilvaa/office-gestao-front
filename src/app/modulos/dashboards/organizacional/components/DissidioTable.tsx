import React from 'react';

interface DissidioRecord {
  sindicato: string;
  mesBase: string;
}

interface DissidioTableProps {
  data: DissidioRecord[];
  cairoClassName: string;
}

const DissidioTable: React.FC<DissidioTableProps> = ({ data, cairoClassName }) => {
  return (
    <div className="overflow-x-auto h-full">
      <table className={`w-full text-sm ${cairoClassName}`}>
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sindicato
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
              Mês Base
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((record, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-3 py-2 whitespace-normal align-top"> {/* Allow text to wrap */}
                {record.sindicato}
              </td>
              <td className="px-3 py-2 whitespace-nowrap align-top">
                {record.mesBase}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DissidioTable;
