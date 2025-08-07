"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";



interface GraficoLinhaProps {
  dados: {
    month: string;
    Ativos: number;
    Contratações: number;
    Demissões: number;
  }[];
}

export default function GraficoLinha({ dados }: GraficoLinhaProps) {
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

  return (
    <>
      <div className="relative bg-white p-1 rounded shadow h-[500px] w-full flex flex-col">
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

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="Ativos" // Primeira linha para Ativos
              stroke="#22C55E" // Verde
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Contratações"
              stroke="#00ADEF" // Azul
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Demissões" // Terceira linha para Demissões
              stroke="#EF4444" // Vermelho
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)} // fecha ao clicar fora
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg w-[90vw] h-[80vh] relative"
            onClick={(e) => e.stopPropagation()} // impede que clique dentro feche
          >
            {/* Botão para fechar */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-black-500 hover:text-gray-700 text-sm  rounded"
              aria-label="Fechar modal"
            >
              ✕
            </button>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dados}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="Ativos"
                  stroke="#22C55E" // Verde
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Contratações"
                  stroke="#00ADEF" // Azul
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Demissões"
                  stroke="#EF4444" // Vermelho
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}
