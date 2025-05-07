"use client";
import { Cairo } from "next/font/google";
import React, { useState } from "react";

const cairo = Cairo({
    weight: ["500", "600", "700"], // Você pode especificar os pesos que deseja (normal e negrito)
    subsets: ["latin"],
  });

export default function Carteira() {
  const [selectedOption, setSelectedOption] = useState("Selecionar Todos");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="bg-gray-100 min-h-screen"> 
      <div className="h-[85px] flex flex-row items-center p-4 gap-8 border-b border-black/10 bg-gray-100"> 
        <div className="flex items-center gap-4">
          <h1 className= {`text-[32px] leading-8 ${cairo.className} font-700 text-black text-left`}>Carteira de Clientes</h1>

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
    </div>
  );
}
