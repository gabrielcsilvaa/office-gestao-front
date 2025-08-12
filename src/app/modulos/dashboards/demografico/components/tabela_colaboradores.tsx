"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Colaborador {
  nome: string;
  departamento: string;
  faturamento?: string;
}

interface Props {
  colaboradores: Colaborador[];
}

export default function TabelaColaboradores({ colaboradores }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>("");
  
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
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, handleKeyDown]);

  const TabelaComponent = ({
    alturaLimitada = true,
  }: {
    alturaLimitada?: boolean;
  }) => (
    <div
      className="w-full overflow-y-auto"
      style={{ maxHeight: alturaLimitada ? "600px" : "100%" }}
    >
      <table className="min-w-full text-sm font-medium text-gray-800">
        <thead className="sticky top-0 z-10 bg-black text-white h-12">
          <tr>
            <th className="py-3 px-4 text-left">NOME</th>
            <th className="py-3 px-4 text-left">DEPARTAMENTO</th>
            <th className="py-3 px-4 text-left">FATURAMENTO</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {colaboradores.map((colab, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{colab.nome}</td>
              <td className="py-2 px-4">{colab.departamento}</td>
              <td className="py-2 px-4">{colab.faturamento || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {/* Container Principal */}
      <div className="relative bg-white rounded-xl shadow-md h-full flex flex-col border border-gray-200">
        {/* Botão para abrir o modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-2 right-2 z-20 p-1 rounded-full hover:bg-gray-200"
          aria-label="Maximizar Tabela"
          title="Maximizar Tabela"
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
            Lista de Colaboradores
          </h3>
          <TabelaComponent alturaLimitada />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-2xl w-[95vw] h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho com título e busca */}
            <div className="flex items-center justify-between p-4 bg-white shadow rounded-md mb-4">
              <h1 className="text-2xl font-bold font-cairo text-gray-800">
                Lista de Colaboradores
              </h1>
              <div className="flex items-center gap-4 ml-auto">
                <input
                  type="text"
                  placeholder="Pesquisar por nome..."
                  className="border border-gray-300 rounded-md p-2 w-96 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tabela com estilo igual ao exemplo da imagem */}
            <div className="overflow-auto flex-grow pt-4">
              <table className="w-full border border-gray-300 text-sm font-cairo">
                <thead>
                  <tr className="bg-gray-200 border-b border-gray-400 text-center">
                    <th className="px-4 py-2 border-r">#</th>
                    <th className="px-4 py-2 border-r">Nome</th>
                    <th className="px-4 py-2">Departamento</th>
                    <th className="px-4 py-2">Faturamento</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {colaboradores
                    .filter((colab) =>
                      colab.nome.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((colab, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0
                            ? "bg-white"
                            : "bg-gray-100 border-b border-gray-300"
                        }
                      >
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{colab.nome.toUpperCase()}</td>
                        <td className="px-4 py-2">{colab.departamento}</td>
                        <td className="px-4 py-2">{colab.faturamento || "-"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
