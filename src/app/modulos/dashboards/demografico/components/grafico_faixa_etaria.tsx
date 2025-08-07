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

interface FuncionarioDetalhado {
  nome: string;
  data_nascimento: string;
}

interface GraficoFaixaEtariaProps {
  dados: {
    name: string;
    colaboradores: number;
  }[];
  detalhes: FuncionarioDetalhado[];
}


export default function GraficoFaixaEtaria({ dados, detalhes }: GraficoFaixaEtariaProps) {
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

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, handleKeyDown]);

  const calcularIdade = (dataNascimento: string): number => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade;
  };
  const GraficoPequeno = () => (
    <div className="w-full h-full pt-2">
      <h3
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        Colaboradores por Faixa Etária
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={dados}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" tickLine={false} />
          <Tooltip cursor={{ fill: "#f5f5f5" }} />
          <Bar dataKey="colaboradores" barSize={20} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );


  const filteredColaboradores = detalhes.filter((colab) =>
    colab.nome.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="p-2 h-full">
          <GraficoPequeno />
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-2xl w-[95vw] h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between p-4 bg-white shadow rounded-md mb-4">
              <h1 className="text-2xl font-bold font-cairo text-gray-800">
                Colaboradores por Faixa Etária
              </h1>

              <input
                type="text"
                placeholder="Pesquisar por nome..."
                className="border border-gray-300 rounded-md p-2 w-96 text-sm ml-auto"
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

            {/* Tabela */}
            <div className="overflow-auto flex-grow pt-4">
              <table className="w-full border border-gray-300 text-sm font-cairo">
                <thead>
                  <tr className="bg-gray-200 border-b border-gray-400 text-center">
                    <th className="px-4 py-2 border-r">#</th>
                    <th className="px-4 py-2 border-r">Nome</th>
                    <th className="px-4 py-2 border-r">Data de Nascimento</th>
                    <th className="px-4 py-2">Idade</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {filteredColaboradores.map((func, index) => {
                    const idade = calcularIdade(func.data_nascimento);
                    const dataFormatada = new Date(func.data_nascimento)
                      .toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      });

                    const rowClass =
                      index % 2 === 0 ? "bg-white" : "bg-gray-100";

                    return (
                      <tr
                        key={index}
                        className={`${rowClass} border-b border-gray-300`}
                      >
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{func.nome.toUpperCase()}</td>
                        <td className="px-4 py-2">{dataFormatada}</td>
                        <td className="px-4 py-2">{idade} anos</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
