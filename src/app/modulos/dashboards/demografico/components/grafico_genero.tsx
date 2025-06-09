"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const GraficoGenero = ({
  masculinoPercentual = 63,
  femininoPercentual = 37,
}) => {
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

  // Componente pequeno para a tela principal
  const GraficoPequeno = () => (
    <div className="w-full h-full">
      <h3
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        Colaboradores por Gênero
      </h3>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "calc(100% - 40px)",
        }}
      >
        {/* Masculino */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "1.1em", fontWeight: "bold", color: "#007bff" }}>
            {masculinoPercentual.toFixed(1)}%
          </span>
          <Image src="/assets/icons/man.svg" alt="Ícone masculino" width={60} height={60} />
        </div>
        <div style={{ width: "1px", backgroundColor: "#ccc", height: "70%" }} />
        {/* Feminino */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "1.1em", fontWeight: "bold", color: "#ff69b4" }}>
            {femininoPercentual.toFixed(1)}%
          </span>
          <Image src="/assets/icons/woman.svg" alt="Ícone feminino" width={60} height={60} />
        </div>
      </div>
    </div>
  );

  // Componente grande para o modal
  const GraficoGrande = () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      {/* Masculino */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <span style={{ fontSize: "3em", fontWeight: "bold", color: "#007bff" }}>
          {masculinoPercentual.toFixed(1)}%
        </span>
        <Image src="/assets/icons/man.svg" alt="Ícone masculino" width={150} height={150} />
      </div>
      <div style={{ width: "2px", backgroundColor: "#ccc", height: "60%" }} />
      {/* Feminino */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <span style={{ fontSize: "3em", fontWeight: "bold", color: "#ff69b4" }}>
          {femininoPercentual.toFixed(1)}%
        </span>
        <Image src="/assets/icons/woman.svg" alt="Ícone feminino" width={150} height={150} />
      </div>
    </div>
  );

  return (
    <>
      <div className="relative bg-white rounded-xl shadow-md h-[300px]">
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-2 right-2 z-10 p-1"
        >
          <Image
            src="/assets/icons/icon-maximize.svg"
            alt="Maximizar"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>
        <div className="p-2 h-full">
            <GraficoPequeno />
        </div>
      </div>

      {/* Modal com o design e estrutura do modelo */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-2xl w-[90vw] h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do Modal */}
            <div className="relative flex justify-center items-center mb-4 flex-shrink-0">
              <h2 className="w-full text-xl font-bold text-gray-800 text-center">
                Colaboradores por Gênero
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-3xl text-gray-500 hover:text-gray-900"
                aria-label="Fechar modal"
              >
                &times;
              </button>
            </div>

            {/* Container do Gráfico Grande */}
            <div className="flex-grow w-full h-full">
              <GraficoGrande />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GraficoGenero;