"use client";

import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  // Fechar com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose} // Clicar fora do modal
    >
      <div className="w-[1300px] bg-white rounded-2xl shadow-lg p-6 animate-fade-fast relative"
        onClick={(e) => e.stopPropagation()} // Impede fechamento ao clicar dentro
      >
        <button
          className="absolute top-4 right-6 text-gray-600 hover:text-red-500 text-xl"
          onClick={onClose}
        >
        </button>
        {children}
      </div>
    </div>
  );
}