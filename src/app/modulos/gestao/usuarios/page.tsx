"use client";
import { Cairo } from "next/font/google";
import React, { useState } from "react";

import UserChart from "./components/chart";

const cairo = Cairo({
  weight: ["500", "600", "700"], // Você pode especificar os pesos que deseja (normal e negrito)
  subsets: ["latin"],
});


export default function Usuarios() {
  const [selectedOption, setSelectedOption] = useState("Selecionar Todos");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="bg-gray-100 max-h-screen max-w-screen">
      <div className="h-[85px] flex flex-row items-center p-4 gap-8 border-b border-black/10 bg-gray-100">
        <div className="flex items-center gap-4">
          <h1
            className={`text-[32px] leading-8 ${cairo.className} font-700 text-black text-left`}
          >
            Análise de Usuários
          </h1>

          <div className="flex items-center gap-2 ml-4 ">
            <select
              value={selectedOption}
              onChange={handleSelectChange}
              className="flex items-center justify-center p-2 shadow-md bg-white w-[334px] h-[36px] rounded-md"
            >
              <option>Selecionar Todos</option>
              <option>Opção 1</option>
              <option>Opção 2</option>
            </select>

            <button
              className="p-2 rounded-lg border border-gray-300 bg-white shadow-md hover:bg-gray-100 transition w-32 text-[#9CA3AF]"
              onClick={() => console.log("Data inicial clicked")}
            >
              Data inicial
            </button>
            <button
              className="p-2 rounded-lg border border-gray-300 bg-white shadow-md hover:bg-gray-100 transition w-32 text-[#9CA3AF]"
              onClick={() => console.log("Data final clicked")}
            >
              Data final
            </button>
          </div>
        </div>
      </div>

      <div className="justify-center">
        <div className="w-full flex gap-[17px]  p-3">
          <div className="usuarios-card  p-3">
            <p className="text-xs text-gray-500">
              Total de Atividades Realizadas
            </p>
            <p className="text-xl font-semibold text-black">3.463.508</p>
          </div>

          <div className="usuarios-card p-3">
            <p className="text-xs text-gray-500">Importações totais</p>
            <p className="text-xl font-semibold text-black">2.236.636</p>
          </div>

          <div className="usuarios-card p-3">
            <p className="text-xs text-gray-500">
              Total de Atividades por Módulos
            </p>
            <p className="text-xl font-semibold text-black">1.133.734</p>
          </div>

          <div className="usuarios-card p-3">
            <p className="text-xs text-gray-500">
              Total de Lançamentos Manuais
            </p>
            <p className="text-xl font-semibold text-black">93.138</p>
          </div>

          <div className="usuarios-card p-3">
            <p className="text-xs text-gray-500">Total de Horas Ativas</p>
            <p className="text-xl font-semibold text-black">34.662.66 h</p>
          </div>
        </div>

        <div>
          <UserChart/>

          <div className="w-full flex justify-center">
            <div className="grid grid-cols-2 gap-4 p-3">
              <button className="bg-white border border-gray-300 w-[500px] h-[70px]  hover:bg-gray-100  ">
                Lista de Usuários
              </button>
              <button className="bg-white border border-gray-300 w-[500px] h-[70px]  hover:bg-gray-100 ">
                Atividade por Usuário
              </button>

              <button className="bg-white border border-gray-300 w-[500px] h-[70px] hover:bg-gray-100">
                Atividade Por Módulo
              </button>
              <button className="bg-white border border-gray-300 w-[500px] h-[70px] hover:bg-gray-100">
                Atividade Por Cliente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
