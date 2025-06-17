// Adicione esta linha no topo se ainda não estiver lá
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image"; // Supondo que você use Next.js para imagens

export default function TabelaColaboradores() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const colaboradores = [
    {
      nome: "JOSE ORLANDO QUEIROZ",
      departamento: "GERAL",
      faturamento: "GERAL",
      number: "1",
    },
    {
      nome: "MARIA REGINALDA ROGÉRIO DE ALMEIDA",
      departamento: "FILIAL 2",
      faturamento: "GERAL",
      number: "1",
    },
    {
      nome: "BRUNO DE SOUZA SIERRA",
      departamento: "FILIAL 4",
      faturamento: "GERAL",
      number: "1",
    },
    {
      nome: "MARIA APARECIDA CALIXTO",
      departamento: "MATRIZ",
      faturamento: "MATRIZ",
      number: "1",
    },
    {
      nome: "MARIA ELSANGELA DE LEMOS BARBOSA",
      departamento: "PRODUÇÃO",
      faturamento: "GERAL",
      number: "1",
    },
    {
      nome: "FRANCISCO TAO BEZERRA DO NASCIMENTO",
      departamento: "MATRIZ",
      faturamento: "GERAL",
      number: "1",
    },
    {
      nome: "MARIA DE FATIMA HOLANDA DOS SANTOS SILVA",
      departamento: "PARC",
      faturamento: "PARC",
      number: "1",
    },

    {
      nome: "MARIA DE FATIMA HOLANDA DOS SANTOS SILVA",
      departamento: "PARC",
      faturamento: "PARC",
      number: "1",
    },
    {
      nome: "MARIA DE FATIMA HOLANDA DOS SANTOS SILVA",
      departamento: "PARC",
      faturamento: "PARC",
      number: "1",
    },
    {
      nome: "MARIA DE FATIMA HOLANDA DOS SANTOS SILVA",
      departamento: "PARC",
      faturamento: "PARC",
      number: "1",
    },
    {
      nome: "MARIA DE FATIMA HOLANDA DOS SANTOS SILVA",
      departamento: "PARC",
      faturamento: "PARC",
      number: "1",
    },
    {
      nome: "MARIA DE FATIMA HOLANDA DOS SANTOS SILVA",
      departamento: "PARC",
      faturamento: "PARC",
      number: "1",
    },
    {
      nome: "MARIA DE FATIMA HOLANDA DOS SANTOS SILVA",
      departamento: "PARC",
      faturamento: "PARC",
      number: "1",
    },

    
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
    // Cleanup para remover o listener quando o componente for desmontado
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, handleKeyDown]);

  // Componente da Tabela para evitar repetição de código
  const TabelaComponent = () => (
    <div className="h-full w-full overflow-auto">
      <table className="min-w-full text-sm font-medium text-gray-800">
        <thead className="sticky top-0 z-10 bg-black text-white h-12">
          <tr>
            <th className="py-3 px-4 text-left">NOME</th>
            <th className="py-3 px-4 text-left">DEPARTAMENTO</th>
            <th className="py-3 px-4 text-left">FATURAMENTO</th>
            <th className="py-3 px-4 text-left"></th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {colaboradores.map((colab, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4">{colab.nome}</td>
              <td className="py-2 px-4">{colab.departamento}</td>
              <td className="py-2 px-4">{colab.faturamento}</td>
              <td className="py-2 px-4">{colab.number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {/* Container Principal */}
      <div className="relative bg-white rounded-xl shadow-md h-full overflow-hidden border border-gray-200">
        {/* Botão para abrir o modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-2 right-2 z-20 p-1 rounded-full hover:bg-gray-200"
          aria-label="Maximizar Tabela"
          title="Maximizar Tabela"
        >
          {/* Use um ícone SVG ou um componente de Imagem */}
          <Image
            src="/assets/icons/icon-maximize.svg"
            alt="Maximizar"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          
        </button>

        <TabelaComponent />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)} // Fecha ao clicar fora
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-[90vw] h-[85vh] p-4 flex flex-col relative"
            onClick={(e) => e.stopPropagation()} // Impede de fechar ao clicar dentro
          >
            <div className="relative flex justify-center items-center mb-4 flex-shrink-0">
              <h2 className="text-xl font-bold text-center  text-gray-800">
                Lista de Colaboradores
              </h2>
            
            {/* Botão de fechar o modal */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute  right-1 text-3xl text-gray-500 hover:text-gray-900 z-10"
              aria-label="Fechar modal"
            >
              &times;
            </button>
            </div>

            {/* Conteúdo do Modal (a mesma tabela) */}
            <div className=" h-[450px]">
              <TabelaComponent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
