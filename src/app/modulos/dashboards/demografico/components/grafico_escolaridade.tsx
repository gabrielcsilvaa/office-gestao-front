"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GraficoEscolaridadeProps {
  dados: {
    escolaridade: string;
    total: number;
  }[];
  detalhes: {
    nome: string;
    escolaridade: string;
  }[];
}

export default function GraficoEscolaridade({
  dados, detalhes = [],
}: GraficoEscolaridadeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const detalhesFiltrados = detalhes.filter((func) =>
    func.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setIsModalOpen(false);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isModalOpen) {
        document.addEventListener("keydown", handleKeyDown);
      } else {
        document.removeEventListener("keydown", handleKeyDown);
      }

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isModalOpen, handleKeyDown]);

  const dadosFormatados = Array.isArray(dados)
    ? dados.map((item) => ({
      name: item.escolaridade,
      colaboradores: item.total,
    }))
    : [];

  const GraficoPequeno = () => (
    <div className="w-full h-full pt-2">
      <h3 className="text-center mb-2 font-bold">
        Colaboradores por Escolaridade
      </h3>
      <div style={{ overflowX: "auto", overflowY: "hidden", width: "100%" }}>
        <div
          style={{
            width: "600px", // força a largura do gráfico
            minWidth: "600px",
            height: `${dadosFormatados.length * 40}px`, // altura proporcional ao número de faixas
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosFormatados}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 50, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                width={120} // aumenta espaço lateral pro texto
                tick={{ fontSize: 12 }} // diminui o tamanho da fonte
              />
              <Tooltip cursor={{ fill: "#f5f5f5" }} />
              <Bar dataKey="colaboradores" barSize={20} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="relative bg-white rounded-xl shadow-md h-[300px] overflow-y-auto">
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-2 right-2 z-10 p-1"
          aria-label="Maximizar gráfico"
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

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-2xl w-[90vw] h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex justify-center items-center mb-4 flex-shrink-0">
            </div>
              <div className="max-h-[90vh] flex flex-col gap-4 overflow-x-auto w-full">
                <div className="flex items-center justify-between p-4 bg-white shadow rounded-md mb-4">
                  <h1 className="text-2xl font-bold font-cairo text-gray-800">Escolaridade dos Colaboradores</h1>
                  <div className="flex items-center gap-4">
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
                <table className="w-full border border-gray-300 text-sm font-cairo">
                  <thead>
                    <tr className="bg-gray-200 border-b border-gray-400">
                      <th className="px-4 py-2 border-r">#</th>
                      <th className="px-4 py-2 border-r">Nome</th>
                      <th className="px-4 py-2">Escolaridade</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {detalhesFiltrados.map((colaborador, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                      >
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{colaborador.nome}</td>
                        <td className="px-4 py-2">{colaborador.escolaridade || "Não informado"}</td>
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
