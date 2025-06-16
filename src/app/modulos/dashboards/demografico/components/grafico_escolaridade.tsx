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
}

export default function GraficoEscolaridade({
  dados = [],
}: GraficoEscolaridadeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <ResponsiveContainer width="100%" height="90%">
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
            width={50} // aumenta espaço lateral pro texto
            tick={{ fontSize: 10 }} // diminui o tamanho da fonte
          />
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
            <div className="flex-grow w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dadosFormatados}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 70, bottom: 20 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    width={180} // mais espaço pro texto
                    tick={{ fontSize: 12, fill: "#333" }} // fonte um pouco menor
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
