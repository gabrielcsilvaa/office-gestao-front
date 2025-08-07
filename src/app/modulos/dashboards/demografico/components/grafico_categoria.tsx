"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip, // Tooltip adicionado à importação
  ResponsiveContainer,
} from "recharts";

interface CategoriaData {
  name: string;
  colaboradores: number;
}

interface FuncionarioDetalhado {
  nome: string;
  categoria: string;
}

interface GraficoCategoriaProps {
  dados: CategoriaData[];
  detalhes: FuncionarioDetalhado[];
}

export default function GraficoCategoria({ dados, detalhes }: GraficoCategoriaProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredColaboradores = detalhes.filter((colab) =>
    colab.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );


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

  // Componente pequeno para a tela principal com o estilo de texto ajustado
  const GraficoPequeno = () => (
    <div className="w-full h-full pt-2">
      {/* Título com estilo inline para corresponder ao exemplo */}
      <h3
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        Colaboradores por Categoria
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={dados}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 50, bottom: 5 }}
        >
          <XAxis type="number" hide />
          {/* Eixo Y com estilo padrão para corresponder ao exemplo */}
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
          />
          {/* Tooltip adicionado para corresponder ao exemplo */}
          <Tooltip cursor={{ fill: "#f5f5f5" }} />
          <Bar dataKey="colaboradores" barSize={20} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <>
      <div className="relative bg-white rounded-xl shadow-md h-[300px]">
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-2 right-2 z-10 p-1"
        >
          <Image
            src="/assets/icons/icon-maximize.svg"
            alt="Maximizar"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>
        <GraficoPequeno />
      </div>

      {/* Modal com gráfico grande (mantido como estava, pois é mais avançado) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-2xl w-[95vw] h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho com pesquisa */}
            <div className="flex items-center justify-between p-4 bg-white shadow rounded-md mb-4">
              <h1 className="text-2xl font-bold font-cairo text-gray-800">
                Colaboradores por Categoria
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

            {/* Tabela */}
            <div className="overflow-auto flex-grow pt-4">
              <table className="w-full border border-gray-300 text-sm font-cairo">
                <thead>
                  <tr className="bg-gray-200 border-b border-gray-400 text-center">
                    <th className="px-4 py-2 border-r">#</th>
                    <th className="px-4 py-2 border-r">Nome</th>
                    <th className="px-4 py-2">Categoria</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {filteredColaboradores.map((func, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-100 border-b border-gray-300"}
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{func.nome.toUpperCase()}</td>
                      <td className="px-4 py-2">{func.categoria}</td>
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