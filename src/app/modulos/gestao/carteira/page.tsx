"use client";
import React, { useState } from "react";

export default function Carteira() {
  const [selectedOption, setSelectedOption] = useState("Selecionar Todos");


  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };


  return (
    <div className="p-4 border-b-2 border-gray-200">
      <div className="flex items-center gap-4">
        <h1 className="text-[28px] leading-8 font-cairo font-semibold text-black text-left">Carteira de Clientes</h1>

        <div className="flex items-center gap-2 ml-4">
          <select
            value={selectedOption}
            onChange={handleSelectChange}
            className="flex items-center border justify-center p-2 bg-white w-[334px] h-[36px] rounded-md"
          >
            <option>Selecionar Todos</option>
            <option>Opção 1</option>
            <option>Opção 2</option>
          </select>

          <button
            className="p-2 rounded-lg border border-gray-300 bg-white shadow-md hover:bg-gray-100 transition w-32"
            onClick={() => console.log("Data inicial clicked")}
          >
            Data inicial
          </button>
          <button
            className="p-2 rounded-lg border border-gray-300 bg-white shadow-md hover:bg-gray-100 transition w-32"
            onClick={() => console.log("Data final clicked")}
          >
            Data final
          </button>
        </div>
      </div>
    </div>
  );
}
