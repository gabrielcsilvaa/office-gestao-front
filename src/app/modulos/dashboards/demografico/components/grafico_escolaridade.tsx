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

  // Componente reutilizável do gráfico
  const Grafico = () => (
    <div style={{ width: "100%", height: 250 }}>
      <h3
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        Colaboradores por Escolaridade
      </h3>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          barSize={20}
          margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" tickLine={false} />
          <Tooltip />
          {/* A cor da barra foi mantida para diferenciar os gráficos */}
          <Bar dataKey="colaboradores" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <>
      {/* Container principal com o estilo aplicado */}
      <div className="relative bg-white rounded p-2 h-[300px]">
        {/* Botão de maximizar */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-2 right-2 z-10"
        >
          <Image
            src="/assets/icons/icon-maximize.svg"
            alt="Maximizar"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>

        <Grafico />
      </div>

      {/* Modal para visualização expandida */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-4 rounded-lg w-[90vw] h-[80vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de fechar o modal */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-black hover:text-gray-700 text-sm rounded"
              aria-label="Fechar modal"
            >
              ✕
            </button>

            <div className="h-full *: flex items-center justify-center">
              <div className="w-full h-full ">
                {/* Gráfico dentro do modal */}
                <ResponsiveContainer width="100%" height="250%">
                  <BarChart
                    data={data}
                    layout="vertical"
                    barSize={20}
                    margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="colaboradores" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}