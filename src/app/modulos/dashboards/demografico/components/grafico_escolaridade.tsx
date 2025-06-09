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

// Dados para o gráfico de escolaridade
const data = [
  { name: "Ensino Médio Com.", colaboradores: 1.7 },
  { name: "Superior Incompleto", colaboradores: 0.2 },
  { name: "Superior Completo", colaboradores: 0.5 },
  { name: "Mestrado", colaboradores: 0.0 },
  { name: "Doutorado", colaboradores: 0.0 },
];

export default function GraficoEscolaridade() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Componente pequeno para a tela principal, seguindo o estilo do modelo
  const GraficoPequeno = () => (
    <div className="w-full h-full pt-2">
      <h3
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        Colaboradores por Escolaridade
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 50, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
          />
          <Tooltip cursor={{ fill: "#f5f5f5" }} />
          <Bar dataKey="colaboradores" barSize={20} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <>
      {/* Container principal com o mesmo estilo do modelo */}
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

      {/* Modal com gráfico grande, baseado no modelo */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-2xl w-[90vw] h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do Modal */}
            <div className="relative flex justify-center items-center mb-4 flex-shrink-0">
                <h2 className="w-full text-xl font-bold text-gray-800 text-center">
                    Colaboradores por Escolaridade
                </h2>
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-3xl text-gray-500 hover:text-gray-900"
                    aria-label="Fechar modal"
                >
                    &times;
                </button>
            </div>

            {/* Container do Gráfico Grande */}
            <div className="flex-grow w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 70, bottom: 20 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 14, fill: "#333" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f5f5f5" }}
                    contentStyle={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      border: "1px solid #ddd",
                    }}
                  />
                  <Bar dataKey="colaboradores" barSize={35} fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}