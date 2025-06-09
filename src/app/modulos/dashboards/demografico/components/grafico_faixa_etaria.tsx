"use client";
import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";

const data = [
  { name: "00 a 25", colaboradores: 414 },
  { name: "26 a 35", colaboradores: 885 },
  { name: "36 a 45", colaboradores: 775 },
  { name: "46 a 55", colaboradores: 518 },
  { name: "55+", colaboradores: 387 },
];

const GraficoFaixaEtaria = () => {
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

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, handleKeyDown]);

  const Grafico = () => (
    <div style={{ width: "100%", height: 250 }}>
      <h3
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        Colaboradores por Faixa Etária
      </h3>

      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          barSize={20}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" tickLine={false} />
          <Tooltip />
          <Bar dataKey="colaboradores" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <>
      <div className="relative bg-white rounded shadow p-2 h-[300px]">
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

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg w-[90vw] h-[80vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão para fechar */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-black hover:text-gray-700 text-sm rounded"
              aria-label="Fechar modal"
            >
              ✕
            </button>

            <div className="h-full flex items-center justify-center">
              <Grafico />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GraficoFaixaEtaria;
