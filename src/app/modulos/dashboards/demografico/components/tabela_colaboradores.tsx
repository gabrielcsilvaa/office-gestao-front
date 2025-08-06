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
            className="bg-white rounded-lg shadow-2xl w-[90vw] h-[90vh] p-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho */}
            <div className="relative flex justify-center items-center mb-4">
              <h2 className="text-xl font-bold text-center text-gray-800">
                Lista de Colaboradores
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-2 text-3xl text-gray-500 hover:text-gray-900"
                aria-label="Fechar modal"
              >
                &times;
              </button>
            </div>

            {/* Conteúdo com rolagem */}
            <div className="flex-grow overflow-auto border rounded-lg bg-white">
              <TabelaComponent alturaLimitada={false} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
