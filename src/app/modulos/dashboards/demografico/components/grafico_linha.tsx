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

const dadosMock = [
  { mes: "Jan/24", valor: 400 },
  { mes: "Fev/24", valor: 300 },
  { mes: "Mar/24", valor: 500 },
  { mes: "Abr/24", valor: 200 },
  { mes: "Mai/24", valor: 450 },
  { mes: "Jun/24", valor: 350 },
  { mes: "Jul/24", valor: 480 },
  { mes: "Ago/24", valor: 320 },
  { mes: "Set/24", valor: 410 },
  { mes: "Out/24", valor: 390 },
  { mes: "Nov/24", valor: 470 },
  { mes: "Dez/24", valor: 430 },
];

export default function GraficoLinha() {
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
      <div className="relative bg-white p-1 rounded shadow h-[500px] w-[657px] flex flex-col ">
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

        <ResponsiveContainer width="100%" height="250%">
          <LineChart data={dadosMock}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#00ADEF"
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
              <LineChart data={dadosMock}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#00ADEF"
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
