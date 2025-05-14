import React, { ReactNode } from "react";
import Organograma from "./organogramaGen";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  codiEmp: string | null | number;
}

export default function ModalSocio({ isOpen, onClose, codiEmp, children }: ModalProps) {
  if (!isOpen) return null;

  

  const pessoa = {
    id: "1",
    nome: "João",
    cargo: "Gerente",
    filhos: [
      { id: "2", nome: "Maria", cargo: "Analista" },
      {
        id: "3",
        nome: "Pedro",
        cargo: "Desenvolvedor",
        filhos: [
          { id: "4", nome: "Ana", cargo: "Estagiária" },
          { id: "5", nome: "Lucas", cargo: "Estagiário" },
        ],
      },
    ],
  };
  return (
    <div className="border-0 fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto">
      <div className="w-full max-w-[80vw] bg-white rounded-lg shadow-lg ">
        {/* conteúdo do modal */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Modal Título</h2>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-500 hover:text-gray-800"
          >
            ×
          </button>
        </div>
        <div className="mt-4">{children}</div>
        {codiEmp}
        <Organograma />
      </div>
    </div>
  );
}
