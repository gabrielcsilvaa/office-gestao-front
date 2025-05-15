
import React, { useState } from "react";

const meses = [
  "jan/2025",
  "fev/2025",
  "mar/2025",
  "abr/2025",
  "mai/2025",
  "jun/2025",
  "jul/2025",
  "ago/2025",
  "set/2025",
  "out/2025",
  "nov/2025",
  "dez/2025",
];

type Props = {
  mostrarMensagem: boolean;
  fecharMensagem: () => void;
};

export default function AtividadeModulo({
  mostrarMensagem,
  fecharMensagem,
}: Props) {
  const [usuarioExpandido, setUsuarioExpandido] = useState<string | null>(null);

  const toggleExpandir = (usuario: string) => {
    setUsuarioExpandido((prev) => (prev === usuario ? null : usuario));
  };

  const usuarios = [
    {
      nome: "Usuário Exemplo",
      empresas: ["Empresa A", "Empresa B"],
    },
    {
      nome: "Outro Usuário",
      empresas: ["Empresa C"],
    },
  ];

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
          Atividades por Módulo
        </h2>

        <div className="overflow-auto flex-1 w-full">
          <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
            <thead className="bg-gray-100 text-xs">
              <tr>
                <th rowSpan={2} className="border px-4 py-2 text-center">
                  Mês / Ano
                </th>
                {meses.map((mes) => (
                  <th
                    key={mes}
                    colSpan={4}
                    className="border px-4 py-2 text-center"
                  >
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
              {usuarios.map((usuario) => (
                <React.Fragment key={usuario.nome}>
                  <tr
                    className="bg-white font-semibold cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleExpandir(usuario.nome)}
                  >
                    <td className="border px-2 py-1 font-bold text-gray-800">
                      ▶ {usuario.nome}
                    </td>
                    <td
                      className="border px-2 py-1 text-center text-gray-600"
                      colSpan={meses.length * 4}
                    >
                      Clique para ver empresas
                    </td>
                  </tr>

                  {usuarioExpandido === usuario.nome &&
                    usuario.empresas.map((empresa) => (
                      <tr key={empresa} className="bg-white">
                        <td className="border px-2 py-1 pl-6 text-gray-700">
                          {empresa}
                        </td>
                        {meses.map((mes) => (
                          <React.Fragment key={`${empresa}-${mes}`}>
                            <td className="border px-2 py-1 text-right">-</td>
                            <td className="border px-2 py-1 text-right">-</td>
                            <td className="border px-2 py-1 text-right">-</td>
                            <td className="border px-2 py-1 text-right">-</td>
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}
                </React.Fragment>
              ))}
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
