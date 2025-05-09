"use client";
import { useState } from "react";
import Card from "./components/card";
import PieChartComponent from "./components/PieChart";
import RamoAtividadeChart from "./components/RamoAtividade";
import Evolucao from "./components/evolucao";
import Modal from "./components/modal";
import AniversariantesParceiros from "./components/aniversario-parceria";
import AniversariantesSocios from "./components/socios-aniversariantes";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function Carteira() {
  const [selectedOption, setSelectedOption] = useState("Selecionar Todos");
  const [isModalOpen, setIsModalOpen] = useState<string | null>(null);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  interface CardData {
    title: string;
    value: number;
    icon: string;
  }

  const cardsData: CardData[] = [
    { title: "Clientes Ativos", value: 712, icon: "/assets/icons/Add user 02.svg" },
    { title: "Novos Clientes", value: 150, icon: "/assets/icons/Add user 03.svg" },
    { title: "Clientes Inativos", value: 228, icon: "/assets/icons/Add user 01.svg" },
    { title: "Sem movimento / Baixados", value: 0, icon: "/assets/icons/no user 01.svg" },
    { title: "Aniversário de Parceria", value: 50, icon: "/assets/icons/clock 01.svg" },
    { title: "Sócio(s) Aniversariante(s)", value: 50, icon: "/assets/icons/business user 01.svg" }
  ];

  // Função para abrir o modal ao clicar no card
  const handleCardClick = (title: string) => {
    if (title === "Aniversário de Parceria" || title === "Sócio(s) Aniversariante(s)") {
      setIsModalOpen(title);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <div className="h-[85px] flex flex-row items-center p-4 gap-8 border-b border-black/10 bg-gray-100">
        <div className="flex items-center gap-4">
          <h1 className={`text-[32px] leading-8 ${cairo.className} font-700 text-black text-left`}>
            Carteira de Clientes
          </h1>

          <div className="flex items-center gap-2 ml-4">
            <select
              value={selectedOption}
              onChange={handleSelectChange}
              className="flex items-center justify-center p-2 shadow-md bg-white w-[334px] h-[36px] rounded-md"
            >
              <option>Selecionar Todos</option>
              <option>Opção 1</option>
              <option>Opção 2</option>
            </select>

            <button className="p-2 rounded-lg border border-gray-300 bg-white shadow-md hover:bg-gray-100 transition w-32 text-[#9CA3AF]">
              Data inicial
            </button>
            <button className="p-2 rounded-lg border border-gray-300 bg-white shadow-md hover:bg-gray-100 transition w-32 text-[#9CA3AF]">
              Data final
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-[112px] flex flex-row p-4 gap-8">
        {cardsData.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            onClick={() => handleCardClick(card.title)}
          />
        ))}
      </div>

      <div className="flex flex-row gap-2 p-4 justify-between items-center h-[381px]">
        <div className="bg-card text-card-foreground shadow w-full h-full rounded-sm overflow-auto">
          <PieChartComponent />
        </div>
        <div className="bg-card text-card-foreground shadow w-full h-full rounded-sm overflow-auto">
          <RamoAtividadeChart />
        </div>  
      </div>

      <div className="mt-4 p-4">
        <Evolucao />
      </div>

      {/* Modal de Aniversário de Parceria e Sócio Aniversariante */}
      <Modal isOpen={isModalOpen === "Aniversário de Parceria"} onClose={() => setIsModalOpen(null)}>
        <AniversariantesParceiros />
      </Modal>

      <Modal isOpen={isModalOpen === "Sócio(s) Aniversariante(s)"} onClose={() => setIsModalOpen(null)}>
        <AniversariantesSocios />
      </Modal>
    </div>
  );
}
