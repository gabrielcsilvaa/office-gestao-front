import { useEffect, useState } from "react";
import { dadosUsuarios } from "../interfaces/interface";
import { Cairo } from "next/font/google";
import { formatadorSegParaHor } from "@/utils/formatadores";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface AtividadeMes {
  horas: number;
  importacoes: number;
  lancamentos: number;
  lancamentosManuais: number;
}

interface TotalAtividades {
  total_tempo_gasto: number;
  total_importacoes: number;
  total_lancamentos: number;
  total_lancamentos_manuais: number;
}

interface AtividadesUsuario
  extends Record<string, AtividadeMes | TotalAtividades> {
  total: TotalAtividades;
}

interface Usuario {
  id: number | string;
  NOME: string;
  atividades: AtividadesUsuario;
}

interface ListaUsuarioProps {
  mostrarMensagem: boolean;
  fecharMensagem: () => void;
  dados: dadosUsuarios | null;
  meses: string[];
}

export default function ListaUsuario({
  mostrarMensagem,
  fecharMensagem,
  dados,
  meses,
}: ListaUsuarioProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtroTexto, setFiltroTexto] = useState("");

  useEffect(() => {
    const dadosSimulados: Usuario[] = [
      {
        id: 0,
        NOME: "Sem Dados",
        atividades: {
          total: {
            total_tempo_gasto: 0,
            total_importacoes: 0,
            total_lancamentos: 0,
            total_lancamentos_manuais: 0,
          },
          ...meses.reduce(
            (acc, mes) => {
              acc[mes] = {
                horas: 0,
                importacoes: 0,
                lancamentos: 0,
                lancamentosManuais: 0,
              };
              return acc;
            },
            {} as Record<string, AtividadeMes>
          ),
        },
      },
    ];

    if (dados) {
      const usuariosMapeados: Usuario[] = [];

      for (const usuario of dados.analises) {
        const atividades: AtividadesUsuario = {
          total: {
            total_tempo_gasto: 0,
            total_importacoes: 0,
            total_lancamentos: 0,
            total_lancamentos_manuais: 0,
          },
          ...meses.reduce(
            (acc, mes) => {
              acc[mes] = {
                horas: 0,
                importacoes: 0,
                lancamentos: 0,
                lancamentosManuais: 0,
              };
              return acc;
            },
            {} as Record<string, AtividadeMes>
          ),
        };

        for (const empresa of usuario.empresas) {
          for (const mesAno of meses) {
            const dadosMes = empresa.atividades[mesAno];
            if (dadosMes) {
              const atividadeMes = atividades[mesAno] as AtividadeMes;

              atividadeMes.horas += dadosMes.tempo_gasto || 0;
              atividadeMes.importacoes += dadosMes.importacoes || 0;
              atividadeMes.lancamentos += dadosMes.lancamentos || 0;
              atividadeMes.lancamentosManuais +=
                dadosMes.lancamentos_manuais || 0;
            }
          }

          atividades.total.total_tempo_gasto += empresa.total_tempo_gasto || 0;
          atividades.total.total_importacoes += empresa.total_importacoes || 0;
          atividades.total.total_lancamentos += empresa.total_lancamentos || 0;
          atividades.total.total_lancamentos_manuais +=
            empresa.total_lancamentos_manuais || 0;
        }

        usuariosMapeados.push({
          id: usuario.usuario_id,
          NOME: usuario.nome_usuario,
          atividades,
        });
      }

      setUsuarios(usuariosMapeados);
    } else if (mostrarMensagem) {
      setUsuarios(dadosSimulados);
    }
  }, [mostrarMensagem, dados, meses]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        fecharMensagem();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [fecharMensagem]);

  if (!mostrarMensagem) return null;

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.NOME.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  const subColunas = [
    { label: "Horas", key: "horas" },
    { label: "Importações", key: "importacoes" },
    { label: "Lançamentos", key: "lancamentos" },
    { label: "L. Manuais", key: "lancamentosManuais" },
  ];

  const subColunasTotais = [
    { label: "Horas", key: "total_tempo_gasto" },
    { label: "Importações", key: "total_importacoes" },
    { label: "Lançamentos", key: "total_lancamentos" },
    { label: "L. Manuais", key: "total_lancamentos_manuais" },
  ];
  return (
    <>
      {mostrarMensagem && (
        <div
          className={`${cairo.className} fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm overflow-auto`}
          onClick={() => fecharMensagem()}
        >
          <div
            className="bg-white w-full h-full flex flex-col gap-4 items-center p-6 rounded-2xl shadow-lg animate-fade-fast relative max-w-[80vw] max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={fecharMensagem}
              className="absolute top-4 right-4 text-gray-800 font-bold text-2xl hover:text-gray-600 transition cursor-pointer"
              aria-label="Fechar"
            >
              &times;
            </button>

            <div className="w-full p-6 flex animate-fade-fast">
              <h2 className="text-3xl font-bold text-gray-800 flex-1">
                Atividades por Usuário
              </h2>
              <div className="flex gap-2 ml-4">
                <input
                  type="text"
                  id="inputText"
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  className={`${cairo.className} bg-white border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400`}
                  placeholder="Buscar Usuário"
                />
              </div>
            </div>

            <div className="overflow-auto flex-1 w-full">
              <table className="min-w-full table-auto border border-gray-300 text-sm text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2" rowSpan={2}>
                      Usuários
                    </th>
                    {meses.map((mes) => (
                      <th
                        key={mes}
                        className="border px-4 py-2 text-center"
                        colSpan={subColunas.length}
                      >
                        {mes}
                      </th>
                    ))}
                    <th
                      className="border px-4 py-2 text-center"
                      colSpan={subColunas.length}
                    >
                      Total
                    </th>
                  </tr>
                  <tr>
                    {meses.map((mes) =>
                      subColunas.map(({ label }) => (
                        <th
                          key={`${mes}-${label}`}
                          className="border px-4 py-2 whitespace-nowrap"
                        >
                          {label}
                        </th>
                      ))
                    )}
                    {subColunasTotais.map(({ label }) => (
                      <th
                        key={`total-${label}`}
                        className="border px-4 py-2 whitespace-nowrap"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id}>
                      <td className="border px-4 py-2 font-bold text-black text-center  ">
                        {usuario.NOME}
                      </td>
                      {meses.map((mes) =>
                        subColunas.map(({ key }) => {
                          const atividade = usuario.atividades[mes];
                          const valor =
                            atividade && "horas" in atividade
                              ? (atividade as AtividadeMes)[
                                  key as keyof AtividadeMes
                                ]
                              : "-";

                          return (
                            <td
                              key={`${usuario.id}-${mes}-${key}`}
                              className="text-center border px-4 py-2 whitespace-nowrap"
                            >
                              {key === "horas" && typeof valor === "number"
                                ? formatadorSegParaHor(valor)
                                : (valor ?? "-")}
                            </td>
                          );
                        })
                      )}
                      {subColunasTotais.map(({ key }) => {
                        const valorTotal =
                          usuario.atividades.total[
                            key as keyof TotalAtividades
                          ];
                        return (
                          <td
                            key={`${usuario.id}-total-${key}`}
                            className="border px-4 py-2 whitespace-nowrap font-semibold"
                          >
                            {key === "total_tempo_gasto" &&
                            typeof valorTotal === "number"
                              ? formatadorSegParaHor(valorTotal)
                              : (valorTotal ?? "-")}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 mb-2"></div>
          </div>
        </div>
      )}
    </>
  );
}
