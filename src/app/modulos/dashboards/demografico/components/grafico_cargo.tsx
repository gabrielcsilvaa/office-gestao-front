"use client";

import React, { useState, useEffect, useCallback, FormEvent } from "react";
import Image from "next/image";
import { Search } from "lucide-react"; // Lupa estilosa

interface ColaboradorCargo {
  cargo: string;
  total: number;
}

interface GraficoCargoProps {
  dados: ColaboradorCargo[];
}

const GraficoCargo: React.FC<GraficoCargoProps> = ({ dados }) => {
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

  const ChartContent = ({
    mostrarTodos = false,
    filtrarBusca = "",
  }: {
    mostrarTodos?: boolean;
    filtrarBusca?: string;
  }) => {
    let dadosExibidos = dados;

    if (filtrarBusca) {
      dadosExibidos = dados.filter((c) =>
        c.cargo.toLowerCase().includes(filtrarBusca.toLowerCase())
      );
    }

    const maxColaboradores = Math.max(...dados.map((c) => c.total), 0);

    return (
      <div
        className="w-full overflow-y-auto"
        style={{
          maxHeight: mostrarTodos ? "100%" : "600px",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {dadosExibidos.map((colaborador, index) => (
              <tr
                key={index}
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
                      width: `${(colaborador.total / maxColaboradores) * 100}%`,
                      backgroundColor: "#68D391",
                      height: "20px",
                      borderRadius: "4px",
                      marginRight: "8px",
                      border: "1px solid #2F855A",
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
          </tbody>
        </table>
      </div>
    );
  };

  // Submissão do formulário de busca (Enter ou clique na lupa)
  const handleSubmitBusca = (e: FormEvent) => {
    e.preventDefault(); // evita reload da página
    // Busca já é feita em tempo real, então nada precisa ser feito aqui
  };

  return (
    <>
      {/* Gráfico Principal */}
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
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-[90vw] h-[90vh] p-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho com Título + Barra de Pesquisa */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Colaboradores por Cargo
              </h2>

              <form
                onSubmit={handleSubmitBusca}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Buscar cargo..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  type="submit"
                  className="p-2 rounded-md bg-green-500 hover:bg-green-600 text-white"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-3xl text-gray-500 hover:text-gray-900 ml-4"
                aria-label="Fechar modal"
              >
                &times;
              </button>
            </div>

            {/* Área de Conteúdo com Rolagem */}
            <div className="flex-grow overflow-auto border rounded-lg bg-white">
              <ChartContent mostrarTodos filtrarBusca={busca} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GraficoCargo;
