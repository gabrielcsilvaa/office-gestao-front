"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const GraficoCargo = () => {
  // Estado para controlar a visibilidade do modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const colaboradores = [
    { id: 1, cargo: "AGENTE DE REGIS...", numeroDeColaboradores: 126 },
    { id: 2, cargo: "VENDEDOR(A)", numeroDeColaboradores: 107 },
    { id: 3, cargo: "DIRETOR ADMINIS...", numeroDeColaboradores: 68 },
    { id: 4, cargo: "SERVENTE DE OBR...", numeroDeColaboradores: 65 },
    { id: 5, cargo: "DIRETOR GERAL D...", numeroDeColaboradores: 63 },
    { id: 6, cargo: "DIRETOR", numeroDeColaboradores: 60 },
    { id: 7, cargo: "PINTOR", numeroDeColaboradores: 57 },
    { id: 8, cargo: "MOTORISTA", numeroDeColaboradores: 55 },
    { id: 9, cargo: "PEDREIRO", numeroDeColaboradores: 54 },
    { id: 10, cargo: "COSTUREIRA(O) E...", numeroDeColaboradores: 53 },
    { id: 11, cargo: "BALCONISTA", numeroDeColaboradores: 47 },
  ];

  // Hook para fechar o modal com a tecla 'Escape'
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsModalOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, handleKeyDown]);

  // Constante que renderiza o conteúdo do gráfico para ser reutilizada
  const ChartContent = () => {
    const maxColaboradores = Math.max(
      ...colaboradores.map((c) => c.numeroDeColaboradores),
      0
    );
    return (
      <div className="h-full w-full overflow-y-auto">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {colaboradores.map((colaborador) => (
              <tr
                key={colaborador.id}
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
                    style={{
                      width: `${
                        (colaborador.numeroDeColaboradores / maxColaboradores) *
                        100
                      }%`,
                      backgroundColor: "#68D391",
                      height: "20px",
                      borderRadius: "4px",
                      marginRight: "8px",
                      border: "1px solid #2F855A",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.9em",
                      color: "#2D3748",
                      fontWeight: "bold",
                    }}
                  >
                    {colaborador.numeroDeColaboradores}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      {/* Container Principal */}
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
        <div className="p-4 flex-grow overflow-hidden">
            <h3 className="text-center font-bold text-lg mb-4">
                Colaboradores por Cargo
            </h3>
            <ChartContent />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          {/* A classe bg-gray-100 foi trocada por bg-white aqui */}
          <div
            className="bg-white rounded-lg shadow-2xl w-[90vw] h-[90vh] p-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do Modal */}
            <div className="relative flex justify-center items-center mb-4 flex-shrink-0">
              <h2 className="w-full text-xl font-bold text-gray-800 text-center">
                Colaboradores por Cargo
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-3xl text-gray-500 hover:text-gray-900"
                aria-label="Fechar modal"
              >
                &times;
              </button>
            </div>

            {/* Área de Conteúdo com Rolagem */}
            <div className="flex-grow overflow-auto border rounded-lg bg-white">
              <ChartContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GraficoCargo;