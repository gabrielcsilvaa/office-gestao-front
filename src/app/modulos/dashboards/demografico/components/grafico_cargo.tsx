"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface ColaboradorCargo {
  cargo: string;
  total: number;
}

interface DetalheCargo {
  nome: string;
  cargo: string;
}

interface GraficoCargoProps {
  dados: ColaboradorCargo[];
  detalhes?: DetalheCargo[]; // novo: para preencher a tabela do modal
}

const GraficoCargo: React.FC<GraficoCargoProps> = ({ dados, detalhes = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busca, setBusca] = useState("");

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setIsModalOpen(false);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, handleKeyDown]);

  // normaliza e ordena por total desc (opcional)
  const linhas = Array.isArray(dados)
    ? [...dados].sort((a, b) => b.total - a.total)
    : [];

  const maxColaboradores = linhas.length ? Math.max(...linhas.map((c) => c.total)) : 0;

  // Filtro:
  // - gráfico: filtra por nome do cargo
  // - tabela: filtra por nome do colaborador
  const linhasFiltradas = busca
    ? linhas.filter((c) => c.cargo.toLowerCase().includes(busca.toLowerCase()))
    : linhas;

  const colaboradoresFiltrados = busca
    ? detalhes.filter((d) => d.nome.toLowerCase().includes(busca.toLowerCase()))
    : detalhes;

  const ChartContent = ({
    mostrarTodos = false,
    colecao = linhasFiltradas,
  }: {
    mostrarTodos?: boolean;
    colecao?: { cargo: string; total: number }[];
  }) => (
    <div
      className="w-full overflow-y-auto"
      style={{ maxHeight: mostrarTodos ? "100%" : "600px" }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {colecao.map((colaborador, index) => (
            <tr
              key={`${colaborador.cargo}-${index}`}
              style={{ borderBottom: "1px solid #E2E8F0" }}
              className="hover:bg-gray-50"
            >
              <td
                style={{
                  padding: "12px 8px",
                  fontSize: "0.9em",
                  color: "#4A5568",
                  width: "40%",
                }}
              >
                {colaborador.cargo}
              </td>
              <td
                style={{
                  padding: "12px 8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  title={`${colaborador.cargo}: ${colaborador.total}`}
                  style={{
                    width: maxColaboradores
                      ? `${(colaborador.total / maxColaboradores) * 100}%`
                      : "0%",
                    backgroundColor: "#8884d8",
                    height: "20px",
                    borderRadius: "4px",
                    marginRight: "8px",
                    border: "1px solid #8884d8",
                    cursor: "default",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.9em",
                    color: "#2D3748",
                    fontWeight: "bold",
                  }}
                >
                  {colaborador.total}
                </span>
              </td>
            </tr>
          ))}
          {!colecao.length && (
            <tr>
              <td colSpan={2} className="text-center text-sm text-gray-500 py-6">
                Nenhum dado para exibir.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {/* Card pequeno */}
      <div className="relative bg-white rounded-xl shadow-md h-full flex flex-col border border-gray-200">
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-2 right-2 z-20 p-1 rounded-full hover:bg-gray-200"
          aria-label="Maximizar Gráfico"
          title="Maximizar Gráfico"
        >
          <Image
            src="/assets/icons/icon-maximize.svg"
            alt="Maximizar"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>

        <div className="p-0 flex-grow max-h-[650px] relative">
          <div className="sticky top-0 z-10 bg-white p-4 border-b">
            <h3 className="text-center font-bold text-lg ">
              Colaboradores por Cargo
            </h3>
          </div>
          <div className="p-4 ">
            <ChartContent />
          </div>
        </div>
      </div>

      {/* Modal */}
{/* Modal (igual ao grafico_categoria.tsx: cabeçalho + busca + TABELA) */}
{isModalOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    onClick={() => setIsModalOpen(false)}
  >
    <div
      className="bg-white p-6 rounded-lg shadow-2xl w-[95vw] h-[90vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Cabeçalho com busca */}
      <div className="flex items-center justify-between p-4 bg-white shadow rounded-md mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Colaboradores por Cargo
        </h1>
        <div className="flex items-center gap-4 ml-auto">
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            className="border border-gray-300 rounded-md p-2 w-96 text-sm"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-auto flex-grow pt-4">
        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-400 text-center">
              <th className="px-4 py-2 border-r">#</th>
              <th className="px-4 py-2 border-r">Nome</th>
              <th className="px-4 py-2">Cargo</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {colaboradoresFiltrados.map((c, i) => (
              <tr
                key={`${c.nome}-${i}`}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-100 border-b border-gray-300"}
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{c.nome.toUpperCase()}</td>
                <td className="px-4 py-2">{c.cargo || "Não informado"}</td>
              </tr>
            ))}
            {!colaboradoresFiltrados.length && (
              <tr>
                <td colSpan={3} className="text-center text-gray-500 py-6">
                  Nenhum colaborador encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default GraficoCargo;
