import React from "react";

const meses = [
  "jan/2025", "fev/2025", "mar/2025", "abr/2025", "mai/2025", "jun/2025",
  "jul/2025", "ago/2025", "set/2025", "out/2025", "nov/2025", "dez/2025",
];

type Props = {
  mostrarMensagem: boolean;
  fecharMensagem: () => void;
};

export default function AtividadeCliente({
  mostrarMensagem,
  fecharMensagem,
}: Props) {
  if (!mostrarMensagem) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm overflow-auto"
      onClick={fecharMensagem}
    >
      <div
        className="bg-white w-[1000px] h-[1000px] flex flex-col gap-4 items-center p-6 rounded-2xl shadow-lg animate-fade-fast relative 2xl:h-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center p-6">
          Atividades por Cliente
        </h2>

        <div className="overflow-auto flex-1 w-full">
          <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
            <thead className="bg-gray-100 text-xs">
              <tr>
                <th rowSpan={2} className="border px-4 py-2">Empresa / Funcionário</th>
                {meses.map((mes) => (
                  <th key={mes} colSpan={4} className="border px-4 py-2 text-center">
                    {mes}
                  </th>
                ))}
              </tr>
              <tr>
                {meses.map((mes) => (
                  <React.Fragment key={`sub-${mes}`}>
                    <th className="border px-2 py-1 text-center">Horas</th>
                    <th className="border px-2 py-1 text-center">Importados</th>
                    <th className="border px-2 py-1 text-center">Módulos</th>
                    <th className="border px-2 py-1 text-center">Total</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-green-100 font-semibold">
                <td className="border px-2 py-1" colSpan={1 + meses.length * 4}>
                  ▶ Empresa Exemplo
                </td>
              </tr>
              <tr className="bg-white">
                <td className="border px-2 py-1 pl-6">Funcionário Exemplo</td>
                {meses.map((mes) => (
                  <React.Fragment key={mes}>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                  </React.Fragment>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <button
          onClick={fecharMensagem}
          className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
